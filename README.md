# Mubadarat Student Portal 🎓

A modern, high-performance E-Learning platform built with React 19, TypeScript, and Ant Design.

---

## 🚀 Key Features

- **Permission-Based Dynamic Routing**: Flexible access control system that dynamically generates the routing tree.
- **Advanced State Management**: Optimized data flow using Zustand (client state) and TanStack Query (server state).
- **RTL & Multilingual Support**: Comprehensive i18n support including Arabic (RTL), English, and Chinese.
- **Real-Time Interactions**: Integrated Pusher JS for live updates and notifications.
- **Modular Framework Architecture**: Clean separation between core infrastructure (`src/framework`) and business logic (`src/app`).
- **Rich UI/UX**: Premium aesthetic using Ant Design 5.x, Tailwind CSS, and Framer Motion animations.

---

## 🛠 Tech Stack

### Frontend Core
- **React 19** & **Vite 6**
- **TypeScript**
- **React Router 7** (with custom HashRouter engine)

### UI & Styling
- **Ant Design 5.x** (Primary UI Kit)
- **Tailwind CSS 4.x** (Utility classes)
- **Vanilla Extract** (Zero-runtime CSS-in-TS)
- **Framer Motion** (Animations)
- **Sonner** (High-performance toasts)

### Data & State
- **Zustand** (Persistent client state & auth)
- **TanStack Query v5** (Server state & caching)
- **Axios** (API communication)

### Tooling & Quality
- **Biome** (Ultra-fast linting & formatting)
- **MSW (Mock Service Worker)** (API mocking for development)
- **Vite Plugin SVG Icons** (Efficient icon management)

---

## 📂 Project Structure

```text
src/
├── app/            # Application-specific logic
│   ├── api/        # API services & mocks
│   ├── lang/       # Localization dictionaries
│   ├── routes/     # Permission & route definitions
│   └── ui/         # Pages, components, & layouts
├── framework/      # Generic "Web SDK" infrastructure
│   ├── api/        # Base client & interceptors
│   ├── router/     # Permission-to-Route engine
│   ├── store/      # Global persisted stores
│   ├── theme/      # Theme adapter & Style tokens
│   └── utils/      # Generic helper functions
└── assets/         # Global static assets (icons, images)
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 📄 License
MIT © Mubadarah
