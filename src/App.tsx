import React, { useState } from 'react';
import { Upload, BarChart3, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import NewsAnalysis from './components/NewsAnalysis';
import { chartAnalysisService } from './services/chartAnalysisService';

interface AnalysisData {
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

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symbol, setSymbol] = useState('');

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setAnalysisData(null);
  };

  const analyzeChart = async () => {
    if (!uploadedImage || !symbol) {
      alert('Veuillez charger une image et entrer un symbole');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Utilisation du service d'analyse réel
      const analysis = await chartAnalysisService.analyzeChart(uploadedImage, symbol);
      
      const analysisData: AnalysisData = {
        signal: analysis.signal,
        confidence: analysis.confidence,
        takeProfit: analysis.takeProfit,
        stopLoss: analysis.stopLoss,
        riskReward: analysis.riskReward,
        entryPrice: analysis.entryPrice,
        potentialGain: analysis.potentialGain,
        potentialLoss: analysis.potentialLoss,
        timeframe: analysis.timeframe,
        momentum: analysis.momentum,
        volatility: analysis.volatility,
        trendStrength: analysis.trendStrength,
        technicalAnalysis: {
          trend: analysis.technicalAnalysis.trend,
          support: analysis.technicalAnalysis.support,
          resistance: analysis.technicalAnalysis.resistance,
          indicators: analysis.technicalAnalysis.indicators
        }
      };
      
      setAnalysisData(analysisData);
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      alert('Erreur lors de l\'analyse du graphique. Vérifiez votre connexion et réessayez.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              Trading Chart Analyzer
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Analysez vos graphiques de trading avec l'intelligence artificielle. 
            Obtenez des signaux, niveaux de prix et analyses de marché instantanément.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Controls */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload de Graphique
              </h2>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Symbole (ex: EURUSD, BTCUSD...)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <ImageUploader onImageUpload={handleImageUpload} />
              
              {uploadedImage && (
                <div className="mt-4">
                  <button
                    onClick={analyzeChart}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5" />
                        Analyser le Graphique
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 backdrop-blur-md rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 text-sm font-medium">LONG</span>
                </div>
                <div className="text-2xl font-bold text-white">73%</div>
                <div className="text-green-200 text-xs">Signaux cette semaine</div>
              </div>
              
              <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 text-sm font-medium">SHORT</span>
                </div>
                <div className="text-2xl font-bold text-white">27%</div>
                <div className="text-red-200 text-xs">Signaux cette semaine</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {analysisData ? (
              <>
                <AnalysisResult data={analysisData} symbol={symbol} />
                <NewsAnalysis symbol={symbol} />
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">
                  En attente d'analyse
                </h3>
                <p className="text-gray-400">
                  Uploadez un graphique pour obtenir une analyse détaillée
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
