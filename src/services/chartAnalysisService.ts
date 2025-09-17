// Service pour l'analyse réelle des graphiques de trading avec IA

interface ChartAnalysis {
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  entryPrice?: number;
  potentialGain?: number;
  potentialLoss?: number;
  timeframe?: string;
  momentum?: number;
  volatility?: 'LOW' | 'MEDIUM' | 'HIGH';
  trendStrength?: number;
  technicalAnalysis: {
    trend: string;
    support: number;
    resistance: number;
    indicators: string[];
  };
}

export class ChartAnalysisService {
  
  /**
   * Analyse un graphique de trading avec IA
   */
  async analyzeChart(imageDataUrl: string, symbol: string): Promise<ChartAnalysis> {
    try {
      // Appel à l'API d'analyse d'image
      const response = await fetch('/api/analyze-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,
          symbol: symbol
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const analysisData = await response.json();
      return this.processAnalysisResult(analysisData, symbol);

    } catch (error) {
      console.error('Erreur lors de l\'analyse du graphique:', error);
      throw new Error('Impossible d\'analyser le graphique');
    }
  }

  /**
   * Traite les résultats de l'analyse IA
   */
  private processAnalysisResult(analysisData: any, _symbol: string): ChartAnalysis {
    console.log('DEBUG: Processing analysis data:', analysisData);
    
    return {
      signal: analysisData.signal || 'NEUTRAL',
      confidence: analysisData.confidence || 0,
      takeProfit: analysisData.takeProfit || 0,
      stopLoss: analysisData.stopLoss || 0,
      riskReward: analysisData.riskReward || 1,
      entryPrice: analysisData.entryPrice,
      potentialGain: analysisData.potentialGain,
      potentialLoss: analysisData.potentialLoss,
      timeframe: analysisData.timeframe,
      momentum: analysisData.momentum,
      volatility: analysisData.volatility,
      trendStrength: analysisData.trendStrength,
      technicalAnalysis: {
        trend: (analysisData.technicalAnalysis?.trend || analysisData.trend) || 'Analyse en cours',
        support: (analysisData.technicalAnalysis?.support || analysisData.support) || 0,
        resistance: (analysisData.technicalAnalysis?.resistance || analysisData.resistance) || 0,
        indicators: (analysisData.technicalAnalysis?.indicators || analysisData.indicators) || []
      }
    };
  }

}

// Instance singleton
export const chartAnalysisService = new ChartAnalysisService();