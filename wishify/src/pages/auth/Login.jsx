import React from 'react'
import { Link } from 'react-router-dom'
import '../../login.css'

const Login = () => {
  let isAuthenticating = false
  let token = localStorage.getItem('token')

  const [showPassword, setShowPassword] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData(prevData => {
      const newData = { ...prevData, [name]: value}
      validateForm(newData)
      return newData
    })
  }

  const validateForm = (data) => {
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
    const isPasswordValid = data.password !== "" && data.password.length <= 64

    const isFormValid = isEmailValid && isPasswordValid

    setIsValid(isFormValid)
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !isValid ||
      isAuthenticating
    ) { return }
    
    isAuthenticating = true

    try {
      let data
      const response = await fetch("https://api.wishify.ca/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })

      data = await response.json()

      if (data.token) {
        token = data.token
        localStorage.setItem('token', token)
        console.log("Authenticated!")
        // redirect to home page
      } else {
        console.log("Failed to authenticate...")
        // display message to user
      }

    } catch (err) {
      console.log(`Uh oh, an error: ${err.message}`)
    } finally {
      isAuthenticating = false
    }
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState)
  }

  return (
    <section className="login-container">
      <h2>Sign in to continue</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input 
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          required
          placeholder='johndoe@wishify.com'
        ></input>

        <label htmlFor="password">Password</label>
        <div className='login-password-input-container'>
          <input 
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            required
            placeholder='Password'
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