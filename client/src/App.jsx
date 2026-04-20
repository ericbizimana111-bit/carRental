import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CarDetails from './pages/CarDetails.jsx'
import Cars from './pages/Cars.jsx'
import MyBookings from './pages/MyBookings.jsx'
// ./ when in the same folder
//  ../ when in different folder but in the same folder


const App = () => {


  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner') //returns true or false //true if user is on owner page 
  return (
    <>
      {/* curl braces allows to enter javascript mode inside jsx  */}
      {/*this is like saying if am not on an owner page,show navbar  */}

      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      {/* in react <Route> i sused to map  URL path to a specific component */}
      {/* Route connect url to the component  */}
      {/* element in route is for telling which component should be rendered when this route matchens the url */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />
      </Routes >

    </>
  )
}

export default App;

/*
| Command                 | Purpose                    |
| ----------------------- | -------------------------- |
| `npm audit`             | Check for vulnerabilities  |
| `npm audit fix`         | Fix them safely            |
| `npm audit fix --force` | Force fix (may break code) |
*/

