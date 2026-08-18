import React, { useState } from 'react'
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

const PublicLayout = ({ setShowLogin }) => (
  <>
    <Navbar setShowLogin={setShowLogin} />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </main>
    <Footer />
  </>
)

const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <Routes>
      <Route
        path="/*"
        element={<PublicLayout setShowLogin={setShowLogin} />}
      />

      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCars />} />
        <Route path="manage-bookings" element={<ManageBookings />} />
      </Route>
    </Routes>
  )
}

export default App