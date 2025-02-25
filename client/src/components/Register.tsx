import {useState} from 'react'

const saveUser = async (email: string, username: string, password: string, e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
        email: email,
        username: username,
        password: password
    }
    try {
        const res = await fetch("api/register", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        if (!data) {
            alert("Registeration failed")
        }
        console.log(data)

    } catch (error) {
        console.log(error)
    }
}



const Register = () => {
    // Variables to store form data
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!username || !password) {
            alert("Some required field is empty")
            return
        }
        saveUser(email, username, password, e)
    }

  return (
    <div className='container'>
        <h1 className="center-align">Register</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-field'>

            <input
            id="email"
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required />
             <label htmlFor="email"> Email</label>
             </div>

            <div className='input-field'>
            <input
             id='username'
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             required />
             <label htmlFor="username">Username (lenght 3-25 characters)</label>
             </div>

            <div className='input-field'>
            <input 
             id='password'
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required />
             <label htmlFor="password"> Password (length min 8 characters, must include at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character)</label>
             </div>

             <button type="submit" className="btn waves-effect waves-light center-align"> Register </button>
        </form>
    </div>
  )
}

export default Register