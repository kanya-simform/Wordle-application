# Project Structure Analysis

```
/
├── .github/              # GitHub Actions, issue templates, etc.
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── KeyboardEntry.tsx
│   │   ├── Navbar.tsx
│   │   └── WordleText.tsx
│   ├── service/          # API service wrappers
│   │   └── axiosInstance.ts
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .gitignore
├── index.html            # HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```
