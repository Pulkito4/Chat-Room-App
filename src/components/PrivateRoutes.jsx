/* to learn more about protected routes we may refer to : https://medium.com/@dennisivy/creating-protected-routes-with-react-router-v6-2c4bbaf7bc1c  
(article by mentor for this project/app) */

import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'


const PrivateRoutes = () => {
    const {user} = useAuth()
  return (
    <>
        {user ? <Outlet/> : <Navigate to='/login'/>}  
        {/* 
        the Outlet component is used to render the child routes of the parent route.
        the Navigate component is used to navigate to a different location.
        if the user is not logged in, the user will be redirected to the login page.
        */}
    </>
  )
}

export default PrivateRoutes