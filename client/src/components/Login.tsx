import {useState} from 'react'
import { useNavigate } from 'react-router-dom'



const loginUser = async (email: string, password: string, e: React.FormEvent, navigate: any) => {
    e.preventDefault()
    const formData = {
        email: email,
        password: password
    }
    try {
        const res = await fetch("api/login", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(formData)
        })
        const data = await res.json()

        if(data.token){
            localStorage.setItem("token", data.token)
            console.log(data)
            console.log("Logged in")


            navigate("/kanban")
        } else {
            alert("Login failed, try again")
        }

    } catch (error) {
        console.log(error)
    }
}

const Login = () => {
 
    // variables to store the form info
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            alert("Some required field is empty")
            return
        }
        loginUser(email, password, e, navigate)
    }

  return (
    <div className='container'>
        <h1 className="center-align">Login</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-field'>

            <input
             type="text"
             placeholder='email'
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required />
             </div>

          

            <div className='input-field'>
            <input 
             type="password"
             placeholder='password'
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required />
             </div>

             <button type="submit" className="btn waves-effect waves-light center-align"> Login </button>
        </form>
    </div>
  )
}

export default Login