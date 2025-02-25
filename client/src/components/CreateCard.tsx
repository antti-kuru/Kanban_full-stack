import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IColumn } from './Column'

const saveCard = async (header: string, content: string, columnId: string, color: string, 
    defaultComments: string[], time: number, defaultTimeSpend: number, navigate: any) => {
    try {
        const cardObject = {
            header: header,
            content: content,
            columnId: columnId,
            color: color, // Add the selected color to the card object
            comments: defaultComments,
            estimatedTime: time,
            timeSpend: defaultTimeSpend
        }

        const res = await fetch(`/api/createCard/${columnId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(cardObject)
        })

        const data = await res.json()

        console.log(data)

        navigate('/kanban') // Navigate back to the kanban board
    } catch (error) {
        console.log(error)
    }
}

const CreateCard = () => {
    const [header, setHeader] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>('') // Default color is red
    const [time, setTime] = useState<number>(0)
    // we use empty string array for default comments as new card doesnt have comments
    const defaultComments : string[] = []
    // We use default time spend 0 for user when task is created
    const defaultTimeSpend: number = 0

    const location = useLocation()
    const column: IColumn = location.state?.column
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!header || !content) {
            alert('Information is missing')
            return
        }
        saveCard(header, content, column._id, selectedColor, defaultComments, time, defaultTimeSpend, navigate)
    }

    return (
        <div className="container">
            <h1 className="center-align">Create a card for {column.header}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <input
                        id="header"
                        type="text"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                        required
                    />
                    <label htmlFor="header">Header</label>
                </div>

                <div className="input-field">
                    <input
                        id="content"
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <label htmlFor="content">Content</label>
                </div>
                <div className="input-field">
                    <input
                        id="time"
                        type="number"
                        min={0}
                        value={time}
                        onChange={(e) => setTime(parseInt(e.target.value))}
                        required
                    />
                    <label htmlFor="content">Estimated time to finish (in hours)</label>
                </div>

                {/* Materialize Radio Buttons for color selection */}
                <div className="input-field">
                    <span>Select Color</span>
                    <p>
                        <label>
                            <input
                                name="group1"
                                type="radio"
                                checked={selectedColor === '#fc6262'}
                               
                                onChange={() => setSelectedColor('#fc6262')}
                            />
                            <span>Red</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input
                                name="group1"
                                type="radio"
                                checked={selectedColor === 'yellow'}
                                onChange={() => setSelectedColor('yellow')}
                            />
                            <span>Yellow</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input
                                name="group1"
                                type="radio"
                                checked={selectedColor === '#71fa61'}
                                onChange={() => setSelectedColor('#71fa61')}
                            />
                            <span>Green</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input
                                name="group1"
                                type="radio"
                                checked={selectedColor === '#f0f0f0'}
                                onChange={() => setSelectedColor('#f0f0f0')}
                            />
                            <span>Gray</span>
                        </label>
                    </p>
                </div>

                <button type="submit" className="btn waves-effect waves-light center-align">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default CreateCard
