# Guide d'Intégration des APIs Réelles

## 🔧 Configuration des APIs

### 1. Claude API (Analyse d'images)

```bash
# Obtenir une clé API sur https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-actual-claude-key
```

**Utilisation** : Analyse des graphiques de trading avec Claude 3.5 Sonnet Vision

### 2. Google Cloud Vision (Alternative)

```bash
# Créer un projet sur Google Cloud Console
# Activer l'API Vision et générer une clé
GOOGLE_CLOUD_API_KEY=your-google-cloud-key
```

**Utilisation** : Détection de texte et objets dans les graphiques

### 3. APIs de News Financières

#### NewsAPI
```bash
# S'inscrire sur https://newsapi.org/
NEWS_API_KEY=your-newsapi-key
```

#### Financial Modeling Prep
```bash
# S'inscrire sur https://financialmodelingprep.com/
FINANCIAL_MODELING_PREP_API_KEY=your-fmp-key
```

### 4. APIs de Données Financières

#### Alpha Vantage
```bash
# Gratuit sur https://www.alphavantage.co/
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
```

## 🚀 Déploiement

### Déploiement sur Vercel

```bash
# Installation Vercel CLI
npm i -g vercel

# Configuration des variables d'environnement
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_CLOUD_API_KEY
vercel env add NEWS_API_KEY
vercel env add ALPHA_VANTAGE_API_KEY

# Déploiement
vercel --prod
```

### Déploiement sur Netlify

```bash
# Installation Netlify CLI
npm i -g netlify-cli

# Build et déploiement
npm run build
netlify deploy --prod --dir=dist
```

## 📡 Endpoints API

### `/api/analyze-chart`
- **Method**: POST
- **Body**: `{ "image": "data:image/jpeg;base64,...", "symbol": "EURUSD" }`
- **Response**: Analyse complète du graphique

### `/api/web-search`  
- **Method**: POST
- **Body**: `{ "query": "EURUSD news", "symbol": "EURUSD" }`
- **Response**: Résultats de recherche web

### `/api/search-news`
- **Method**: POST  
- **Body**: `{ "query": "EURUSD trading", "symbol": "EURUSD" }`
- **Response**: Actualités financières analysées

## 🔄 Fallback et Gestion d'Erreurs

L'application gère automatiquement :
- **Timeout des APIs** (30s max)
- **Limites de taux** (rate limiting)
- **Erreurs réseau** avec retry automatique
- **APIs indisponibles** avec messages d'erreur explicites

## 🧪 Mode Développement

Pour tester sans APIs externes :

```bash
# Créer un fichier .env.local
echo "NODE_ENV=development" > .env.local

# Les appels API retourneront des erreurs explicites
npm run dev
```

## 📊 Monitoring

### Logs d'API
- Tous les appels sont loggés dans la console
- Erreurs trackées avec stack traces
- Performance monitoring inclus

### Métriques
- Temps de réponse des APIs
- Taux de succès/échec
- Usage des quotas

## 🔐 Sécurité

- **Clés API** stockées en variables d'environnement
- **CORS** configuré pour les domaines autorisés
- **Rate limiting** implémenté côté client
- **Validation** des données entrantes

## 🛠️ Développement Local

```bash
# 1. Copier le fichier d'exemple
cp .env.example .env

# 2. Remplir vos clés API réelles
nano .env

# 3. Installer les dépendances
npm install

# 4. Démarrer en mode développement  
npm run dev

# 5. Tester les endpoints
curl -X POST http://localhost:3000/api/analyze-chart \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,...", "symbol": "EURUSD"}'
```

## 📈 Optimisations de Performance

- **Cache** des résultats d'analyse (5 minutes)
- **Compression** des réponses API
- **Lazy loading** des composants
- **Debounce** sur les recherches

## 🚨 Limites Importantes

- **Claude API** : 50 requêtes/minute (plan gratuit)
- **Google Vision** : 1000 requêtes/mois (gratuit)
- **NewsAPI** : 1000 requêtes/jour (gratuit)
- **Taille d'image** : 10MB maximum

## 📞 Support

En cas de problème :
1. Vérifier les logs dans la console navigateur
2. Contrôler les variables d'environnement
3. Tester les endpoints individuellement
4. Vérifier les quotas des APIs