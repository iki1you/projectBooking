import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Login = () => {
  const {loginUser} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log(e.target)

    const email = e.target.email.value
    const password = e.target.password.value

    loginUser(email, password)
  }

  return (
    <div className='login'>
      <h1>Войти</h1>

      <form onSubmit={handleSubmit}>
        
        <label>Электронная почта:</label>
        <input 
          type="email" 
          name="email"
          required />

        <label>Пароль:</label>
        <input 
          type="password" 
          name="password"
          required />

        <div className='btn-container'>
          <button type='submit'>Войти</button>
        </div>
        <span>;
          <Link to="/register">Регистрация</Link>
        </span>

      </form>
    </div>
  )
}

export default Login