import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PremiumProvider } from './contexts/PremiumContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import BillsPage from './pages/BillsPage';
import CreateBillPage from './pages/CreateBillPage';
import BillDetailPage from './pages/BillDetailPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';
import PremiumPage from './pages/PremiumPage';
import LoginPage from './pages/LoginPage';
import ApiTestPage from './pages/ApiTestPage';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <Router>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Protected routes */}
                  <Route path="/bills" element={
                    <ProtectedRoute>
                      <BillsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <CreateBillPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/create-bill" element={
                    <ProtectedRoute>
                      <CreateBillPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/bill/:id" element={
                    <ProtectedRoute>
                      <BillDetailPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/bill/:id/edit" element={
                    <ProtectedRoute>
                      <CreateBillPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/templates" element={
                    <ProtectedRoute>
                      <TemplatesPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/premium" element={
                    <ProtectedRoute>
                      <PremiumPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/api-test" element={
                    <ProtectedRoute>
                      <ApiTestPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
