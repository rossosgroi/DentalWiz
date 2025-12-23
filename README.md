# Data-Driven Personalized Dental Implant System Website

A modern, interactive bilingual website showcasing the data-driven personalized dental implant system project.

## Features

- 🌐 **Bilingual Support**: Toggle between Chinese and English with a single click
- 🎨 **Modern UI/UX**: Clean, modern design with smooth animations
- 🎬 **Interactive Animations**: Scroll-triggered animations and smooth transitions
- 🦷 **3D Model Integration**: Interactive 3D model viewer using Three.js
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Performance Optimized**: Fast loading and smooth interactions

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript for interactivity and 3D model
├── assets/
│   ├── icon.png        # Logo/icon image
│   ├── tooth.png       # Tooth visualization image
│   └── 3d model/
│       └── model.glb   # 3D model file (GLB)
└── README.md           # This file
```

## Getting Started

Due to browser security restrictions, loading `.glb` files with Three.js requires serving the site over HTTP(S). Opening `index.html` directly with `file://` will prevent the model from loading.

Choose one of the options below:

1) VS Code Live Server (easiest)

- Install the “Live Server” extension in VS Code
- Right‑click `index.html` → “Open with Live Server”

2) Quick local server via Node.js

```powershell
# From the project folder
npx http-server -p 8080
# Then open http://localhost:8080
```

3) Quick local server via Python

```powershell
# Python 3
python -m http.server 8080
# Then open http://localhost:8080
```

## Usage

- **Language Toggle**: Click the language button in the top-right corner to switch between Chinese and English
- **Navigation**: Use the navigation menu to jump to different sections
- **3D Model**: The 3D model in the hero section will automatically load and rotate
- **Scroll**: Scroll down to see animated sections appear

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- JavaScript (ES6+)
- Three.js (for 3D model rendering)
- Google Fonts (Inter & Noto Sans SC)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- The folder name `assets/3d model/` contains a space; paths are URL‑encoded in code so loading works (`assets/3d%20model/model.glb`).
- If the GLB still fails to load, the page will show a fallback 3D shape and log details in the browser console (F12 → Console).
- The 3D model may be large; initial loading can take time depending on your device and disk.
- The website is fully responsive and animations are optimized for performance.

## Customization

You can customize the website by:
- Modifying colors in `styles.css` (CSS variables in `:root`)
- Updating content in `index.html` (both Chinese and English versions)
- Adjusting animations in `styles.css` and `script.js`
- Replacing images in the `assets` folder

