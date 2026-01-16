#!/bin/bash

# 🎵 Script de Push Sonar Maestrum vers GitHub
# Créé automatiquement pour julienterreau/maestrum-sonar

echo "🎵 Sonar Maestrum - GitHub Upload Script"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Étape 1 : Télécharger le backup
echo -e "${BLUE}📥 Étape 1/5 : Téléchargement du backup...${NC}"
if [ ! -f "sonar-maestrum-complete.tar.gz" ]; then
    curl -L https://www.genspark.ai/api/files/s/atppYynT -o sonar-maestrum-complete.tar.gz
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup téléchargé${NC}"
    else
        echo -e "${RED}❌ Erreur de téléchargement${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Backup déjà téléchargé${NC}"
fi

# Étape 2 : Extraire
echo -e "${BLUE}📦 Étape 2/5 : Extraction...${NC}"
if [ ! -d "home" ]; then
    tar -xzf sonar-maestrum-complete.tar.gz
    echo -e "${GREEN}✅ Extraction réussie${NC}"
else
    echo -e "${GREEN}✅ Déjà extrait${NC}"
fi

# Étape 3 : Aller dans le dossier
echo -e "${BLUE}📁 Étape 3/5 : Navigation vers le projet...${NC}"
cd home/user/webapp
echo -e "${GREEN}✅ Dans le dossier du projet${NC}"

# Étape 4 : Configurer Git
echo -e "${BLUE}⚙️  Étape 4/5 : Configuration Git...${NC}"
git config user.name "Julien Terreau"
git config user.email "julien.terreau@example.com"  # Changez si nécessaire
echo -e "${GREEN}✅ Git configuré${NC}"

# Étape 5 : Ajouter le remote et pousser
echo -e "${BLUE}🚀 Étape 5/5 : Push vers GitHub...${NC}"

# Vérifier si le remote existe déjà
if git remote | grep -q "origin"; then
    echo "Remote 'origin' existe déjà"
else
    git remote add origin https://github.com/julienterreau/maestrum-sonar.git
fi

echo ""
echo -e "${BLUE}Tentative de push...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================"
    echo "🎉 SUCCESS! Code poussé sur GitHub!"
    echo "========================================${NC}"
    echo ""
    echo "🌐 Votre repo: https://github.com/julienterreau/maestrum-sonar"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}⚠️  Authentification requise${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "Git demande vos identifiants GitHub:"
    echo ""
    echo "1. Username: julienterreau"
    echo "2. Password: Utilisez un PERSONAL ACCESS TOKEN"
    echo ""
    echo "📝 Pour créer un token:"
    echo "   → https://github.com/settings/tokens"
    echo "   → Generate new token (classic)"
    echo "   → Cochez 'repo'"
    echo "   → Copiez le token"
    echo "   → Utilisez-le comme mot de passe"
    echo ""
    echo "Puis relancez: git push -u origin main"
fi
