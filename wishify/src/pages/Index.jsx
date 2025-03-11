import isLoggedIn from "../utils/isLoggedIn"
import HomePage from "./Home";
import Landing from "./Landing";


const Index = () => {
  return (
    <>
        {isLoggedIn() ? 
            <HomePage />
          :
            <Landing />
        }
    </>
  )
}

export default Index