import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import des fonctions API
async function loadAPIHandlers() {
  const handlers = {};
  
  try {
    console.log('Loading analyze-chart module...');
    const analyzeChartModule = await import('./api/analyze-chart.js');
    handlers.analyzeChart = analyzeChartModule.default;
    console.log('✅ analyze-chart loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load analyze-chart:', error.message);
  }
  
  try {
    console.log('Loading web-search module...');
    const webSearchModule = await import('./api/web-search.js');
    handlers.webSearch = webSearchModule.default;
    console.log('✅ web-search loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load web-search:', error.message);
  }
  
  try {
    console.log('Loading search-news module...');
    const searchNewsModule = await import('./api/search-news.js');
    handlers.searchNews = searchNewsModule.default;
    console.log('✅ search-news loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load search-news:', error.message);
  }
  
  return handlers;
}

// Routes API
app.post('/api/analyze-chart', async (req, res) => {
  try {
    const { analyzeChart } = await loadAPIHandlers();
    if (analyzeChart) {
      await analyzeChart(req, res);
    } else {
      res.status(503).json({ 
        error: 'Service d\'analyse non disponible',
        message: 'Configurez ANTHROPIC_API_KEY dans .env' 
      });
    }
  } catch (error) {
    console.error('Erreur analyze-chart:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: error.message 
    });
  }
});

app.post('/api/web-search', async (req, res) => {
  try {
    const { webSearch } = await loadAPIHandlers();
    if (webSearch) {
      await webSearch(req, res);
    } else {
      res.status(503).json({ 
        error: 'Service de recherche non disponible' 
      });
    }
  } catch (error) {
    console.error('Erreur web-search:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: error.message 
    });
  }
});

app.post('/api/search-news', async (req, res) => {
  try {
    const { searchNews } = await loadAPIHandlers();
    if (searchNews) {
      await searchNews(req, res);
    } else {
      res.status(503).json({ 
        error: 'Service de news non disponible' 
      });
    }
  } catch (error) {
    console.error('Erreur search-news:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasGoogleKey: !!process.env.GOOGLE_CLOUD_API_KEY,
      hasNewsKey: !!process.env.NEWS_API_KEY
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   POST /api/analyze-chart`);
  console.log(`   POST /api/web-search`);
  console.log(`   POST /api/search-news`);
  console.log(`   GET  /api/health`);
  
  // Afficher le statut des clés API
  console.log(`\n🔐 API Keys status:`);
  console.log(`   Anthropic/Claude: ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Google Cloud: ${process.env.GOOGLE_CLOUD_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   News API: ${process.env.NEWS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});