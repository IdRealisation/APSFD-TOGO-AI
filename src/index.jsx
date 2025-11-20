import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // L'importation correcte pour laisser le compilateur trouver ./App.jsx

// Ce fichier est le point d'entrée qui dit à React où et comment afficher l'application.

const rootElement = document.getElementById('root');

// Utilise la nouvelle API de rendu de React 18 pour créer la racine et injecter l'application.
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    // StrictMode aide à détecter les problèmes potentiels dans l'application
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
    // Mesure de sécurité si jamais l'élément HTML est manquant
    console.error("L'élément 'root' n'a pas été trouvé dans le DOM. Veuillez vérifier public/index.html.");
}