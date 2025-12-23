import { App } from './core/App.js';

// Initialize application
const app = new App();
app.init().catch(console.error);

// Handle window errors
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

