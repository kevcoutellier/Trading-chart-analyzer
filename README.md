# Trading Chart Analyzer 📈

Une interface web moderne pour analyser les graphiques de trading avec l'intelligence artificielle et la recherche d'actualités en temps réel.

## ✨ Fonctionnalités

- 📤 **Upload d'images** : Interface drag & drop pour charger des captures d'écran de graphiques
- 🤖 **Analyse IA** : Détection automatique des patterns de trading avec vision AI
- 📊 **Signaux de trading** : Identification des positions LONG/SHORT avec niveaux de confiance
- 💰 **Calcul automatique** : Take Profit, Stop Loss et ratio Risk/Reward
- 🔍 **Analyse technique** : Détection des supports, résistances et indicateurs
- 📰 **News du marché IA** : **Recherche web avec Claude** - Génération d'actualités pertinentes et analyse de sentiment
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS et animations

## 🆕 Nouveauté : Recherche d'actualités IA

Le système utilise Claude pour la recherche et l'analyse d'actualités :
- 🤖 **Claude WebSearch** : Génération intelligente d'actualités pertinentes 
- 🧠 **Analyse de sentiment IA** : Évaluation automatique positive/négative/neutre
- 📈 **Évaluation d'impact** (high/medium/low) sur les prix avec Claude
- 🌐 **Sources crédibles** : Bloomberg, Reuters, TradingView, CNBC simulés
- ⚖️ **Sentiment de marché global** calculé par l'IA

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS avec effets glass et gradients
- **Icons** : Lucide React
- **Animations** : Framer Motion
- **IA/Recherche** : Service de recherche web avec analyse de sentiment

## 🚀 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd trading-chart-analyzer

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 📖 Utilisation

1. **Upload d'image** : Glissez-déposez ou sélectionnez une capture d'écran de votre graphique
2. **Entrer le symbole** : Indiquez le symbole de l'actif (ex: EURUSD, BTCUSD, AAPL)
3. **Analyser** : Cliquez sur "Analyser le Graphique" pour obtenir l'analyse complète
4. **Résultats** : Consultez les signaux, niveaux de prix et actualités analysées

## 📁 Structure du projet

```
src/
├── components/
│   ├── ImageUploader.tsx      # Composant d'upload d'images avec drag & drop
│   ├── AnalysisResult.tsx     # Affichage des résultats d'analyse technique
│   └── NewsAnalysis.tsx       # Analyse des actualités avec IA
├── services/
│   └── newsService.ts         # Service de recherche web et analyse IA
├── App.tsx                    # Composant principal de l'application
└── index.css                  # Styles Tailwind CSS personnalisés
```

## 🔌 Intégration IA (En cours)

### Recherche d'actualités automatique
Le système utilise un service intelligent qui :

```typescript
// Recherche multi-requêtes pour un symbole
const queries = [
  `${symbol} trading analysis latest news`,
  `${symbol} market outlook financial news`, 
  `${symbol} price movement trading signals`
];

// Analyse de sentiment automatique
const sentiment = analyzeSentiment(articleText);
const impact = assessImpact(articleText);
```

### Pour la production, intégrer :

**Vision AI pour l'analyse d'images**
- OpenAI Vision API
- Google Cloud Vision
- Azure Computer Vision

**APIs de données financières**
- Alpha Vantage
- Yahoo Finance API
- IEX Cloud

**APIs de news financières**
- NewsAPI
- Financial Modeling Prep
- Quandl News

## ⚙️ Configuration pour la production

```env
# Variables d'environnement
VITE_OPENAI_API_KEY=your_openai_key
VITE_NEWS_API_KEY=your_news_api_key  
VITE_FINANCIAL_API_KEY=your_financial_api_key
VITE_WEB_SEARCH_API_KEY=your_search_api_key
```

## 🚀 Déploiement

```bash
# Build pour la production
npm run build

# Aperçu du build
npm run preview

# Les fichiers de build sont dans le dossier /dist
```

## 🔮 Fonctionnalités à venir

- [ ] Intégration OpenAI Vision API pour analyse réelle des graphiques
- [ ] Connexion aux APIs financières en temps réel  
- [ ] Système d'alertes personnalisées
- [ ] Historique des analyses
- [ ] Export des rapports PDF
- [ ] Mode sombre/clair
- [ ] Support mobile amélioré

## ⚠️ Avertissement

Cette application est à des fins éducatives et de démonstration. Elle ne constitue pas un conseil financier. Toujours faire ses propres recherches avant de trader.

## 📜 Licence

MIT License - Libre d'utilisation pour vos projets personnels et commerciaux.