# 🗳️ Site de Campagne - Raphaël Adam pour Nanterre

Site web statique pour la campagne municipale de Raphaël Adam à Nanterre.

## 📁 Structure du projet

```
📁 site-campagne/
├── 📄 index.html           ← Page principale du site
├── 📁 css/
│   └── style.css           ← Styles du site
├── 📁 js/
│   └── main.js             ← Logique JavaScript
├── 📁 data/                 ← FICHIERS À MODIFIER
│   ├── agenda.csv          ← Événements de campagne
│   ├── equipe.csv          ← Membres de l'équipe
│   └── programme.csv       ← Points du programme
├── 📁 images/
│   ├── slider/             ← Images du slider d'accueil
│   └── equipe/             ← Photos des membres
└── 📄 README.md            ← Ce fichier
```

---

## 🚀 Comment tester le site en local

### Option 1 : Avec Python (recommandé)
```bash
# Ouvrir un terminal dans le dossier du site
python -m http.server 8000

# Puis ouvrir dans le navigateur :
# http://localhost:8000
```

### Option 2 : Avec Node.js
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer le serveur
http-server -p 8000

# Puis ouvrir dans le navigateur :
# http://localhost:8000
```

### Option 3 : Avec VS Code
1. Installer l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

> ⚠️ **Important** : Le site doit être servi via un serveur HTTP pour que les fichiers CSV se chargent correctement. Ouvrir directement le fichier HTML ne fonctionnera pas.

---

## 📝 Comment modifier les données

### 📅 Modifier l'agenda (`data/agenda.csv`)

Ouvrez le fichier avec Excel, LibreOffice Calc, ou même Notepad.

**Colonnes disponibles :**
| Colonne | Description | Exemple |
|---------|-------------|---------|
| `date` | Date au format AAAA-MM-JJ | `2026-03-15` |
| `heure` | Heure au format HH:MM | `18:30` |
| `titre` | Nom de l'événement | `Réunion publique` |
| `lieu` | Adresse ou lieu | `Salle Jean Jaurès` |
| `description` | Description courte | `Présentation du programme` |
| `type` | Type d'événement | `meeting`, `terrain`, `conference` |

**Exemple de ligne :**
```csv
2026-03-20,19:00,Débat citoyen,Mairie de Nanterre,Échanges sur la transition écologique,meeting
```

**Types d'événements avec couleurs :**
- `meeting` → Vert (réunions publiques)
- `terrain` → Orange (porte-à-porte, marchés)
- `conference` → Violet (débats, conférences)

---

### 👥 Modifier l'équipe (`data/equipe.csv`)

**Colonnes disponibles :**
| Colonne | Description | Exemple |
|---------|-------------|---------|
| `nom` | Nom complet | `Raphaël Adam` |
| `role` | Fonction/délégation | `Tête de liste` |
| `photo` | Nom du fichier photo | `raphael-adam.jpg` |
| `description` | Biographie courte | `Entrepreneur depuis 25 ans...` |

**Pour ajouter une photo :**
1. Placez la photo dans le dossier `images/equipe/`
2. Nommez-la exactement comme dans le CSV
3. Format recommandé : JPG, PNG ou WebP
4. Taille recommandée : 400x500 pixels (portrait)

> 💡 **Astuce** : Si pas de photo, les initiales s'affichent automatiquement !

---

### 📋 Modifier le programme (`data/programme.csv`)

**Colonnes disponibles :**
| Colonne | Description | Exemple |
|---------|-------------|---------|
| `theme` | Catégorie/thème | `Éducation et Jeunesse` |
| `icone` | Emoji du thème | `🎓` |
| `point` | Point du programme | `Rénover les écoles` |

**Emojis suggérés par thème :**
- 🎓 Éducation
- 🌿 Écologie
- 💼 Économie
- ❤️ Solidarités
- 🏠 Logement
- 🎭 Culture/Sport
- 🛡️ Sécurité
- 🚌 Transports
- 👶 Petite enfance

---

## 🖼️ Images du site

### ✅ Images déjà téléchargées !

Toutes les images de qualité ont été téléchargées depuis **Unsplash** :
- **3 images** pour le slider (1920x1080)
- **8 photos** pour l'équipe (600x600)

📖 **Consultez `GUIDE-IMAGES.md` pour :**
- Re-télécharger les images : `bash download-images.sh`
- Remplacer par vos propres photos
- Optimiser les images
- Trouver des sources d'images gratuites

### Images du slider (page d'accueil)

1. Placez vos images dans `images/slider/`
2. Nommez-les : `slide1.jpg`, `slide2.jpg`, `slide3.jpg`
3. Taille recommandée : **1920x1080 pixels** minimum

### Photos de l'équipe

1. Placez les photos dans `images/equipe/`
2. Nommez-les exactement comme dans le fichier `equipe.csv`
3. Taille recommandée : **600x600 pixels** (format carré)

---

## 🌐 Déploiement sur OVH

### Étape 1 : Préparer les fichiers
- Vérifiez que tous les fichiers sont à jour
- Testez le site en local avant de déployer

### Étape 2 : Uploader via FTP
1. Connectez-vous à votre espace OVH via FTP (FileZilla recommandé)
2. Accédez au dossier `www` de votre hébergement
3. Uploadez TOUS les fichiers et dossiers du projet

### Étape 3 : Vérifier
- Accédez à votre domaine pour vérifier que tout fonctionne

### Pour mettre à jour :
- Modifiez simplement les fichiers CSV
- Re-uploadez uniquement les fichiers modifiés
- Le site se met à jour instantanément !

---

## ✏️ Personnalisation

### Modifier les informations de contact

Ouvrez `index.html` et cherchez la section `<!-- Contact Section -->` pour modifier :
- Adresse de la permanence
- Email
- Téléphone
- Liens réseaux sociaux

### Modifier les couleurs

Ouvrez `css/style.css` et modifiez les variables au début du fichier :
```css
:root {
    --primary: #1a365d;      /* Bleu principal */
    --accent: #d69e2e;       /* Or/accent */
    /* ... autres couleurs */
}
```

---

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte à :
- 📱 Téléphones mobiles
- 📱 Tablettes
- 💻 Ordinateurs portables
- 🖥️ Écrans de bureau

---

## 🆘 Problèmes fréquents

### Les données ne s'affichent pas
- Vérifiez que vous utilisez un serveur HTTP (pas d'ouverture directe du fichier)
- Vérifiez le format de vos fichiers CSV (virgules, pas de guillemets manquants)

### Les images ne s'affichent pas
- Vérifiez le nom exact du fichier (majuscules/minuscules comptent !)
- Vérifiez que l'image est dans le bon dossier

### Le site ne s'affiche pas correctement
- Videz le cache de votre navigateur (Ctrl+F5)
- Vérifiez que tous les fichiers sont uploadés

---

## 📞 Support

Pour toute question technique, contactez le webmaster.

---

**Dernière mise à jour :** Février 2026  
**Version :** 1.0.0
