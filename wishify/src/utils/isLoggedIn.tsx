export default function isLoggedIn(){
    const token: string = localStorage.getItem('token') || ""

    if(token === ""){
        return false
    }

    // check if token is expired here...


    return true
}