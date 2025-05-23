import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import '../../login.css'
import google from "../../assets/Google.svg";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({setIsLoggedIn}) => {
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
        setIsLoggedIn(true);
        setResponseType("success");
        
        // Check for upgrade redirect first
        const upgradeRedirect = sessionStorage.getItem("upgrade_redirect");
        if (upgradeRedirect === "true") {
          sessionStorage.removeItem("upgrade_redirect");
          navigate("/upgrade");
          return;
        }
        
        // Then check for share token (existing functionality)
        const event_share_token = sessionStorage.getItem("event_share_token")
        if(event_share_token) {
          fetch(`https://api.wishify.ca/events/members`, {
            method: 'post',
            headers: new Headers({
              'Authorization': "Bearer "+data.token,
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                share_token: event_share_token,
                owner: false
            })
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                sessionStorage.removeItem("event_share_token")
            })
            .catch((error) => {
              console.log("Failed to share event\n" + error)
              alert("Failed to share event\n" + error)
            }
          )
        }

        const wishlist_share_token = sessionStorage.getItem("wishlist_share_token")
        if(wishlist_share_token) {
          fetch(`https://api.wishify.ca/wishlists/members`, {
            method: 'post',
            headers: new Headers({
              'Authorization': "Bearer "+data.token,
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                share_token: wishlist_share_token,
                owner: false,
                blind: false
            })
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                sessionStorage.removeItem("wishlist_share_token")
                navigate(`/wishlists/${data.id}`)
            })
            .catch((error) => {
              console.log("Failed to share wishlist\n" + error)
              alert("Failed to share wishlist\n" + error)
              navigate("/home")
            }
          )
        }
        else{
          navigate("../home")
        }
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


  const handleGoogleLogin = () => {
    window.location.href = 'https://api.wishify.ca/auth/google';
  };

  return (
    <>
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
              {showPassword ? <VisibilityOff /> : <Visibility />}
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
        <br></br>
        <hr></hr>
        <button onClick={handleGoogleLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px',
          cursor: 'pointer',
          position: 'relative'
        }}>
        <img src={google} 
        align="left" alt="G" 
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: 'white',
          padding: '5px',
          borderRadius: '25px',
          marginRight: '10px'
          }}
          />
          <span style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 50px)'
          }}>
            Login with Google
            </span>
        </button>
      </section>
      
    </>
  )
}

export default Login