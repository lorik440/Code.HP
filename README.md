# Code.HP

> A retro-futuristic code snippet manager built with Electron and Monaco Editor.

<p align="center">
  <img src="app/assets/screenshots/main_window.png" width="900" alt="Code.HP Main Window">
</p>

---

## ✨ Features

- 👽 Retro-futuristic alien-inspired interface
- 📝 Monaco Editor with VS Code syntax highlighting
- 🌐 Support for 25+ programming languages
- 🔍 Real-time snippet search
- 📁 File-based snippet storage
- ⚡ Fast startup and lightweight workflow
- 🔄 Automatic updates

---

## 📸 Gallery

### Main Window

<p align="center">
  <img src="app/assets/screenshots/main_window.png" width="850">
</p>

---

### Creating a Snippet

<p align="center">
  <img src="app/assets/screenshots/add_snippet.png" width="850">
</p>

---

### Monaco Editor

<p align="center">
  <img src="app/assets/screenshots/monaco_editor.png" width="850">
</p>

---

### Splash Screen

<p align="center">
  <img src="app/assets/screenshots/splash_screen.png" width="850">
</p>

---

## 🚀 Installation

Download the latest release from the Releases page and run:

```
Code.HP Setup.exe
```

A desktop shortcut will be created automatically.

---

## 📁 Project Structure

```
Code.HP/
├── app/
│   ├── assets/
│   │   ├── fonts/
│   │   │   └── vt323.css
│   │   └── screenshots/
│   ├── main/
│   │   ├── deps/
│   │   │   ├── electron.deps.js
│   │   │   └── render-deps.js
│   │   ├── electron/
│   │   │   ├── electron-main.js
│   │   │   └── Kernel.js
│   │   ├── services/
│   │   │   ├── IpcHandler.js
│   │   │   ├── Launch.js
│   │   │   ├── Logger.js
│   │   │   ├── Shortcut.js
│   │   │   ├── Storage.js
│   │   │   ├── StoragePath.js
│   │   │   └── Updater.js
│   │   └── windows/
│   │       ├── MainWindow.js
│   │       └── SplashWindow.js
│   └── renderer/
│       ├── mainWindow/
│       │   ├── mainWindow.html
│       │   ├── css/
│       │   │   ├── base.css
│       │   │   ├── components.css
│       │   │   ├── editor.css
│       │   │   ├── layout.css
│       │   │   ├── main.css
│       │   │   └── theme.css
│       │   └── js/
│       │       ├── language-definitions.js
│       │       ├── main.js
│       │       └── monaco-editor.js
│       └── splashWindow/
│           ├── splashWindow.html
│           ├── css/
│           │   └── splash.css
│           └── js/
│               └── splash.js
├── scripts/
│   └── Code.HP.vbs
└── snippets/
   
---

## 🛠️ Development

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

---

## 📋 Roadmap

See the project's roadmap here:

**[TODO.md](TODO.md)**

---

## 📄 License

MIT License

---

**Version:** 1.3.0