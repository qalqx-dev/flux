# FLUX | Universal Matter Engine
> **Serverless. Private. Offline.**
> *Engineered by MONOAXIS.*

![Flux System Status](https://img.shields.io/badge/SYSTEM-ONLINE-00f2ff?style=for-the-badge) ![WASM Core](https://img.shields.io/badge/CORE-WASM-purple?style=for-the-badge) ![Privacy](https://img.shields.io/badge/DATA-ZERO%20TRUST-red?style=for-the-badge)

## 🌌 Mission Brief
**FLUX** is a client-side file converter that runs entirely in your browser using **WebAssembly**. Unlike cloud converters that steal your data, FLUX processes everything on your device's CPU/RAM.

* **Zero Uploads:** Files never leave your phone.
* **Infinite Scale:** No file size limits (optimized for 12GB RAM devices).
* **Offline Capable:** Installs as a PWA and works in airplane mode.

## ⚡ Core Capabilities
| Engine | Functions | Supported Formats |
| :--- | :--- | :--- |
| **FFmpeg WASM** | Media Transcoding | `.mp4` `.mkv` `.avi` `.mp3` `.wav` `.gif` |
| **Daikon** | Medical Imaging | `.dcm` (DICOM) to `.png` |
| **Three.js** | 3D Mesh Conversion | `.stl` to `.gltf`/`.glb` |
| **SheetJS** | Data Transformation | `.xlsx` `.csv` `.json` `.html` |
| **Pandoc** | Document Processing | `.docx` `.md` `.pdf` (Text) |

## 🛠️ Installation (Local)
1. Clone this repository.
2. Open `index.html` in a modern browser (Chrome/Brave).
3. **PWA:** Tap "Add to Home Screen" to install as a native Android app.

## 🚀 Deployment
This project is optimized for **Cloudflare Pages** to enable Multi-Threading support (`SharedArrayBuffer`).

**Required Headers (`_headers`):**
```text
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Resource-Policy: cross-origin
