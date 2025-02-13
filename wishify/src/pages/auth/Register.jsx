import React from 'react'
import { Link } from 'react-router-dom'
import '../../register.css'

const Register = () => {
  let isAuthenticating = false

  const [showPassword, setShowPassword] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: ""
  });
  
  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData(prevData => {
      const newData = { ...prevData, [name]: value }
      validateForm(newData)
      return newData
    })
  }

  const validateForm = (data) => {
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
    const isDisplayNameValid = 
      data.displayName !== "" &&
      data.displayName.length  <= 64
    const isPasswordValid = 
      data.password == data.confirmPassword &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(data.password)

    const isFormValid = isEmailValid && isDisplayNameValid && isPasswordValid

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
      const response = await fetch("https://api.wishify.ca/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, confirmPassword: undefined })
      })
      
      data = await response.json()

    } catch (err) {
      console.log(err.message)
    } finally {
      isAuthenticating = false
    }

    // do what with data?
    // inform of account created successfully
    // redirect to homepage?
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState)
  }

  // TODO: invalid form messages
  // Outline inputs depending on valid/invalid input (CSS)

  return (
    <section className="register-container">
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
        <input 
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
          required
          placeholder='bob@wishify.com'
        ></input>

        <label htmlFor="display-name">Display Name</label>
        <input 
          type="text"
          id="display-ame"
          name="displayName"
          value={formData.displayName}
          onChange={handleFormChange}
          required
          placeholder='John Doe'
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFormChange}
            required
            placeholder='Confirm password'
          ></input>
          <span
            className='register-password-toggle'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button type="submit" disabled={!isValid}>Create account</button>
      </form>

      <div className="register-signup">
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>
    </section>
  )
}

export default Register