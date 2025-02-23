import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../login.css'

const Login = () => {
  const [isAuthenticating, setIsAuthenticating] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)
  const [responseMessage, setResponseMessage] = React.useState("");
  const [responseType, setResponseType] = React.useState(""); // "success" or "error"
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

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
    const isPasswordValid = data.password.length >= 8 && data.password.length <= 64

    const isFormValid = isEmailValid && isPasswordValid

    setIsValid(isFormValid)
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValid || isAuthenticating) { 
      return 
    }
    
    setIsAuthenticating(true)

    try {
      const response = await fetch("https://api.wishify.ca/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })

      const data = await response.json()

      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token)
        setResponseMessage(
          <>
            Successfully authenticated. Redirecting to your <Link to="/home" className="home-link">home page</Link>...
          </>
        );
        setResponseType("success");
        navigate("../Home")
      } else if (response.status === 400) {
        setResponseMessage("Bad request. Please fill in all required fields.");
        setResponseType("error");
      } else if (response.status === 401) {
        setResponseMessage("Incorrect email or password. Please try again.");
        setResponseType("error");
      } else if (response.status === 500) {
        setResponseMessage("Internal error: something went wrong. Please try again later.");
        setResponseType("error");
      } else {
        setResponseMessage("An unexpected error occurred. Please try again.");
        setResponseType("error");
      }

    } catch (err) {
      setResponseMessage(`An error occurred: ${err.message}`);
      setResponseType("error");
    } finally {
      setIsAuthenticating(false)
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

        <button type="submit" disabled={!isValid || isAuthenticating}>Login</button>
      </form>

      {responseMessage && (
        <div className={`response-message ${responseType}`}>
          {responseMessage}
        </div>
      )}

      <Link to="/forgot-password" className="login-forgot-password">Forgot password?</Link>
      <div className="login-signup">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </section>
  )
}

export default Login