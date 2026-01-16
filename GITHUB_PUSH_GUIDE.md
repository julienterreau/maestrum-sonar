# 🚀 Comment Pousser Sonar Maestrum sur GitHub

## 📥 Méthode Automatique (3 minutes)

### Étape 1 : Télécharger le Script

**Téléchargez ces fichiers :**
1. **Backup du projet** : https://www.genspark.ai/api/files/s/atppYynT
2. **Script de push** : Copiez le contenu de `push_to_github.sh` (dans ce dossier)

### Étape 2 : Exécuter le Script

**Sur Mac/Linux :**
```bash
# Ouvrez un Terminal
cd ~/Downloads  # ou où vous avez téléchargé

# Rendez le script exécutable
chmod +x push_to_github.sh

# Exécutez
./push_to_github.sh
```

**Sur Windows (Git Bash) :**
```bash
# Ouvrez Git Bash
cd ~/Downloads

# Exécutez
bash push_to_github.sh
```

### Étape 3 : Entrez Vos Identifiants (Si Demandé)

Git va demander :
- **Username** : `julienterreau`
- **Password** : Utilisez un **Personal Access Token** (PAS votre mot de passe !)

---

## 🔑 Créer un Personal Access Token

**1. Allez sur :** https://github.com/settings/tokens

**2. Cliquez sur :**
- "Generate new token" → "Generate new token (classic)"

**3. Configurez :**
- **Note** : `Sonar Maestrum`
- **Expiration** : 30 days
- **Cochez** : ☑️ `repo` (toutes les sous-cases)

**4. Cliquez sur :** "Generate token"

**5. COPIEZ LE TOKEN** → Utilisez-le comme mot de passe lors du push

---

## 📋 Méthode Manuelle (Si le Script ne Marche Pas)

```bash
# 1. Téléchargez le backup
curl -L https://www.genspark.ai/api/files/s/atppYynT -o sonar-maestrum-complete.tar.gz

# 2. Extrayez
tar -xzf sonar-maestrum-complete.tar.gz
cd home/user/webapp

# 3. Configurez Git
git config user.name "Julien Terreau"
git config user.email "votre-email@example.com"

# 4. Ajoutez le remote
git remote add origin https://github.com/julienterreau/maestrum-sonar.git

# 5. Poussez
git push -u origin main
```

---

## 🎯 Vérification

Après le push, allez sur :
**https://github.com/julienterreau/maestrum-sonar**

Vous devriez voir :
✅ 4 commits
✅ README.md avec la documentation
✅ Tous les fichiers du projet
✅ Base de données migrations
✅ Documentation complète

---

## ⚠️ Problèmes Courants

### "fatal: could not read Username"
→ Vous devez entrer vos identifiants GitHub

### "remote: Support for password authentication was removed"
→ Utilisez un Personal Access Token, pas votre mot de passe

### "Permission denied"
→ Vérifiez que le token a bien la permission `repo`

### "Repository not found"
→ Vérifiez que le repo existe : https://github.com/julienterreau/maestrum-sonar

---

## 📞 Besoin d'Aide ?

Si ça ne marche toujours pas, vous pouvez :

1. **Créer le repo manuellement sur GitHub**
2. **Utiliser GitHub Desktop** (interface graphique)
3. **Importer via l'interface web GitHub**

---

**💡 Conseil** : La méthode la plus simple est d'utiliser le script automatique `push_to_github.sh` !
