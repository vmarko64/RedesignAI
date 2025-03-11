import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import DesignDetail from './components/designs/DesignDetail';
import ExpandDesign from './pages/ExpandDesign';

import { SettingsProvider } from './contexts/SettingsContext';
import { DesignProvider } from './contexts/DesignContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <DesignProvider>
          <FavoritesProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-dark-900">
                <Header />
                <main className="flex-1 w-full bg-gradient-dark">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/design/:id" element={<DesignDetail />} />
                    <Route path="/expand/:designId" element={<ExpandDesign />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </FavoritesProvider>
        </DesignProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App; 