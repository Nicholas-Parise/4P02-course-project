import React from 'react'
import { Link } from 'react-router-dom'
import '../../login.css'

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState)
  }

  return (
    <section className="login-container">
      <h2>Sign in to continue</h2>
      <form action="" method="POST">
        <label htmlFor="username">Username</label>
        <input 
          type="text"
          id="username"
          name="username"
          placeholder='Username'
          required
        ></input>

        <label htmlFor="password">Password</label>
        <div className='login-password-input-container'>
          <input 
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder='Password'
            required
          ></input>
          <span
            className='login-password-toggle'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>
      <Link to="/forgot-password" className="login-forgot-password">Forgot password?</Link>
      <div className="login-signup">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </section>
  )
}

export default Login