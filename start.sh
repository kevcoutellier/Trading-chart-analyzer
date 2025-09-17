#!/bin/bash

echo "🚀 Démarrage de Trading Chart Analyzer..."
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant, création depuis .env.example"
    cp .env.example .env
    echo "📝 Modifiez .env avec vos vraies clés API"
fi

echo "🔧 Démarrage du serveur API (port 3001)..."
echo "🌐 Démarrage du serveur Vite (port 5173)..."
echo ""
echo "📡 URLs disponibles :"
echo "   Frontend: http://localhost:5173"
echo "   API Health: http://localhost:3001/api/health"
echo ""

# Démarrer les deux serveurs
npm run dev:full