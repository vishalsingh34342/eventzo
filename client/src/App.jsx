import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import { Route, Routes } from "react-router-dom";
import MyBooking from "./pages/MyBooking";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuceess from "./pages/PaymentSuceess";
import PaymentFailed from "./pages/PaymentFailed";
import Events from "./pages/Events";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBooking />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/payment-success" element={<PaymentSuceess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<Profile />} />
       
      </Routes>
    </>
  );
}

export default App;
