# 3DPrinterOS Kiosk UI - Distribution

This repository contains the built Tampermonkey script for the 3DPrinterOS Kiosk UI.

## Installation

Install in Tampermonkey using one of these methods:

### Method 1: Install from URL
1. Open Tampermonkey dashboard
2. Go to **Utilities** → **Install from URL**
3. Enter: `https://raw.githubusercontent.com/YOUR_USERNAME/3dpos-kiosk-dist/main/3dpos-kiosk.user.js`
4. Click **Install**

### Method 2: Use @require
Create a loader script in Tampermonkey:
```javascript
// ==UserScript==
// @name         3DPrinterOS Kiosk UI [Auto-Update]
// @namespace    https://cloud.3dprinteros.com/
// @version      0.2.0
// @description  Auto-updating kiosk UI loader
// @match        https://cloud.3dprinteros.com/*
// @run-at       document-idle
// @grant        none
// @require      https://raw.githubusercontent.com/YOUR_USERNAME/3dpos-kiosk-dist/main/3dpos-kiosk.user.js
// ==/UserScript==
```

## Auto-Updates

This file is automatically updated when changes are pushed to the source repository.

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username in the URLs above.
