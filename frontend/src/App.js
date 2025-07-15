import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/chat" element={<Chat />} />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;