// Service pour rechercher des actualités financières avec l'IA
// Ce service utilise directement l'outil WebSearch de Claude

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  source: string;
  publishedAt: string;
  url: string;
}

interface NewsSearchResult {
  articles: NewsArticle[];
  marketSentiment: {
    overall: 'bullish' | 'bearish' | 'neutral';
    score: number;
  };
}

export class NewsService {
  
  /**
   * Recherche des actualités financières pour un symbole donné
   */
  async searchFinancialNews(symbol: string): Promise<NewsSearchResult> {
    try {
      // Construction de la requête de recherche optimisée
      const searchQueries = [
        `${symbol} trading analysis latest news today`,
        `${symbol} market outlook financial news`,
        `${symbol} price movement trading signals news`
      ];

      // Recherche web avec l'outil Claude
      const searchResults = await this.performWebSearch(searchQueries, symbol);
      
      // Analyse du contenu avec IA
      const analyzedArticles = await this.analyzeNewsContent(searchResults, symbol);
      
      // Calcul du sentiment global
      const marketSentiment = this.calculateMarketSentiment(analyzedArticles);

      return {
        articles: analyzedArticles,
        marketSentiment
      };

    } catch (error) {
      console.error('Erreur lors de la recherche des actualités:', error);
      throw new Error('Impossible de récupérer les actualités');
    }
  }

  /**
   * Effectue une recherche web avec l'outil WebSearch
   */
  private async performWebSearch(queries: string[], symbol: string): Promise<any[]> {
    const allResults: any[] = [];

    for (const query of queries) {
      try {
        // Appel à l'API backend qui utilise l'outil WebSearch de Claude
        const response = await fetch('/api/web-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            symbol: symbol
          })
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const searchData = await response.json();
        allResults.push(...searchData.results);
        
        // Délai pour éviter de surcharger les API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`Erreur lors de la recherche pour "${query}":`, error);
        // En cas d'erreur, ne pas utiliser de données simulées
        throw error;
      }
    }

    return allResults;
  }


  /**
   * Analyse le contenu des actualités avec IA pour déterminer sentiment et impact
   */
  private async analyzeNewsContent(searchResults: any[], _symbol: string): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];

    for (let i = 0; i < searchResults.length; i++) {
      const result = searchResults[i];
      
      // Claude doit fournir le sentiment et l'impact - pas de fallback
      if (!result.sentiment || !result.impact) {
        throw new Error(`Missing sentiment or impact data from Claude API for article: ${result.title}`);
      }
      
      const sentiment = result.sentiment;
      const impact = result.impact;
      
      // Validation des données requises de Claude
      if (!result.title || !result.snippet || !result.url || !result.domain) {
        throw new Error(`Incomplete article data from Claude API: ${JSON.stringify(result)}`);
      }
      
      articles.push({
        id: result.id || `article_${i + 1}`,
        title: result.title,
        summary: result.snippet,
        sentiment: sentiment,
        impact: impact,
        source: this.extractSource(result.domain),
        publishedAt: this.formatRelativeTime(result.publishedDate),
        url: result.url
      });
    }

    return articles;
  }

  /**
   * Extrait le nom de la source depuis le domaine
   */
  private extractSource(domain: string): string {
    const sourceMap: { [key: string]: string } = {
      'reuters.com': 'Reuters',
      'bloomberg.com': 'Bloomberg',
      'tradingview.com': 'TradingView',
      'cnbc.com': 'CNBC',
      'ft.com': 'Financial Times',
      'marketwatch.com': 'MarketWatch',
      'yahoo.com': 'Yahoo Finance',
      'seekingalpha.com': 'Seeking Alpha',
      'investopedia.com': 'Investopedia'
    };
    
    return sourceMap[domain] || domain;
  }

  /**
   * Formate le temps relatif
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Il y a quelques minutes';
    if (diffHours === 1) return 'Il y a 1 heure';
    if (diffHours < 24) return `Il y a ${diffHours} heures`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  }

  /**
   * Calcule le sentiment global du marché
   */
  private calculateMarketSentiment(articles: NewsArticle[]): {
    overall: 'bullish' | 'bearish' | 'neutral';
    score: number;
  } {
    if (articles.length === 0) {
      return { overall: 'neutral', score: 0 };
    }

    const positiveCount = articles.filter(a => a.sentiment === 'positive').length;
    const negativeCount = articles.filter(a => a.sentiment === 'negative').length;
    
    const score = ((positiveCount - negativeCount) / articles.length) * 100;
    
    let overall: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (score > 20) overall = 'bullish';
    else if (score < -20) overall = 'bearish';
    
    return {
      overall,
      score: Math.round(score)
    };
  }
}

// Instance singleton
export const newsService = new NewsService();