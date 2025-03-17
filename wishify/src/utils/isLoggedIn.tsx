import { jwtDecode } from "jwt-decode";

export default function isLoggedIn(){
    const token: string = localStorage.getItem('token') || ""

    if(token === "") return false
    if(hasTokenExpired(token)) return false

    return true
}

function hasTokenExpired(token: string) {
    try {
      // Decode the token to get the payload
      const decoded = jwtDecode(token);

      if (decoded.exp === undefined) return true
  
      const currentTime = Date.now() / 1000;
  
      // Check if the token is expired
      if (decoded.exp < currentTime) {
        return true; // Token has expired
      } else {
        return false; // Token has not expired
      }
    } catch (error) {
      console.error('Invalid token', error);
      return true; // Return true if token decoding fails (invalid token)
    }
  }