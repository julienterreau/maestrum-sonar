# 🚀 Sonar Maestrum - Guide de Démarrage Rapide

## 📍 Accès Rapide

**URL Application**: https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai

**URL Status API**: https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/status

## 🧪 Tests Rapides

```bash
# Status de la base de données
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/status | jq

# Datasets d'entraînement
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/training/datasets | jq

# Modèles fine-tunés
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/training/models | jq

# Presets de génération
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/presets | jq

# Bibliothèque musicale
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/library | jq

# Playlists
curl https://3000-ibcyz7y45r7yfbhfcsuk6-583b4d74.sandbox.novita.ai/api/playlists | jq
```

## 📦 Contenu de la Base de Données

### Training Datasets (3)
- **Jazz Collection 2024** - 15 fichiers, 1h total
- **Electronic Beats** - 23 fichiers, 1h10 total
- **Classical Symphony** - 8 fichiers, 47min total

### Fine-tuned Models (3)
- **Jazz Master v1** - ✅ Complété (100%)
- **EDM Beats Pro** - 🔄 En cours (60%)
- **Classical Composer** - ⏳ En attente (0%)

### Generation Presets (3)
- **Quick Jazz** - ⭐ Favori, 25 utilisations
- **Long EDM Track** - ⭐ Favori, 12 utilisations
- **Classical Intro** - 5 utilisations

### Music Library (3)
- **Sunset Jazz Boulevard** - Jazz, 4min
- **Electric Dreams** - Electronic, 5min
- **Morning Classical** - Classical, 3min

### Playlists (3)
- **My Favorites** - 2 tracks
- **Relaxation Mix** - 2 tracks
- **Workout Beats** - 1 track

## 🔧 Commandes de Gestion

### Serveur
```bash
cd /home/user/webapp

# Démarrer
pm2 start ecosystem.config.cjs

# Redémarrer
pm2 restart webapp

# Arrêter
pm2 stop webapp

# Logs
pm2 logs webapp --nostream

# Status
pm2 list
```

### Build
```bash
# Build le projet
npm run build

# Nettoyer le port 3000
npm run clean-port

# Tester localement
npm run test
```

### Base de Données
```bash
# Réinitialiser complètement
npm run db:reset

# Appliquer migrations seulement
npm run db:migrate:local

# Insérer seed data seulement
npm run db:seed

# Vérifier les migrations
npm run db:check
```

### Git
```bash
# Status
git status

# Voir l'historique
git log --oneline

# Dernier commit
git show --stat
```

## 📚 Documentation

- **README.md** - Documentation complète du projet
- **SONAR_MAESTRUM_INSTALLATION.md** - Guide d'installation détaillé
- **package.json** - Scripts NPM disponibles
- **wrangler.jsonc** - Configuration Cloudflare

## 🆘 Dépannage

### Le serveur ne démarre pas
```bash
npm run clean-port
pm2 delete webapp
npm run build
pm2 start ecosystem.config.cjs
```

### La base de données est vide
```bash
npm run db:reset
pm2 restart webapp
```

### Erreurs de build
```bash
rm -rf node_modules dist
npm install
npm run build
```

## 🎯 Prochaines Étapes

1. **Tester les APIs** avec Postman ou curl
2. **Développer l'interface d'entraînement**
3. **Intégrer les APIs externes** (ModelScope, HuggingFace)
4. **Implémenter l'upload de fichiers**
5. **Déployer sur Cloudflare Pages**

---

**✨ Système opérationnel et prêt pour le développement !**
