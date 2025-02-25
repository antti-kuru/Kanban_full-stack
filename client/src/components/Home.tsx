
import { useNavigate } from "react-router-dom"



const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container">
      <h1 className="center-align"> Home page</h1>
      <p className="center-align"> You are currently not logged in. To proceed login or register</p>
      <div className="row center">
        <a className="btn waves-effect waves-light" style={{marginRight: "20px"}} onClick={() => navigate("/login")}>Login</a>
        <a className="btn waves-effect waves-light" onClick={() => navigate("/register")}>Register</a>
      </div>
    
    </div>
  )
  
}

export default Home