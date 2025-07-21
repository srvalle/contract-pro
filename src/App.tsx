// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateContract from './pages/CreateContract';
import ListContracts from './pages/ListContracts';
import Plans from './pages/Plans';
import PrivateRoute from './components/PrivateRoute';
import ViewContract from './pages/ViewContract';
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-contract"
            element={
              <PrivateRoute>
                <CreateContract />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-contract/:id"
            element={
              <PrivateRoute>
                <CreateContract />
              </PrivateRoute>
            }
          />
          <Route
            path="/list-contracts"
            element={
              <PrivateRoute>
                <ListContracts />
              </PrivateRoute>
            }
          />
          <Route
            path="/contract/:id"
            element={
              <PrivateRoute>
                <ViewContract />
              </PrivateRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <PrivateRoute>
                <Plans />
              </PrivateRoute>
            }
          />
          <Route path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
        </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
