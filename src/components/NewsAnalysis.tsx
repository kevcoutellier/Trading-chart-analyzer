import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, AlertCircle, ExternalLink } from 'lucide-react';
import { newsService } from '../services/newsService';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  source: string;
  publishedAt: string;
  url: string;
}

interface NewsAnalysisProps {
  symbol: string;
}

const NewsAnalysis: React.FC<NewsAnalysisProps> = ({ symbol }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<{
    overall: 'bullish' | 'bearish' | 'neutral';
    score: number;
  }>({ overall: 'neutral', score: 0 });

  useEffect(() => {
    if (symbol) {
      fetchNews();
    }
  }, [symbol]);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utilisation du service de recherche d'actualités avec IA
      const result = await newsService.searchFinancialNews(symbol);
      
      // Validation des données reçues
      if (!result.articles || !Array.isArray(result.articles) || result.articles.length === 0) {
        throw new Error('Aucune actualité trouvée par Claude');
      }
      
      // Conversion des données pour l'interface
      const processedNews: NewsItem[] = result.articles.map((article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        sentiment: article.sentiment,
        impact: article.impact,
        source: article.source,
        publishedAt: article.publishedAt,
        url: article.url
      }));
      
      setNews(processedNews);
      setMarketSentiment(result.marketSentiment);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération des actualités';
      setError(errorMessage);
      setNews([]);
      setMarketSentiment({
        overall: 'neutral',
        score: 0
      });
    }
    
    setIsLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'negative': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-300';
      case 'medium': return 'text-yellow-300';
      case 'low': return 'text-green-300';
      default: return 'text-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'bearish': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!symbol) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
          <Newspaper className="w-5 h-5" />
          Analyse des News
        </h2>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400">Entrez un symbole pour voir l'analyse des news</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Newspaper className="w-5 h-5" />
          Analyse des News
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded text-xs font-medium ml-2">
            Claude IA
          </span>
        </h2>
        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
          {symbol.toUpperCase()}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Claude recherche les actualités financières...</p>
          <p className="text-gray-500 text-xs mt-2">Analyse IA en temps réel</p>
        </div>
      ) : (
        <>
          {/* Sentiment Global */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Sentiment du Marché</h3>
              {getSentimentIcon(marketSentiment.overall)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{marketSentiment.overall}</span>
              <span className={`font-bold ${
                marketSentiment.score > 0 ? 'text-green-400' : 
                marketSentiment.score < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {marketSentiment.score > 0 ? '+' : ''}{marketSentiment.score}%
              </span>
            </div>
          </div>

          {/* Liste des News */}
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm leading-tight flex-1 mr-3">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs border ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment}
                    </span>
                    <span className={`text-xs ${getImpactColor(item.impact)}`}>
                      {item.impact}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Lire
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <button 
              onClick={fetchNews}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Actualiser les news
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsAnalysis;