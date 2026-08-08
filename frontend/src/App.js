import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ChallengeDay from './components/ChallengeDay';
import { fetchUserWithFallback } from './api/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserWithFallback('user_1');
      setUser(userData);
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleStartChallenge = (track) => {
    setUser(prev => ({ ...prev, track }));
    setCurrentView('dashboard');
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setCurrentView('challenge');
  };

  const handleBackToDashboard = async () => {
    await loadUserData();
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onStart={handleStartChallenge} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onDaySelect={handleDaySelect}
          />
        );
      case 'challenge':
        return (
          <ChallengeDay 
            day={selectedDay} 
            onBack={handleBackToDashboard}
            user={user}
          />
        );
      default:
        return <LandingPage onStart={handleStartChallenge} />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading ABTalks Platform...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;