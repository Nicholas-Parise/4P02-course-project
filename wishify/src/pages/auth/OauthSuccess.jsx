import {useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const OauthSuccess = ({setIsLoggedIn}) => {
  // Put session token in sessionStorage if it's in the URL query string
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [responseMessage, setResponseMessage] = useState("");


  useEffect(() => {
  if (token) {
    sessionStorage.setItem("token", token);
    setResponseMessage(
      <>
        Successfully authenticated. Redirecting to your <Link to="/home" className="home-link">home page</Link>...
      </>
    );
    setIsLoggedIn(true);
    setResponseType("success");
    navigate("/home");
  }else{
    console.error("No token found");
    setResponseMessage(
      <>
        No token given...
      </>
    );
  }
}, []);

  return (
    <>
      <section>
        {responseMessage}
      </section>
    </>
  )
}

export default OauthSuccess