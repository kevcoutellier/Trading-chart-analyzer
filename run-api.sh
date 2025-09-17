#!/bin/bash

# Script pour maintenir le serveur API en vie
echo "🚀 Démarrage du serveur API avec auto-restart..."

while true; do
    echo "📡 Lancement du serveur API..."
    node server.js
    
    echo "⚠️  Serveur API s'est arrêté. Redémarrage dans 2 secondes..."
    sleep 2
done