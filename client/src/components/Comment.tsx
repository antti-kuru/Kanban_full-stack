import {useState} from 'react'

// Interface for commwnr
export interface IComment {
    _id: string,
    content: string,
    createdAt: Date,
    cardId: string // Link to parent card component
}



const Comment = ({comment, onUpdateComment} : {comment: IComment, onUpdateComment: (updatedComment: IComment) => void}) => {
// This is used for editing the content of the comment
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editedContent, setEditedContent] = useState<string>(comment.content)

    // Function to handle saving a comment
    const handleSave = async () => {
        const updateData = {
            content: editedContent,
            createdAt: new Date
        }
        try {
            const res = await fetch(`/api/comments/${comment._id}`, {
                method: "PUT",
                headers: {"content-type": "application/json", "authorization" : `Bearer ${localStorage.getItem("token")}`},
                body: JSON.stringify(updateData)
            })
            if (res.status === 200) {
                console.log('Card updated successfully!')
                 setIsEditing(false) // Close edit mode
                 // Notify parent to update card
                const updatedComment: IComment = { ...comment, content: editedContent, createdAt: new Date }
                onUpdateComment(updatedComment)  // Pass updated card to parent

        }

        } catch (error) {
            console.log(error)
        }
    }
       



  return (
    <div className='card'
        style={{backgroundColor: "#ccc"}}
    >
    {isEditing ? (
                <div>
                <div className='input-field'>
                    <input 
                    id='editedHeader'
                    type='text'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    required 
                    />
                    <label htmlFor='editedHeader'>Content</label>
                </div>
                <button 
                    className="btn waves-effect waves-light"
                    onClick={handleSave}
                >
                    Save
                </button>
                </div>
            ) : (
                <p
                className='card-title center-align'
                style={{marginBottom: "16px", fontSize: "16px"}}
                onClick={() => setIsEditing(true)} // Click on the title to enter edit mode
                >{comment.content}</p>
        

          )}
        <p style={{fontSize: "12px"}}>
            {new Date(comment.createdAt).toLocaleString('en-US', {
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: false 
            })}
          </p>
    </div>
  )
}

export default Comment