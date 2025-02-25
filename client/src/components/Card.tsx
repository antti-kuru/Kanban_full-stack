import { useState, useEffect } from 'react'
import { Reorder, useMotionValue } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Comment, { IComment } from './Comment'

export interface ICard {
  _id: string
  header: string
  content: string
  color: string
  columnId: string // Link to parent column
  createdAt: Date
  username: string
  comments: string[]
  estimatedTime: number
  timeSpend: number
}

// Card and functions onDelete and on UpdateCard passed as props
const Card = ({ card, onDelete, onUpdateCard}: { card: ICard, onDelete: () => void, onUpdateCard: (updatedCard: ICard) => void }) => {
  
  const navigate = useNavigate() // used to move to different page

  // Used to store comments
  const [comments, setComments] = useState<IComment[]>([])

  // State for editing fields
  const [editingField, setEditingField] = useState<string | null>(null)
  const [updatedValue, setUpdatedValue] = useState<string | number>('')

  const y = useMotionValue(0) // Smooth drag effect when dragging

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${card._id}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data: IComment[] = await res.json()

      if (data){
        setComments(data)
      } 
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle deletion on a card
  const handleDelete = async () => {
    const res = await fetch(`/api/cards/${card._id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await res.json()
    if (res.status === 200){
      onDelete()
      console.log(data)
    }
  }

  // Function to set card's info to datatransfer when drag event starts
  const handleOnDrag = (e: React.DragEvent, card: ICard) => {
    e.dataTransfer.setData('CardId', card._id)
    e.dataTransfer.setData('Card', JSON.stringify(card))
  }

  useEffect(() => {
    fetchComments() // Fetch comments when cardId changes
  }, [card._id]) 

  // Handle field click to start editing
  const handleFieldClick = (field: keyof ICard) => {
    setEditingField(field)
    const value = card[field]

    // Ensure only string or number is set
    if (typeof value === "string" || typeof value === "number") {
      setUpdatedValue(value)
    } else {
      setUpdatedValue("") // Provide a default fallback for unsupported types
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedValue(e.target.value)
  }

  // Handle Save Edit
  const handleSave = async () => {
    if (!editingField) return

    // This has the updated filed of the card element (Header/content/estimated time/time spend) as well as edited time
    const updateData = { [editingField]: updatedValue, createdAt: new Date }

    try {
      // PUT call to update the card 
      const res = await fetch(`/api/cards/${card._id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      })

      if (res.status === 200) {
        console.log('Card updated successfully!')
        setEditingField(null) // Close edit mode
          // Notify parent to update card
        const updatedCard: ICard = { ...card, [editingField]: updatedValue, createdAt: new Date }
        onUpdateCard(updatedCard)  // Pass updated card to parent


      }
    } catch (error) {
      console.log(error)
    }
  }

  // Parent function for when child component Comment's are modified
  const handleUpdateComment =  (updatedComment : IComment) => {
    setComments((prevComments) => 
      prevComments.map((comment) => (comment._id === updatedComment._id ? updatedComment : comment))
    )

  }

  return (
    <Reorder.Item value={card} style={{ y }} className="reorder-item"> Drag here to change order
      <div
        className="card"
        data-card-id={card._id}
        style={{ backgroundColor: card.color, borderRadius: '8px', marginBottom: '10px' }}
        draggable
        onDragStart={(e) => handleOnDrag(e, card)}
      >
        <div className="card-content">
          {/* Editable Header */}
          {editingField === 'header' ? (
            <>
            <input type="text" value={updatedValue} onChange={handleInputChange}/>
            <button 
                className="btn waves-effect waves-light"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <h5 className="card-title center-align" style={{marginBottom: "10px" , marginTop: "0px"}} 
            onClick={() => handleFieldClick('header')}>
              {card.header}
            </h5>
          )}
          <div className='divider' style={{ margin: '12px 0' }}></div>

          {/* Editable Content */}
          {editingField === 'content' ? (
             <>
             <input type="text" value={updatedValue} onChange={handleInputChange}/>
             <button 
                 className="btn waves-effect waves-light"
                 onClick={handleSave}
               >
                 Save
               </button>
             </>
          ) : (
            <p style={{fontSize: "16px", marginBottom: "10px"}} onClick={() => handleFieldClick('content')}>{card.content}</p>
          )}


     

          {/* Editable Estimated Time */}
          {editingField === 'estimatedTime' ? (
            <>
            <input type="number" min={0} value={updatedValue} onChange={handleInputChange}/>
            <button 
                className="btn waves-effect waves-light"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <p style={{fontSize: "12px"}} onClick={() => handleFieldClick('estimatedTime')}>Estimated time: {card.estimatedTime}h</p>
          )}

          {/* Editable Time Spent */}
          {editingField === 'timeSpend' ? (
            <>
            <input type="number" min={0} max={card.estimatedTime} value={updatedValue} onChange={handleInputChange}/>
            <button 
                className="btn waves-effect waves-light"
                onClick={handleSave}
              >
                Save
              </button>
            </>
          ) : (
            <p style={{fontSize: "12px", marginBottom: "10px"}} onClick={() => handleFieldClick('timeSpend')}>Time spent: {card.timeSpend}h</p>
          )}

          <p  style={{ fontSize: '12px' }}>
            {new Date(card.createdAt).toLocaleString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </p>

          <div className='row center'>
            <a className="btn waves-effect waves-light" style={{marginBottom: "10px", marginTop: "10px", backgroundColor:"#0e8f00"}} onClick={() => navigate('/createComment', { state: { card } })}>
              Add Comment
            </a>
            <a className="btn waves-effect waves-light" style={{backgroundColor: "#d90000"}} onClick={handleDelete}>
              Delete Card
            </a>
          </div>
         

          {comments.length > 0 && (
            <>
              <div className="divider" style={{ margin: '12px 0' }}></div>
              <p style={{ fontWeight: 'bold' }}>Comments:</p>
              {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} onUpdateComment={handleUpdateComment} />
              ))}
            </>
          )}
        </div>
      </div>
    </Reorder.Item>
  )
}

export default Card
