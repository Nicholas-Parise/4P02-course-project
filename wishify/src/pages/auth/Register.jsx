import React from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import '../../register.css'

const Register = () => {
  // Put share_token in sessionStorage if it's in the URL query string
  const [searchParams, setSearchParams] = useSearchParams();
  const share_token = searchParams.get("wishlist")
  if(share_token) sessionStorage.setItem("share_token", share_token)

  const [isAuthenticating, setIsAuthenticating] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [responseType, setResponseType] = React.useState(""); 

  const [isFieldValid, setIsFieldValid] = React.useState({
    email: false,
    displayName: false,
    password: false,
    confirmPassword: false
  })

  const [formData, setFormData] = React.useState({
    email: "",
    displayName: "",
    password: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = React.useState({
    email: false,
    displayName: false,
    password: false,
    confirmPassword: false
  })

  const [showTooltip, setShowTooltip] = React.useState(false);
  
  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData(prevData => {
      const newData = { ...prevData, [name]: value }
      validateForm(newData)
      return newData
    })
  }

  const handleBlur = (event) => {
    const { name } = event.target
    if (name === 'password') {
      setShowTooltip(false)
    }
  }

  const handleFocus = (event) => {
    const { name } = event.target
    setTouched(prevTouched => ({ ...prevTouched, [name]: true }))
    if (name === 'password') {
      setShowTooltip(true)
    }
  }

  const validateForm = (data) => {
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
    const isDisplayNameValid = 
      (data.displayName !== "" &&
      data.displayName.length  <= 64)
    const isPasswordValid = 
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(data.password)
    const isConfirmPasswordValid =
      (isPasswordValid &&
      data.password == data.confirmPassword)

    const isFormValid = isEmailValid && isDisplayNameValid && isPasswordValid && isConfirmPasswordValid
    
    setIsFieldValid({
      email: isEmailValid,
      displayName: isDisplayNameValid,
      password: isPasswordValid,
      confirmPassword: isConfirmPasswordValid
    })

    setIsValid(isFormValid)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValid || isAuthenticating) {
      return
    }

    setIsAuthenticating(true)

    try {
      const response = await fetch("https://api.wishify.ca/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, password: formData.password, displayName: formData.displayName })
      })
      
      const data = await response.json()

      if (response.status === 201) {
        setResponseMessage(
          <>
            Account successfully created!<br />
            Please proceed to the <Link to="/login" className='login-link'>login</Link> page.
          </>
        );
        setResponseType("success");
        setFormData({
          email: "",
          displayName: "",
          password: "",
          confirmPassword: ""
        });
        setTouched({
          email: false,
          displayName: false,
          password: false,
          confirmPassword: false
        });
        setIsFieldValid({
          email: false,
          displayName: false,
          password: false,
          confirmPassword: false
        });
        setIsValid(false);
      } else if (response.status === 400) {
        setResponseMessage("Bad request. Please fill in all required fields.");
        setResponseType("error");
      } else if (response.status === 409) {
        setResponseMessage("Account with that email address already registered.");
        setResponseType("error");
      } else if (response.status === 500) {
        setResponseMessage("Internal error: something went wrong.");
        setResponseType("error");
      } else {
        setResponseMessage("An unexpected error occurred. Please try again.");
        setResponseType("error");
      }

    } catch (err) {
      setResponseMessage("An error occurred. Please try again.");
      setResponseType("error");
      console.log(err.message)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState)
  }

  return (
    <>
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
            onBlur={handleBlur}
            onFocus={handleFocus}
            required
            placeholder='bob@wishify.com'
            className={touched.email ? (isFieldValid.email ? 'valid' : 'invalid') : ''}
          ></input>

          <label htmlFor="display-name">Display Name</label>
          <input 
            type="text"
            id="display-name"
            name="displayName"
            value={formData.displayName}
            onChange={handleFormChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required
            placeholder='John Doe'
            className={touched.displayName ? (isFieldValid.displayName ? 'valid' : 'invalid') : ''}
          ></input>

          <label htmlFor="password">Password</label>
          <div className='login-password-input-container'>
            <input 
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              required
              placeholder='Password'
              className={touched.password ? (isFieldValid.password ? 'valid' : 'invalid') : ''}
            ></input>
            <span
              className='register-password-toggle'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {showTooltip && (
              <div className="tooltip">
                Password must contain a minimum of:
                <ul>
                  <li>8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special symbol</li>
                </ul>
              </div>
            )}
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className='register-password-input-container'>
            <input 
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleFormChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              required
              placeholder='Confirm password'
              className={touched.confirmPassword ? (isFieldValid.confirmPassword ? 'valid' : 'invalid') : ''}
            ></input>
            <span
              className='register-password-toggle'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" disabled={!isValid || isAuthenticating}>Create account</button>
        </form>

        {responseMessage && (
          <div className={`response-message ${responseType}`}>
            {responseMessage}
          </div>
        )}

        <div className="register-signup">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </section>
    </>
  )
}

export default Register