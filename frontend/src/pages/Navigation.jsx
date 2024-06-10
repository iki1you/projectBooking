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
      <h1>Бронирование мест</h1>

      {user ?
          <>
            <br/>
            <Link to="/">Главная</Link>
            <br/>
            <Link to="/addrestaurant">Добавить заведение</Link>
            <br/>
            <Link to="/restaurants">Мои заведения</Link>
            <br/>
            <Link to="/userbookings">Мои брони</Link>
            <br/>
            <Link to="/favourite">Избранное</Link>
            <br/>
            <Link to="/dashboard">Профиль</Link>
            <br/>
            <Link onClick={logoutUser}>Выйти</Link>


          </>
          :
          <>
            <br/>
            <Link to="/login">Войти</Link>
          <br />
          <Link to="/register">Регистрация</Link>
        </>
      }
    </div>
  )
}

export default Navigation