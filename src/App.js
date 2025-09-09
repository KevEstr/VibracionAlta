import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Home from './pages/Home';
import BookingForm from './pages/BookingForm';
import Calendar from './pages/Calendar';
import MyAppointments from './pages/MyAppointments';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reservar" element={<BookingForm />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/mis-citas" element={<MyAppointments />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
