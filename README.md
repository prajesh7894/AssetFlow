<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/256px-React-icon.svg.png" alt="React Logo" width="80" height="80" style="margin-bottom: 20px;" />

  # AssetFlow ERP
  **Next-Generation Enterprise Asset & Resource Management**
  
  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  </p>

  *Built exclusively for the Odoo Hackathon*
</div>

---

## ⚡ Overview

AssetFlow bridges the gap between physical hardware and digital workflows. Designed with a sleek, enterprise SaaS-inspired aesthetic, it brings real-time telemetry to asset management. 

From mathematical booking timelines to drag-and-drop maintenance Kanban boards, AssetFlow ensures 100% compliance and chain-of-custody tracking across your entire organization.

## 📚 Hackathon Documentation

For judges and reviewers, please refer to the professional documentation located in our `docs/` folder:

| Document | Description |
|----------|-------------|
| [🚀 Presentation Pitch](./docs/HACKATHON_PRESENTATION.md) | 3-minute demo script and future scope. |
| [🧑‍⚖️ Judge Q&A](./docs/JUDGE_QA.md) | 30 predicted technical & product questions. |
| [🌟 Project Summary](./docs/PROJECT_SUMMARY.md) | Executive summary and key innovations. |
| [🏗️ System Architecture](./docs/SYSTEM_ARCHITECTURE.md) | High-level topology and 5 Mermaid diagrams. |

---

## ✨ Core Modules

- 📊 **Executive Dashboard**: Real-time analytical KPIs with beautiful Recharts data visualization.
- 💻 **Asset Management**: Full CRUD for hardware, furniture, and software licenses with status tagging.
- 🔄 **Chain of Custody**: Transfer hardware seamlessly with split-view active/in-transit tracking.
- 📅 **Timeline Bookings**: Mathematical time-grid rendering for booking meeting rooms and vehicles.
- 🛠️ **Maintenance Kanban**: Drag-and-drop workflow simulation with visual status states.
- 🛡️ **Hardware Audit**: Simulate physical RFID/Barcode scanning. Automatically flags mismatches against the database.
- 🏢 **Organization Hub**: Dual-view module mapping employees to departments instantly.
- 📈 **Reports Engine**: Cross-collection calculations and a universal client-side CSV Export Engine.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/prajesh7894/AssetFlow.git
cd AssetFlow
npm install
```

### 2. Environment Setup
Rename `.env.example` to `.env` and fill in your Firebase configuration keys for production sync.
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 🎮 Demo Sandbox Mode
If you do not provide Firebase keys, the application will automatically enter **Demo Mode** (using LocalStorage). 
Simply log in with `admin@assetflow.com` (password: `admin123`) and click **Seed Sandbox Data** on the dashboard to populate the local database instantly!

---

## 🌍 Deployment

This app is optimized for Vercel's Edge Network.
```bash
npm i -g vercel
vercel --prod
```

<div align="center">
  <p>Built with ❤️ for the Odoo Hackathon</p>
</div>
