import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import OwnerLayout from './components/OwnerLayout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './pages/Admin'
import Favorites from './pages/Favorites'

const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </main>
    <Footer />
  </>
)

const App = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={<PublicLayout />}
      />

      <Route path="/owner" element={<ProtectedRoute roles={['owner', 'admin']}><OwnerLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCars />} />
        <Route path="manage-bookings" element={<ManageBookings />} />
      </Route>
      <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>} />
    </Routes>
  )
}

export default App