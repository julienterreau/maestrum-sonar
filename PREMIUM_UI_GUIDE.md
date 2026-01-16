# ✨ SONAR MAESTRUM - Ultra Premium Golden UI Guide

## 🎨 Vue d'Ensemble du Design

Cette interface premium offre une expérience visuelle spectaculaire avec des effets dorés, métallisés et lumineux.

## 🌟 Caractéristiques Visuelles

### 1. Particules d'Or Animées
- **50 particules flottantes** générées dynamiquement
- Animation `float` personnalisée (20s cycle)
- Mouvement en 3D avec variation d'opacité
- Couleur dorée avec gradient radial

### 2. Fond Animé Premium
- Gradient radial multi-couches
- Animation `bgPulse` subtile (8s cycle)
- Couleurs : `#0a0a0f` (noir) → `#1a1520` (violet foncé) → `#0f0f1a` (bleu nuit)
- Overlays dorés semi-transparents

### 3. Effet Glass Morphism Doré
- **Backdrop-filter** : blur(25px) + saturate(180%)
- Bordure en gradient doré animé
- Multiples box-shadows pour profondeur :
  - Ombre extérieure dorée (48px)
  - Ombre interne blanche (8px)
  - Glow doré (60px + 120px)
- Effet `shine` rotatif avec conic-gradient

### 4. Boutons Légendaires
```css
Caractéristiques :
- Gradient animé : FFD700 → FFA500 → FFD700
- Background-size: 300% (effet de déplacement)
- Border: 3px avec ombre blanche intérieure
- Box-shadow multiple : 40px + inset + 60px glow
- Animation `btnShine` : brillance traversante (3s)
- Hover : scale(1.05) + translateY(-5px)
- Animation `btnPulse` au hover (1.5s)
```

### 5. Typographie Luxe
- **Titres** : "Cinzel Decorative" (serif décoratif)
  - Font-size: 5rem
  - Font-weight: 900
  - Gradient doré animé en background-clip
  - Text-shadow avec glow
  - Letter-spacing: 8px
  
- **Corps** : "Orbitron" (sans-serif futuriste)
  - Font-weights: 400, 500, 700, 900
  - Couleur : `#FFF8DC` (cornsilk)

## 🎵 Banque de Synthétiseurs (40+ Instruments)

### Jazz (5)
- Fender Rhodes (power: 9)
- Hammond B3 (power: 9)
- Saxophone Synth (power: 8)
- Jazz Bass (power: 8)
- Jazz Drums (power: 7)

### Electronic (5)
- Roland TB-303 (power: 10)
- Roland TR-808 (power: 10)
- Yamaha DX7 (power: 9)
- Moog Minimoog (power: 9)
- Roland Juno-106 (power: 8)

### Classical (5)
- Steinway Grand Piano (power: 10)
- Stradivarius Violin (power: 10)
- Concert Cello (power: 9)
- Concert Harp (power: 8)
- Classical Flute (power: 8)

### Rock (5)
- Fender Stratocaster (power: 10)
- Gibson Les Paul (power: 10)
- Fender Precision Bass (power: 9)
- Ludwig Drums (power: 9)
- Hammond Organ (power: 8)

### Hip-Hop (5)
- Akai MPC (power: 10)
- EMU SP-1200 (power: 9)
- Roland TR-808 Hip-Hop (power: 10)
- Vinyl Sampler (power: 8)
- Boom Bap Drums (power: 8)

### Ambient (5)
- Ambient Pad (power: 9)
- Drone Synth (power: 9)
- Reverb Generator (power: 8)
- Delay Echo (power: 8)
- Granular Synth (power: 9)

### Pop (5)
- Synth Bass (power: 9)
- Pop Lead (power: 9)
- Pop Pad (power: 8)
- Pop Drums (power: 8)
- Vocal Synth (power: 7)

### Metal (5)
- 7-String Guitar (power: 10)
- Double Bass Drum (power: 10)
- Scream Vocals (power: 9)
- Metal Bass (power: 9)
- Mesa Boogie (power: 10)

## 🎛️ Composants Interactifs

### Upload Zone
```css
Features:
- Bordure dashed dorée (3px)
- Hover: border-color solid + glow
- Dragover: background doré + inner glow
- Icône 8xl avec drop-shadow
- Transition smooth 0.4s
```

### Synth Cards
```css
Features:
- Background gradient subtil
- Border 2px dorée
- Hover: translateY(-8px) + scale(1.05)
- Effet de brillance traversante
- State "selected" : glow intense + scale
```

### Progress Bar
```css
Features:
- Height: 40px
- Border 2px dorée
- Fill: gradient animé (90deg)
- Animation `progressShine` infinie
- Box-shadow doré (20px glow)
```

### Genre Badges
```css
Features:
- Padding: 12px 28px
- Border-radius: 25px
- Uppercase + letter-spacing
- Hover: scale(1.1) + glow
- Active: background doré plein
```

### Stat Cards
```css
Features:
- Padding: 30px
- Gradient background subtil
- Hover: translateY(-10px)
- Stat value: 3rem + gradient clip
- Icon: 5xl avec drop-shadow
```

## 🎬 Animations

### 1. `float` (Particules)
```css
Duration: 20s infinite ease-in-out
Keyframes:
  0%, 100%: translateY(0) scale(1) opacity(0.3)
  25%: translateY(-120px) translateX(60px) scale(1.4) opacity(0.7)
  50%: translateY(-80px) translateX(-60px) scale(0.8) opacity(0.4)
  75%: translateY(-180px) translateX(120px) scale(1.2) opacity(0.6)
```

### 2. `shine` (Cards)
```css
Duration: 8s infinite linear
Effect: Rotation 360deg conic-gradient
```

### 3. `btnShine` (Buttons)
```css
Duration: 3s infinite
Effect: Brillance traversante 45deg
```

### 4. `btnPulse` (Button Hover)
```css
Duration: 1.5s infinite ease-in-out
Effect: Box-shadow pulsation
```

### 5. `titleShimmer` (Title)
```css
Duration: 4s infinite ease-in-out
Effect: Background-position shift
```

### 6. `progressShine` (Progress Bar)
```css
Duration: 2s infinite linear
Effect: Gradient movement
```

### 7. `starPulse` (Power Stars)
```css
Duration: 1s infinite ease-in-out
Effect: Scale pulsation
```

### 8. `bgPulse` (Background)
```css
Duration: 8s infinite alternate ease-in-out
Effect: Opacity variation
```

## 📱 Responsive Design

### Mobile (max-width: 768px)
```css
Changes:
- Title: 5rem → 3rem
- Letter-spacing: 8px → 4px
- Button padding: 18px 48px → 14px 32px
- Button font-size: 1.1rem → 0.9rem
- Letter-spacing: 3px → 2px
```

## 🎨 Palette de Couleurs

```css
:root {
  --gold-primary: #FFD700;   /* Or pur */
  --gold-dark: #B8860B;      /* Or foncé */
  --gold-light: #FFF8DC;     /* Cornsilk clair */
  --bg-dark: #0a0a0f;        /* Noir profond */
  --bg-darker: #050508;      /* Noir absolu */
}
```

### Couleurs Secondaires
- Orange doré : `#FFA500`
- Blanc transparent : `rgba(255, 255, 255, 0.1-0.8)`
- Or transparent : `rgba(255, 215, 0, 0.05-0.9)`

## 🚀 Structure des Fichiers

```
public/
├── maestrum-premium.html (30 KB)
│   └── Interface complète avec CSS inline
├── premium.html (25 KB)
│   └── Version backup
└── static/
    ├── maestrum-premium.js (16 KB)
    │   └── Logique frontend complète
    └── premium-studio.js (16 KB)
        └── Copie de training-studio.js
```

## 🔌 Routes

```typescript
GET /premium
  → Redirect to /maestrum-premium.html

GET /maestrum-premium.html
  → Serve static HTML from dist/

GET /
  → Main page avec bouton PREMIUM en header
```

## 📊 Statistiques Techniques

- **Lignes de CSS** : ~1200
- **Animations CSS** : 8 distinctes
- **Particules dynamiques** : 50
- **Instruments de synthèse** : 40+
- **Genres musicaux** : 8
- **Composants interactifs** : 20+
- **Fonts Google** : 2 (Cinzel Decorative + Orbitron)
- **CDN externes** : 3 (Tailwind, FontAwesome, Chart.js)

## 🎯 Fonctionnalités Interactives

1. **Upload Audio**
   - Drag & Drop
   - Click to browse
   - Formats : MP3, WAV, FLAC, OGG
   - Preview des fichiers uploadés

2. **Sélection de Genre**
   - 8 badges interactifs
   - State active avec effet doré plein
   - Filtrage automatique des synthés

3. **Banque de Synthés**
   - 40+ instruments
   - Notation power (1-10 étoiles)
   - Multi-sélection
   - Animation au hover

4. **Configuration d'Entraînement**
   - Modèle de base (3 options)
   - Epochs : slider 10-200
   - Batch size : slider 8-64
   - Learning rate : slider 0.0001-0.01

5. **Dashboard Stats**
   - Fichiers audio uploadés
   - Durée totale
   - Taille des données
   - Synthés actifs

6. **Monitoring**
   - Barre de progression animée
   - Charts en temps réel
   - Estimation temps restant
   - Bouton d'arrêt d'urgence

## 🔧 Configuration Vite

```typescript
export default defineConfig({
  plugins: [
    build({
      exclude: ['/static/*', '/*.html']
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: false
  }
})
```

## 📝 Utilisation

### Développement Local
```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Accès
```
Page principale : http://localhost:3000/
Version premium : http://localhost:3000/premium
API : http://localhost:3000/api/*
```

### Déploiement
```bash
npm run build
npx wrangler pages deploy dist --project-name webapp
```

## 🎨 Personnalisation

### Changer les Couleurs
Modifier les variables CSS dans `:root` :
```css
:root {
  --gold-primary: #YOUR_COLOR;
  --gold-dark: #YOUR_COLOR;
  --gold-light: #YOUR_COLOR;
}
```

### Ajuster les Animations
Modifier les `@keyframes` et leurs `animation` properties.

### Ajouter des Synthés
Éditer `SYNTH_BANK` dans `maestrum-premium.js` :
```javascript
SYNTH_BANK.your_genre = {
  synth_id: {
    name: "Synth Name",
    icon: "fas fa-icon",
    power: 9,
    description: "Description"
  }
}
```

## 🐛 Debug

### Vérifier le Build
```bash
ls -la dist/
cat dist/_routes.json
```

### Logs PM2
```bash
pm2 logs webapp --nostream
```

### Test APIs
```bash
curl http://localhost:3000/api/status
curl http://localhost:3000/api/training/datasets
```

## 📚 Ressources

- **Fonts** : Google Fonts (Cinzel Decorative, Orbitron)
- **Icons** : FontAwesome 6.4.0
- **CSS Framework** : Tailwind CSS (CDN)
- **Charts** : Chart.js (CDN)
- **Backend** : Hono + Cloudflare Workers
- **Database** : Cloudflare D1 (SQLite)
- **Storage** : Cloudflare R2

## 🎓 Best Practices

1. **Performance** : Utiliser `will-change` pour les animations intensives
2. **Accessibilité** : Assurer un contraste suffisant
3. **Mobile** : Tester sur différentes tailles d'écran
4. **Browser Support** : Vérifier les prefixes CSS si nécessaire
5. **Loading** : Optimiser les images et fonts

## ✨ Effets Premium Tips

### 1. Glass Morphism Réussi
- Backdrop-filter blur entre 15-30px
- Background semi-transparent (0.05-0.15)
- Border subtile avec gradient
- Multiple box-shadows pour profondeur

### 2. Boutons 3D Convaincants
- Gradient animé en background
- Inset shadow pour relief interne
- Multiple outer shadows
- Transform au hover (scale + translateY)
- Animation subtile continue

### 3. Particules Fluides
- Animation easing cubic-bezier personnalisée
- Variation de taille et opacité
- Mouvement en 3D (translateX, translateY, scale)
- Cycle long (15-20s) pour naturalité

### 4. Glow Efficace
- Multiple box-shadows avec blur croissant
- Couleurs semi-transparentes
- Animation de pulsation subtile
- Filter: drop-shadow pour renforcer

---

**Créé avec** ✨ **par Sonar Maestrum**  
**Version** : Ultra Premium Golden Edition  
**Date** : Janvier 2026
