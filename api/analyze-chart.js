import Anthropic from '@anthropic-ai/sdk';

// API endpoint pour l'analyse de graphiques de trading avec IA
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, symbol } = req.body;

  if (!image || !symbol) {
    return res.status(400).json({ error: 'Image and symbol are required' });
  }

  try {
    // Analyse du graphique avec IA
    const analysisResult = await analyzeChartWithAI(image, symbol);

    res.status(200).json({
      ...analysisResult,
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur dans analyze-chart API:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'analyse du graphique',
      message: error.message 
    });
  }
}

async function analyzeChartWithAI(imageDataUrl, symbol) {
  try {
    // Utiliser uniquement Claude avec vision
    const claudeResult = await analyzeWithClaude(imageDataUrl, symbol);
    return claudeResult;
    
  } catch (error) {
    console.error('Erreur analyse Claude:', error);
    throw error;
  }
}

async function analyzeWithClaude(imageDataUrl, symbol) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  const MAX_TOKENS_ANALYSIS = parseInt(process.env.MAX_TOKENS_ANALYSIS || '1000');
  const MAX_IMAGE_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || '10485760');

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required for image analysis');
  }
  
  console.log('DEBUG: Using API key:', ANTHROPIC_API_KEY?.substring(0, 20) + '...');

  try {
    // Initialiser le client Anthropic
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    // Extraire l'image base64 depuis l'URL data
    const base64Image = imageDataUrl.split(',')[1];
    const mediaType = imageDataUrl.split(';')[0].split(':')[1];

    // Vérifier la taille de l'image
    const imageSize = (base64Image.length * 3) / 4;
    if (imageSize > MAX_IMAGE_SIZE) {
      throw new Error(`Image too large: ${Math.round(imageSize / 1024 / 1024)}MB. Maximum allowed: ${Math.round(MAX_IMAGE_SIZE / 1024 / 1024)}MB`);
    }

    let response;
    let retries = 3;
    
    while (retries > 0) {
      try {
        response = await anthropic.messages.create({
          model: ANTHROPIC_MODEL,
          max_tokens: MAX_TOKENS_ANALYSIS,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyse technique ${symbol}. Format JSON:
{
  "signal": "LONG|SHORT|NEUTRAL",
  "confidence": 75,
  "takeProfit": 1.2890,
  "stopLoss": 1.2345,
  "riskReward": 2.5,
  "entryPrice": 1.2500,
  "potentialGain": 15.5,
  "potentialLoss": 8.2,
  "timeframe": "4H",
  "momentum": 85,
  "volatility": "MEDIUM",
  "trendStrength": 90,
  "trend": "Description tendance",
  "support": 1.2300,
  "resistance": 1.2900,
  "indicators": ["RSI", "MACD", "Volume"]
}`
                },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Image
                  }
                }
              ]
            }
          ]
        });
        break;
      } catch (error) {
        if ((error.status === 529 || error.status === 429) && retries > 1) {
          const waitTime = error.status === 429 ? 60000 : 2000; // 60s pour rate limit, 2s pour overload
          const errorType = error.status === 429 ? 'Rate limit exceeded' : 'API overloaded';
          console.log(`${errorType}, retrying in ${waitTime/1000}s... (${retries-1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries--;
        } else if (error.status === 529 || error.status === 429) {
          const errorType = error.status === 429 ? 'Limite de taux dépassée' : 'API temporairement surchargée';
          console.log(`${errorType}, returning fallback response`);
          return {
            signal: 'NEUTRAL',
            confidence: 0,
            takeProfit: 0,
            stopLoss: 0,
            riskReward: 1,
            entryPrice: 0,
            potentialGain: 0,
            potentialLoss: 0,
            timeframe: '4H',
            momentum: 50,
            volatility: 'MEDIUM',
            trendStrength: 50,
            technicalAnalysis: {
              trend: `Analyse indisponible - ${errorType}. Veuillez réessayer dans quelques instants.`,
              support: 0,
              resistance: 0,
              indicators: ['Service temporairement indisponible']
            }
          };
        } else {
          throw error;
        }
      }
    }

    const content = response.content[0]?.text;
    console.log('DEBUG: Claude response content:', content);
    
    if (content) {
      const parsedResult = parseAIResponse(content, symbol);
      console.log('DEBUG: Parsed result:', parsedResult);
      return parsedResult;
    }

    return null;

  } catch (error) {
    console.error('Erreur Claude Vision:', error);
    return null;
  }
}



function parseAIResponse(content, symbol) {
  try {
    // Tentative de parsing JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validation des données requises
    if (!parsed.signal || !['LONG', 'SHORT', 'NEUTRAL'].includes(parsed.signal)) {
      throw new Error('Invalid or missing signal in response');
    }
    
    if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 100) {
      throw new Error('Invalid confidence value in response');
    }
    
    // Calcul automatique de certaines métriques si manquantes
    const currentPrice = parsed.entryPrice || ((parsed.takeProfit + parsed.stopLoss) / 2) || 100;
    const tpGain = parsed.takeProfit ? ((parsed.takeProfit - currentPrice) / currentPrice * 100) : 0;
    const slLoss = parsed.stopLoss ? ((currentPrice - parsed.stopLoss) / currentPrice * 100) : 0;

    return {
      signal: parsed.signal,
      confidence: parsed.confidence,
      takeProfit: parsed.takeProfit || 0,
      stopLoss: parsed.stopLoss || 0,
      riskReward: parsed.riskReward || 1,
      // Nouvelles propriétés avec valeurs par défaut intelligentes
      entryPrice: parsed.entryPrice || currentPrice,
      potentialGain: parsed.potentialGain || Math.abs(tpGain),
      potentialLoss: parsed.potentialLoss || Math.abs(slLoss),
      timeframe: parsed.timeframe || '4H',
      momentum: parsed.momentum || (parsed.confidence > 70 ? 75 : parsed.confidence > 50 ? 60 : 45),
      volatility: parsed.volatility || (parsed.confidence > 80 ? 'LOW' : parsed.confidence > 50 ? 'MEDIUM' : 'HIGH'),
      trendStrength: parsed.trendStrength || parsed.confidence,
      technicalAnalysis: {
        trend: parsed.trend || 'No trend analysis provided',
        support: parsed.support || 0,
        resistance: parsed.resistance || 0,
        indicators: parsed.indicators || []
      }
    };

  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}
