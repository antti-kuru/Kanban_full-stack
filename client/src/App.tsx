import { BrowserRouter, Route, Routes } from "react-router-dom"
import "materialize-css/dist/css/materialize.min.css"
import "materialize-css/dist/js/materialize.min.js"
import Home from "./components/Home"
import Header from "./components/Header"
import Register from "./components/Register"
import Login from "./components/Login"
import Kanban from "./components/Kanban"
import CreateColumn from "./components/CreateColumn"
import CreateCard from "./components/CreateCard"
import CreateComment from "./components/CreateComment"



function App() {
  return (
    <>

      <BrowserRouter>
      <Header></Header>
  

        <Routes>
        
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/kanban" element={<Kanban />}></Route>
          <Route path="/createColumn" element={<CreateColumn />}></Route>
          <Route path="/createCard" element={<CreateCard />}></Route>
          <Route path="/createComment" element={<CreateComment />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
