import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../utils/AuthContext'

const Header = () => {

    const {user, handleUserLogout} = useAuth()
  return (
    <div id='header--wrapper'>
        {user ? (
            <>
            Welcome {user.name}
            <LogOut onClick={handleUserLogout} className='header--link'/>

            </>
        ):(
            // we wont see this button because the user will already be logged in 
            // but we have just put this here to show that we can conditionally render the login button
            <button>Login</button>
        )}
    </div>
  )
}

export default Header