import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom'


const App = () => {
  
  
  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner') //returns true or false //true if user is on owner page 
  return (
    <>
      {/* curl braces allows to enter javascript mode inside jsx  */}
      {/*this is like saying if am not on an owner page,show navbar  */}
      
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} /> }


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

