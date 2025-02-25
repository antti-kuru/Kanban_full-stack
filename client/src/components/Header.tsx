import {useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom"
import M from "materialize-css"





const Header = () => {
    // This is needed to initialize Materialize components for dropdowns 
    useEffect(() => {
        M.AutoInit()
    }, [])

    const loggedStatus = localStorage.getItem("token")

    const navigate = useNavigate()

    const handleLogout = () => {
      console.log("Succesfully logged out")
      localStorage.removeItem("token")
      navigate("/")
    }
    

    return (
        <nav>
           <div className="nav-wrapper">
                <ul id="nav-mobile" className="left hide-on-med-and-down">

                    {/* Conditionally render links based on login status */}
                    {!loggedStatus && (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}

                    {/* Optionally show a Logout link if the user is logged in */}
                    {loggedStatus && (
                      <>
                        <li><Link to="/kanban">Kanban Board</Link></li>
                        <li>
                          <a href="#" onClick={handleLogout}> Logout</a>
                        </li>
                    </>
                    )}
                </ul>
            </div>
        </nav>
      )
    }

export default Header