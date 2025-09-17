import React from 'react';
import { TrendingUp, TrendingDown, Target, Shield, BarChart3, AlertTriangle, Clock, Volume2, Activity, Zap, DollarSign, Signal } from 'lucide-react';

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

interface AnalysisResultProps {
  data: AnalysisData;
  symbol: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, symbol }) => {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'LONG': return 'text-green-400';
      case 'SHORT': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'LONG': return <TrendingUp className="w-6 h-6" />;
      case 'SHORT': return <TrendingDown className="w-6 h-6" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getVolatilityColor = (volatility?: string) => {
    switch (volatility) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMomentumColor = (momentum?: number) => {
    if (!momentum) return 'text-gray-400';
    if (momentum >= 70) return 'text-green-400';
    if (momentum >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Résultat d'Analyse
        </h2>
        {symbol && (
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
            {symbol.toUpperCase()}
          </span>
        )}
      </div>

      {/* Signal Principal */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`${getSignalColor(data.signal)}`}>
              {getSignalIcon(data.signal)}
            </div>
            <div>
              <div className={`text-2xl font-bold ${getSignalColor(data.signal)}`}>
                {data.signal}
              </div>
              <div className="text-gray-400 text-sm">Signal de trading</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${getConfidenceColor(data.confidence)}`}>
              {data.confidence}%
            </div>
            <div className="text-gray-400 text-sm">Confiance</div>
          </div>
        </div>
      </div>

      {/* Prix d'Entrée et Potentiel */}
      {data.entryPrice && (
        <div className="mb-6">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Prix d'Entrée Suggéré</span>
              </div>
              <div className="text-xl font-bold text-white">
                {data.entryPrice.toFixed(4)}
              </div>
            </div>
            {(data.potentialGain || data.potentialLoss) && (
              <div className="mt-3 flex justify-between text-sm">
                {data.potentialGain && (
                  <span className="text-green-400">
                    Gain potentiel: +{data.potentialGain.toFixed(2)}%
                  </span>
                )}
                {data.potentialLoss && (
                  <span className="text-red-400">
                    Perte potentielle: -{data.potentialLoss.toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Niveaux de Prix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Take Profit</span>
          </div>
          <div className="text-lg font-bold text-white">
            {data.takeProfit.toFixed(4)}
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">Stop Loss</span>
          </div>
          <div className="text-lg font-bold text-white">
            {data.stopLoss.toFixed(4)}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">R:R Ratio</span>
          </div>
          <div className="text-lg font-bold text-white">
            1:{data.riskReward.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Métriques Avancées */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {data.timeframe && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-xs">Timeframe</span>
            </div>
            <div className="text-sm font-semibold text-white">{data.timeframe}</div>
          </div>
        )}

        {data.momentum !== undefined && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 text-xs">Momentum</span>
            </div>
            <div className={`text-sm font-semibold ${getMomentumColor(data.momentum)}`}>
              {data.momentum}%
            </div>
          </div>
        )}

        {data.volatility && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300 text-xs">Volatilité</span>
            </div>
            <div className={`text-sm font-semibold ${getVolatilityColor(data.volatility)}`}>
              {data.volatility}
            </div>
          </div>
        )}

        {data.trendStrength !== undefined && (
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Signal className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300 text-xs">Force Trend</span>
            </div>
            <div className={`text-sm font-semibold ${getMomentumColor(data.trendStrength)}`}>
              {data.trendStrength}%
            </div>
          </div>
        )}
      </div>

      {/* Analyse Technique */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Analyse Technique</h3>
        
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-gray-300 mb-4">{data.technicalAnalysis.trend}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-400 text-sm">Support:</span>
              <div className="text-white font-medium">{data.technicalAnalysis.support}</div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Résistance:</span>
              <div className="text-white font-medium">{data.technicalAnalysis.resistance}</div>
            </div>
          </div>
          
          <div>
            <span className="text-gray-400 text-sm mb-2 block">Indicateurs détectés:</span>
            <div className="flex flex-wrap gap-2">
              {data.technicalAnalysis.indicators.map((indicator, index) => (
                <span
                  key={index}
                  className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                >
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-200 text-sm">
            <strong>Avertissement:</strong> Cette analyse est générée par IA et ne constitue pas un conseil financier. 
            Toujours faire ses propres recherches avant de trader.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;