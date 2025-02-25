import { useState, useEffect, useRef } from 'react'
import Card, {ICard } from './Card'
import { useNavigate } from 'react-router-dom'
import { Reorder } from 'framer-motion'


// Interface for column
export interface IColumn {
    _id: string,
    header: string,
    cards: string[]
}




// Column and functions onRename and onDelete are passed as a prop
const Column = ({ column, onRename, onDelete }: { column: IColumn, onRename: (updatedColumn: IColumn) => void,
   onDelete: (() => void), }) => {

  // These is used for editing the header of the column
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedHeader, setEditedHeader] = useState<string>(column.header)

  const navigate = useNavigate() // This is for navigating between different pages

  // Column's cards are stored in state variable array of ICards
  const [cards, setCards] = useState<ICard[]>([])
  // This reference stores the latest cards when reordering is happening
  const latestCardsRef = useRef<ICard[]>([])

 // Used when reordering is done
  const [isChanging, setIsChanging] = useState<boolean>(false)

  // Function to fetch cards 
  const fetchCards = async () => {
      try {
        const res = await fetch(`/api/cards/${column._id}`, {
          method: "GET",
          headers: {"content-type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}`}
        })
        const data: ICard[] = await res.json()
  
        // We get the right order for the cards from column.cards
        const orderedCards = column.cards

        .map(cardId => data.find(card => card._id === cardId))
        .filter((card): card is ICard => card !== undefined); // Ensure correct type
  
        
        setCards(orderedCards) // set cards with the reorderedCards
        latestCardsRef.current = orderedCards; // Update ref for drag reorder

        } catch (error){
          console.log(error)
        }
    }
      
  // Function for handling saving edited column header
  const handleSave = async () => {
    if (editedHeader.trim() !== column.header) {
      console.log("Saving new header:", editedHeader)

      const newHeader = {
        header: editedHeader
      }
      const res = await fetch(`/api/columns/${column._id}`, {
        method: "PUT",
        headers: {"content-type": "application/json", "authorization" : `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify(newHeader)
      })

      const data = await res.json()
      console.log(data)
      if (res.status === 200) {
        // Update the column in the parent component (Kanban) state
        onRename({ ...column, header: editedHeader })
      }


    }
    setIsEditing(false) // Exit edit mode
  }

  // Function to handle deleting column
  const handleDelete = async () => {
      const res = await fetch(`/api/columns/${column._id}`, {
        method: "DELETE",
        headers: {"content-type": "application/json", "authorization" : `Bearer ${localStorage.getItem("token")}`}
      })
      const data = await res.json()

      if (res.status === 200){
        // call the prop function on parent component
        onDelete()
      }
      console.log(data)
  }


  useEffect(() => {
    fetchCards() // Fetch cards when column._id changes
  }, [column._id])

  // Function to handle reorder of cards within the column
  const handleReorder = (reorderedCards: ICard[]) => {
    setCards(reorderedCards) // Update the card order in the state
    latestCardsRef.current = reorderedCards
    setIsChanging(true)
  }

  // Function to save the reorder on backend
  const handleSaveEdit = async () => {
    // Put request to change the order of the cards list in the column
    const res = await fetch(`/api/cards/reorder/${column._id}`, {
      method: "PUT",
      headers: {"content-type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}`},
      body: JSON.stringify({reorderedCards: latestCardsRef.current})
    })

    const data = await res.json()
    console.log(data)
    setCards([...latestCardsRef.current])
    setIsChanging(false)
  }

  // Function to handle dropping card on another column
  const handleOnDrop = async (e: React.DragEvent) => {
    // Get stored data from React event
    const cardId : string = e.dataTransfer.getData("CardId") 
    const sourceColumnId: string = e.dataTransfer.getData("OriginalColumnId") 
    const cardString: string = e.dataTransfer.getData("Card")

    const card: ICard = JSON.parse(cardString)
    //console.log(card)

    //console.log(cards)
  

  if (sourceColumnId === column._id) {
    console.log("Target and source column are the same, do nothing")
    return
  }

  // Remove the card from the source column's list of cards
  if (sourceColumnId !== column._id) {
    // Remove the card from the source column in the frontend
    const sourceColumnElement = document.querySelector(`[data-column-id="${sourceColumnId}"]`);
    if (sourceColumnElement) {
      const cardElement = sourceColumnElement.querySelector(`[data-card-id="${cardId}"]`);
      if (cardElement) {
        const reorderItem = cardElement.closest(".reorder-item"); // Find the Reorder.Item wrapper
        console.log("tässäkö")
        console.log(reorderItem)
        if (reorderItem) {
          reorderItem.remove(); // Remove the entire Reorder.Item element
          console.log("Card removed from UI completely");
        }
      }
    }
  }
    // Update the target column's cards by adding the moved card
    setCards((prevCards) => [...prevCards, card])

    try {
      // PUT call to change the moved card's reference to correct column
      const addRes = await fetch(`/api/cards//column/${column._id}`, {
        method: "PUT",
        headers: {"content-type": "application/json", "authorization": `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({cardId})
      })
      const data = await addRes.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle start of drag event
  const handleDragStart = (e: React.DragEvent, column: IColumn) => {
    e.dataTransfer.setData("ColumnCards", JSON.stringify(column.cards))
    e.dataTransfer.setData("OriginalColumnId", column._id)
  }
  // Function to handle dragging card on top of another column
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Function to update the cards when in child component Card some parameter is changed
  const handleUpdateCard = (updatedCard: ICard) => {
    setCards((prevCards) => 
      prevCards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
    )
  }


  return (
    <div className="col s12 m12 l3"
    style={{
      backgroundColor: "#d4d4d4",
      marginTop: "16px",
      borderRadius: "8px"
    }}
      data-column-id={column._id} 
      onDragStart={(e) => handleDragStart(e, column)}
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
    
    >
      <div className="card">
        <div className="card-content">
          {isEditing ? (
            <div>
              <div className='input-field'>
                <input 
                  id='editedHeader'
                  type='text'
                  value={editedHeader}
                  onChange={(e) => setEditedHeader(e.target.value)}
                  required 
                />
                <label htmlFor='editedHeader'>Header</label>
              </div>
              <button 
                className="btn waves-effect waves-light"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          ) : (
            <span 
              className='card-title center-align'
              style={{fontWeight: "bold"}} 
              onClick={() => setIsEditing(true)} // Click on the title to enter edit mode
            >
              {column.header}
            </span>

          )}

          <div className='divider' style={{ margin: '12px 0' }}></div>
                    
          <Reorder.Group  axis="y" values={cards} onReorder={handleReorder}>
            {cards.map((card) => (
                <Card key={card._id} card={card} onDelete={fetchCards} onUpdateCard={handleUpdateCard} />
            ))}

            {isChanging && (
                <button className="btn "onClick={handleSaveEdit}> Save edits</button>
            )}
          </Reorder.Group>
          <div className='row center'>
          <a className='btn waves-effect waves-light' style={{marginBottom: "10px", backgroundColor:"#0e8f00"}} onClick={() => navigate("/createCard",  {state: {column}})}> Add card</a>
          <a className='btn waves-effect waves-light' style={{backgroundColor: "#d90000"}} onClick={handleDelete}>Delete column</a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Column
