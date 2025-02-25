import {useState, useEffect} from 'react'
import Column, {IColumn} from './Column'
import { useNavigate} from 'react-router-dom'

/*
interface IKanban {
    columns: IColumn[]
}
*/



const Kanban = () => {


    const [columns, setColumns] = useState<IColumn[]>([])

    const fetchColumns = async () => {
      try{
        const res = await fetch("/api/columns", {
          method: "GET",
          headers: {"content-type": "application/json", "authorization" : `Bearer ${localStorage.getItem("token")}`},
        })
  
        const data = await res.json()
        console.log(data)
  
        setColumns(data)
  
      } catch (error) {
        console.log(error)
      }
  }


 

  

  // Update columns after renaming

  const handleColumnRename = (updatedColumn: IColumn) => {
    // This function is used to update the column in the state after renaming.
    
    // Create a new array where the column with the same _id as updatedColumn gets replaced with the updatedColumn.
    const newColumns = columns.map((column) => {
      // Check if the current column's _id matches the updatedColumn's _id
      if (column._id === updatedColumn._id) {
        // If it matches, return the updatedColumn to replace the current one
        return updatedColumn
      } else {
        // Otherwise, return the original column (no change)
        return column
      }
    })
  
    // Now, update the state with the newColumns array
    setColumns(newColumns)
  }


    // Fetch columns when opening the page
    useEffect(() => {
        fetchColumns()

    }, [])

    const navigate = useNavigate() // used to navigate to different pages

  return (
    <div className='container'>
    <div className="row">
      {columns.map((column) => (
        <Column key={column._id} column={column} onRename={handleColumnRename} onDelete={fetchColumns}/>
      ))}

    </div>

    <a className='btn waves-effect waves-light' onClick={() => navigate("/createColumn")}> Add column</a>
    </div>
          
  )
}

export default Kanban