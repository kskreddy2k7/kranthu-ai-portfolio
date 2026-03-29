import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('🤖 [Avatar System] Bundle loaded. Initializing...');

function mountAvatar() {
  try {
    console.log('🤖 [Avatar System] mountAvatar() called. document.readyState:', document.readyState);
    
    const oldWrapper = document.getElementById('kranthu-avatar-wrapper');
    if (oldWrapper) {
      console.log('🤖 [Avatar System] Removing old fallback avatar.');
      oldWrapper.remove();
    }

    let root = document.getElementById('avatar-root');
    if (!root) {
      console.log('🤖 [Avatar System] Creating new #avatar-root element.');
      root = document.createElement('div');
      root.id = 'avatar-root';
      document.body.appendChild(root);
    } else {
      console.log('🤖 [Avatar System] Found existing #avatar-root.');
    }
    
    // Sit above normal content but below the Navbar (1020)
    root.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none !important;z-index:100;';

    console.log('🤖 [Avatar System] Calling createRoot(root).render(...)');
    createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('🤖 [Avatar System] React render requested successfully.');
  } catch (error) {
    console.error('🤖 [Avatar System] FATAL ERROR during mount:', error);
  }
}

if (document.readyState === 'loading') {
  console.log('🤖 [Avatar System] Document still loading, attaching DOMContentLoaded listener.');
  document.addEventListener('DOMContentLoaded', mountAvatar);
} else {
  console.log('🤖 [Avatar System] Document already parsed, mounting immediately.');
  mountAvatar();
}
