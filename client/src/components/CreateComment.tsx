import {useState} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ICard } from './Card'






const saveComment = async (content: string, cardId: string, navigate: any) => {
    try {
        const commentObject = {
            content: content,
            cardId: cardId
        }

        console.log(commentObject)

        const res = await fetch(`/api/createComment/${cardId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(commentObject)
        })
        const data = await res.json()

        console.log(data)

        navigate('/kanban') 

    } catch (error) {
        console.log(error)
    }
}



const CreateComment = () => {
    const [content, setContent] = useState<string>("")
    
    const location = useLocation()
    const navigate = useNavigate()
    const card: ICard = location.state?.card


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!content) {
            alert("Information missing")
            return
        }
        saveComment(content, card._id, navigate)
    }


  return (
    <div className='container'>
        <h1 className='center-align'> Create comment for {card.header}</h1>
        <form onSubmit={handleSubmit}>
            <div className='input-field'>
                <input 
                    id='content'
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required />
                    <label htmlFor="content"> Content</label>
            </div>
            
            <button type='submit' className='btn waves-effect waves-light center-align'>Submit</button>


        </form>



    </div>
  )
}

export default CreateComment