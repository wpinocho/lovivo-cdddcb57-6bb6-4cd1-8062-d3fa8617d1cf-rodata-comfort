import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/vite-error-bridge'  // Captura errores de Vite y los envía al parent
import { initExperimentPreview } from './lib/experimentPreview'

initExperimentPreview()

createRoot(document.getElementById("root")!).render(<App />);
