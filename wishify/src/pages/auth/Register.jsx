import React from 'react'
import { Link } from 'react-router-dom'
import '../../register.css'

const Register = () => {
    const [showPassword, setShowPassword] = React.useState(false)
  
    const togglePasswordVisibility = () => {
      setShowPassword(prevState => !prevState)
    }

    // TODO: password checking + messages
    // Outline inputs depending on valid/invalid input

  return (
    <section className="register-container">
      <h2>Create your account</h2>
      <form action="" method="POST">

        <label htmlFor="email">Email</label>
        <input 
          type="email"
          id="email"
          name="email"
          placeholder='bob@wishify.com'
          required
        ></input>

        <label htmlFor="username">Username</label>
        <input 
          type="text"
          id="username"
          name="username"
          placeholder='Bob_007'
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
            className='register-password-toggle'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <label htmlFor="confirm-password">Confirm Password</label>
        <div className='register-password-input-container'>
          <input 
            type={showPassword ? "text" : "password"}
            id="confirm-password"
            name="confirm-password"
            placeholder='Confirm password'
            required
          ></input>
          <span
            className='register-password-toggle'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit">Create account</button>
      </form>

      <div className="register-signup">
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>
    </section>
  )
}

export default Register