// API endpoint pour la recherche d'actualités avec IA
// Utilise l'outil WebSearch de Claude pour rechercher des actualités en temps réel

export default async function handler(req, res) {
  // Permettre uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, symbol } = req.body;

  if (!query || !symbol) {
    return res.status(400).json({ error: 'Query and symbol are required' });
  }

  try {
    // Recherche web des actualités financières
    const searchResults = await searchFinancialNews(query, symbol);
    
    // Analyse du sentiment avec IA
    const analyzedArticles = await analyzeNewsWithAI(searchResults, symbol);

    res.status(200).json({
      articles: analyzedArticles,
      timestamp: new Date().toISOString(),
      symbol: symbol.toUpperCase()
    });

  } catch (error) {
    console.error('Erreur dans search-news API:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la recherche des actualités',
      message: error.message 
    });
  }
}

async function searchFinancialNews(query, symbol) {
  // Cette fonction utiliserait l'outil WebSearch de Claude
  // Pour la démo, nous simulons des résultats de recherche web
  
  const simulatedSearchResults = [
    {
      title: `${symbol.toUpperCase()} Trading Alert: Key Support Level Tested`,
      snippet: `Recent market activity shows ${symbol.toUpperCase()} approaching critical technical levels with increased volume...`,
      url: 'https://example-finance-news.com/article1',
      source: 'Financial News',
      publishedDate: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 heures
    },
    {
      title: `Central Bank Policy Impact on ${symbol.includes('USD') ? 'Dollar' : 'Currency'} Markets`,
      snippet: 'Latest monetary policy decisions are creating volatility across major currency pairs...',
      url: 'https://example-reuters.com/article2',
      source: 'Reuters',
      publishedDate: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 heures
    },
    {
      title: `Market Analysis: ${symbol.toUpperCase()} Outlook Following Economic Data`,
      snippet: 'Economic indicators released today show mixed signals for the trading pair...',
      url: 'https://example-bloomberg.com/article3',
      source: 'Bloomberg',
      publishedDate: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 heures
    }
  ];

  return simulatedSearchResults;
}

async function analyzeNewsWithAI(searchResults, symbol) {
  // Cette fonction utiliserait Claude pour analyser le sentiment et l'impact
  
  const analyzedArticles = searchResults.map((article, index) => {
    // Simulation de l'analyse IA du sentiment
    const sentiments = ['positive', 'negative', 'neutral'];
    const impacts = ['high', 'medium', 'low'];
    
    // Logique simplifiée pour déterminer le sentiment basé sur les mots-clés
    let sentiment = 'neutral';
    let impact = 'medium';
    
    const textToAnalyze = (article.title + ' ' + article.snippet).toLowerCase();
    
    if (textToAnalyze.includes('support') || textToAnalyze.includes('bullish') || textToAnalyze.includes('rise')) {
      sentiment = 'positive';
    } else if (textToAnalyze.includes('break') || textToAnalyze.includes('fall') || textToAnalyze.includes('bearish')) {
      sentiment = 'negative';
    }
    
    if (textToAnalyze.includes('alert') || textToAnalyze.includes('policy') || textToAnalyze.includes('volatility')) {
      impact = 'high';
    } else if (textToAnalyze.includes('mixed') || textToAnalyze.includes('moderate')) {
      impact = 'medium';
    }

    return {
      id: `news_${index + 1}`,
      title: article.title,
      summary: generateSummary(article.snippet, symbol),
      sentiment: sentiment,
      impact: impact,
      source: article.source,
      publishedAt: getRelativeTime(article.publishedDate),
      url: article.url
    };
  });

  return analyzedArticles;
}

function generateSummary(snippet, symbol) {
  // Génère un résumé plus contextuel
  const summaries = [
    `Analyse technique récente de ${symbol.toUpperCase()} montrant des signaux importants pour les traders.`,
    `Les dernières données économiques influencent directement les mouvements de ${symbol.toUpperCase()}.`,
    `Facteurs macroéconomiques créant des opportunités de trading sur ${symbol.toUpperCase()}.`
  ];
  
  return snippet.length > 100 ? snippet : summaries[Math.floor(Math.random() * summaries.length)];
}

function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Il y a quelques minutes';
  if (diffHours === 1) return 'Il y a 1 heure';
  if (diffHours < 24) return `Il y a ${diffHours} heures`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays} jours`;
}