import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Jobs from './pages/Jobs'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="/jobs" className="hover:text-blue-400">Jobs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
