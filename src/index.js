import React from 'react';
import ReactDOM from 'react-dom/client';
import './fonts/ubuntu/ubuntu-light.ttf';
import './fonts/ubuntu/ubuntu-regular.ttf';
import './fonts/ubuntu/ubuntu-bold.ttf';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
