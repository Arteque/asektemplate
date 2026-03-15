# ASEK Template — Association Sportive Élite Kénitra

Template HTML/CSS statique pour le site web de l'**Association Sportive Élite Kénitra (ASEK)**, situé à Kénitra, Maroc.  
Ce layout est destiné à être intégré dans une installation **TYPO3**.

---

## Présentation

Ce projet constitue la base visuelle et structurelle du site de l'ASEK. Il est développé en HTML/SCSS pur, sans framework, afin de faciliter son intégration ultérieure dans TYPO3 sous forme de template Fluid/TypoScript.

---

## Structure du projet

```
asektemplate/
├── index.html              # Page d'accueil (structure principale)
├── _public/
│   ├── media/
│   │   └── Logos/          # Logos et ressources visuelles (SVG, PNG…)
│   ├── script/
│   │   └── App.js          # JavaScript principal
│   └── style/
│       ├── App.scss         # Source SCSS
│       └── App.css          # CSS compilé (généré depuis App.scss)
└── _privat/                 # Fichiers non publiés (maquettes, assets bruts…)
```

---

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| HTML5 | Structure sémantique |
| SCSS / CSS3 | Styles et mise en page |
| JavaScript (Vanilla) | Interactions (menu burger…) |
| Google Fonts | Typographies (`Bebas Neue`, `Outfit`) |

---

## Mise en route

### Prérequis

- Un compilateur SCSS (ex. [Dart Sass](https://sass-lang.com/install), extension VS Code **Live Sass Compiler**, etc.)

### Compilation SCSS

```bash
sass _public/style/App.scss _public/style/App.css --watch
```

### Visualisation

Ouvrir `index.html` directement dans un navigateur, ou utiliser une extension comme **Live Server** sous VS Code.

---

## Sections de la page

| Section | Classe CSS | Description |
|---|---|---|
| En-tête | `#main-header` | Logo, coordonnées, navigation, bouton inscription |
| Hero | `.hero` | Bannière principale |
| Plan | `.plan` | Section programme / planning |
| Groupes | `.groupes` | Présentation des groupes sportifs |
| Galerie | `.galerie` | Galerie photos / médias |
| Pied de page | `#main-footer` | Informations légales, liens |

---

## Intégration TYPO3

Ce template est conçu pour être converti en **template Fluid** dans TYPO3.  
Les points d'attention pour l'intégration :

- Remplacer les liens statiques (`href="#"`) par des `{f:uri.page()}` Fluid.
- Transformer les sections en **Content Elements** ou **Fluid Sections**.
- Importer les ressources (`_public/`) dans le dossier `Resources/Public/` de l'extension ou du sitepackage TYPO3.
- Configurer les chemins de ressources via **TypoScript** (`page.includeCSS`, `page.includeJS`).
- Le menu de navigation doit être généré dynamiquement via le ViewHelper `<f:widget.menu />` ou via TypoScript.

---

## Conventions de nommage

- Classes CSS en **kebab-case** (ex. `.contact-container`, `#main-header`).
- Les icônes PDF sont ajoutées automatiquement via SCSS sur tout lien `<a href="*.pdf">`, sans classe supplémentaire.

---

## Auteur

Projet développé pour l'**Association Sportive Élite Kénitra**  
Kénitra, Maroc  
Contact : [info@asekt.team](mailto:info@asekt.team)
Auteur: [Ahmed Lemssiah](https://lemssiah-portfolio.de)
