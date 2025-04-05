import React from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'


const OauthSuccess = () => {
  // Put session token in sessionStorage if it's in the URL query string
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [responseMessage, setResponseMessage] = React.useState("");

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
  }


  return (
    <>
      <section>
        Redirecting
        {responseMessage}
      </section>

    </>
  )
}

export default OauthSuccess