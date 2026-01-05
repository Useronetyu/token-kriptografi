# IlhamFi Lab - Solana Simulation & Analytics Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Tech](https://img.shields.io/badge/built%20with-Lovable-ff0000.svg)

**IlhamFi Lab** is a cutting-edge simulation dashboard designed for the Solana blockchain ecosystem. It provides real-time analytics, token simulations, liquidity pool modeling, and governance visualization in a sleek, responsive interface.

---

## 📑 Table of Contents

1. [About the Project](#-about-the-project)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Prerequisites](#-prerequisites)
5. [Installation Guide](#-installation-guide)
6. [Project Structure](#-project-structure)
7. [Available Scripts](#-available-scripts)
8. [Development Guidelines](#-development-guidelines)
9. [Configuration & Customization](#-configuration--customization)
10. [Deployment](#-deployment)

---

## 📖 About the Project

**IlhamFi Lab** was created to bridge the gap between complex blockchain data and user-friendly visualization. This project serves as a "Playground" or "Lab" for simulating various DeFi (Decentralized Finance) scenarios without risking real assets.

The dashboard allows users to:
* Monitor token prices in real-time (simulated).
* Analyze holder distribution.
* Vote on protocol governance proposals.
* Simulate liquidity provision and yield farming.

This project is built using the **Lovable** platform capabilities, ensuring rapid development and high-quality UI components.

---

## 🚀 Key Features

### 1. Advanced Dashboard Layout
* **Grid System**: A responsive 2-column grid layout optimizing screen real estate.
* **Side-by-Side Analytics**: Real-time price charts placed adjacent to holder lists for immediate correlation analysis.
* **Dark Mode**: Optimized for low-light environments with a sleek, neon-accented dark theme.

### 2. Token Simulation Engine
* **SOL & ILHAM Token Support**: Dedicated sections for the native SOL token and the custom ILHAM ecosystem token.
* **Balance Tracking**: Dynamic simulated wallet balances that update based on user interactions.

### 3. Interactive Analytics
* **Top Holders List**: A clickable list of top token holders.
* **Dynamic Charts**: Clicking a holder updates the chart to show their specific transaction history.
* **Portfolio Pie Chart**: A `recharts`-powered visualization showing the distribution of Available, Staked, and Burned tokens.

### 4. Liquidity Pool (LP) Simulator
* **Swap Simulation**: Users can simulate swapping SOL for ILHAM.
* **Fee Calculator**: An automated counter showing "Swap Fees Earned" based on simulated volume.
* **Impermanent Loss Model**: (Planned) Visual indicators for potential LP risks.

### 5. Governance & Voting
* **Proposal System**: View active proposals (e.g., "Burn 10% Supply").
* **Voting Mechanism**: Interactive "For" and "Against" voting buttons.
* **Live Results**: Progress bars updating in real-time as simulated votes are cast.

### 6. Alert System
* **Price Thresholds**: Users can set custom target prices.
* **Notifications**: Toast notifications trigger when the simulated price crosses the user's defined threshold.

---

## 💻 Technology Stack

This project is built on a modern, robust stack designed for performance and scalability:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **React 18** | The library for web and native user interfaces. |
| **Build Tool** | **Vite** | Next Generation Frontend Tooling, extremely fast. |
| **Language** | **TypeScript** | Strongly typed programming language that builds on JavaScript. |
| **Styling** | **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |
| **UI Components** | **shadcn/ui** | Re-usable components built using Radix UI and Tailwind CSS. |
| **Charting** | **Recharts** | A composable charting library built on React components. |
| **Icons** | **Lucide React** | Beautiful & consistent icons. |
| **State Mgmt** | **TanStack Query** | Powerful asynchronous state management. |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

1.  **Node.js**: Version 18.0.0 or higher.
    * Verify with: `node -v`
2.  **npm** (Node Package Manager) or **Bun**.
    * Verify with: `npm -v` or `bun -v`
3.  **Git**: For version control.
    * Verify with: `git --version`
4.  **IDE**: Visual Studio Code (Recommended).

---

## 🛠 Installation Guide

Follow these steps to set up the project locally:

**Step 1: Clone the Repository**
Open your terminal and run the following command to download the source code:

```bash
git clone <YOUR_GIT_URL_HERE>
cd <YOUR_PROJECT_NAME>

npm install
# OR if you use yarn
yarn install
# OR if you use pnpm
pnpm install
# OR if you use bun
bun install 

npm run dev

Token-Kriptografi/
├── node_modules/
├── public/                     # Static assets
│   ├── logo.png
│   ├── placeholder.svg
│   ├── robots.txt
│   └── tobe.png
├── src/
│   ├── components/             # UI Components
│   │   ├── ui/                 # shadcn-ui primitive components
│   │   ├── AnimatedNumber.tsx
│   │   ├── AssetCards.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Governance.tsx
│   │   ├── Header.tsx
│   │   ├── HolderActivityChart.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── LiquidityPool.tsx
│   │   ├── OperationsCenter.tsx
│   │   ├── PriceAlerts.tsx
│   │   ├── PriceChart.tsx
│   │   ├── TokenPortfolio.tsx
│   │   └── TransactionHistory.tsx
│   ├── contexts/               # Context Providers
│   │   ├── ThemeContext.tsx
│   │   └── WalletContext.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useSound.ts
│   ├── lib/                    # Utility functions
│   │   └── utils.ts
│   ├── pages/                  # Application Pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.css                 # Global CSS (App level)
│   ├── App.tsx                 # Main component
│   ├── index.css               # Global CSS (Tailwind imports)
│   ├── main.tsx                # React Entry point
│   └── vite-env.d.ts           # Vite Type definitions
├── .gitignore
├── bun.lockb                   # Bun Lockfile
├── components.json             # shadcn-ui config
├── eslint.config.js            # ESLint config
├── index.html                  # HTML Entry point
├── package.json
├── postcss.config.js
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite config