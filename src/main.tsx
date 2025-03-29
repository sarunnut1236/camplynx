import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { setupMobileAppBehavior } from './lib/utils'

// Import i18n
import './lib/i18n';

// Apply mobile app behaviors
setupMobileAppBehavior();

// Prevent context menu on long press (for mobile app-like feel)
document.addEventListener('contextmenu', e => e.preventDefault());

createRoot(document.getElementById("root")!).render(<App />);
