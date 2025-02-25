import {useState} from 'react'
//import { IColumn } from './Column' 
import { ICard } from './Card'
import { useNavigate } from 'react-router-dom'



// Function to save column
const saveColumn =  async (header: string, defaultCards: ICard[], navigate: any) => {  
    const formData = {
        header: header,
        cards: defaultCards
    }

    try {
        // POST call to create column
        const res = await fetch("api/createColumn", {
            method: "POST",
            headers: {"content-type": "application/json", "authorization" : `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        console.log(data)
        if (data.status !== 200) {
            console.log("error")
        }
        // After successful creation move back to kanban page
        navigate("/kanban")

    } catch (error) {
        console.log(error)
    }

}





const CreateColumn = () => {
     const [header, setHeader] = useState<string>("")
     // By default the cards array is empty 
     const defaultCards : ICard[] = []

     const navigate = useNavigate() // Used to navigate to different pages


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!header) {
            alert("header is missing")
            return
        }
        saveColumn(header, defaultCards, navigate)
    }


  return (
    <div className='container'>
        <h1 className='center-align'>Create a column</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-field'>
            <input
                id='header'
                type='text'
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                required />
                <label htmlFor='header' > Header</label>
                </div>
            <button type="submit" className="btn waves-effect waves-light center-align"> Submit </button>


        </form>


    </div>




  )
}

export default CreateColumn