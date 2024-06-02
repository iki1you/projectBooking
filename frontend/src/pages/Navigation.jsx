import { jwtDecode } from 'jwt-decode'
import React, {useContext} from 'react'
import AuthContext from "../context/AuthContext"
import { Link } from 'react-router-dom'

const Navigation = () => {
  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  if (user){
    const decoded = jwtDecode(token)
    let user_id = decoded.user_id
  }

  return (
    <div className='Navigation'>
      <h1>Homepage</h1>
      <p>This is the Homepage</p>

      {user ?
          <>
            <br/>
            <Link to="/">Home</Link>
            <br/>
            <Link to="/addrestaurant">Add Restaurant</Link>
            <br/>
            <Link to="/restaurants">Restaurants</Link>
            <br/>
            <Link to="/dashboard">Dashboard</Link>
            <br/>
            <Link onClick={logoutUser}>Logout</Link>
          </>
          :
        <>
          <br />
          <Link to="/login">Login</Link>
          <br />
          <Link to="/register">Register</Link>
        </>
      }
    </div>
  )
}

export default Navigation