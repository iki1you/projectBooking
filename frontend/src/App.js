import React from 'react'
import "./app.scss"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProtectedRoute from "./utils/ProtectedRoute"
import { AuthProvider } from './context/AuthContext'
import { AddRestaurant, Dashboard, Navigation, Login, Register, UserRestaurants, Home } from "./pages"


const App = () => {
  return (
    <div className='App'>
        <div className='container'>
            <Router>
                <AuthProvider>
                    <Navigation/>
                    <Routes>
                        <Route 
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />

                        <Route path="/login" element={<Login />} />
                        <Route path="/addrestaurant" element={<AddRestaurant />} />
                        <Route path="/restaurants" element={<UserRestaurants />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    </div>
  )
}

export default App