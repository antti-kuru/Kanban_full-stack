import {Request, Response, Router} from "express"
import {body, Result, ValidationError, validationResult} from "express-validator"
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken"
import {User, IUser} from "../models/User"
import { registerCheck, loginCheck } from "../validators/inputValidation"
import { userRequest, validateToken } from "../middleware/tokenValidation"
import {Column, IColumn} from "../models/Column"
import {Card, ICard} from "../models/Card"
import {Comment, IComment} from "../models/Comment"
import mongoose from "mongoose"

const router: Router = Router()

// Register
router.post("/api/register", registerCheck,  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)
     if(!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
     }
    
    try{
        const existingUser : IUser | null = await User.findOne({email: req.body.email})

        if (existingUser) {
            res.status(403).json({message: "Email already in use"})
        }
        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        const newUser: IUser = new User ({
            email: req.body.email,
            password: hash,
            username: req.body.username,
        })

        await User.create(newUser)
        console.log("User created succesfully")
        console.log(newUser)
        res.status(200).json(newUser)


    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

//Login
router.post("/api/login", loginCheck,  async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)
    if(!errors.isEmpty()) {
       console.log(errors)
       res.status(400).json({errors: errors.array()})
    }
    
    try {
        const existingUser : IUser | null = await User.findOne({email: req.body.email})

        if (!existingUser) {
            res.status(404).json({message: "Error logging in"})
        } else {
        if (bcrypt.compareSync(req.body.password, existingUser.password)) {
            const jwtPayload: JwtPayload = {
                _id: existingUser._id,
                username: existingUser.username,
            }

            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn:"900m"})

            res.status(200).json({success: true, token})
            console.log("Logged in")
        } else {
            res.status(401).json({message: "Password incorrect"})
        }

        }


    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Get columns
router.get("/api/columns", validateToken, async (req: userRequest, res:Response) => {
    try {
        const columns : IColumn[] | null = await Column.find({username: req.user?.username})
        res.status(200).json(columns)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }

})

// Post a column
router.post("/api/createColumn", validateToken, async (req: userRequest, res: Response) => {
    try {
        const column: IColumn = new Column ({
            header: req.body.header,
            username: req.user?.username,
            cards: req.body.defaultCards,
            createdAt: Date.now()
        })
        await Column.create(column)
        res.status(200).json({message: "Column created succesfully"})


    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Edit (rename) a column
router.put("/api/columns/:id", validateToken, async (req: userRequest, res: Response) => {
    try {
        const newHeader = req.body.header
        const column = await Column.findById(req.params.id)

        if (!column) {
            res.status(404).json({message: "Column not found"})
        } else {
            column.header = newHeader
            await column.save()
            res.status(200).json(column)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Delete a column
router.delete("/api/columns/:id", validateToken, async (req: userRequest, res: Response) => {
    try{
        await Column.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Column deleted succesfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Post a card
router.post("/api/createCard/:columnId", validateToken, async (req: userRequest, res: Response) => {
    try {
        const {columnId} = req.params

        const card: ICard = new Card ({
            header: req.body.header,
            content: req.body.content,
            color: req.body.color,
            columnId,
            username: req.user?.username,
            createdAt: Date.now(),
            estimatedTime: req.body.estimatedTime,
            timeSpend: req.body.timeSpend
        })

        // Create a new card to Cards collection
        const newCard = await Card.create(card)

        // Update the columns list of cards it has
        await Column.findByIdAndUpdate(columnId, {
            $push: {cards: newCard._id}
        })

        res.status(201).json(newCard)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Get cards
router.get("/api/cards/:columnId", validateToken, async (req: userRequest, res: Response) => {
    try {
        const {columnId} = req.params

        const column: IColumn | null  = await Column.findById(columnId)
        if (!column) {
            return
        }
        const cards: ICard[] = await Card.find({ _id: { $in: column.cards } });
        res.status(200).json(cards)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }


})

// Get card
router.get("/api/cards/:cardId", validateToken, async (req: userRequest, res: Response) => {
    try {
        const {cardId} = req.params
        const card = await Card.findById(cardId)
        res.status(200).json(card)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Delete card
router.delete("/api/cards/:id", validateToken, async (req: userRequest, res: Response) => {
    try {
        const {id} = req.params
        const card: ICard | null = await Card.findById(id)

        await Card.findByIdAndDelete(id)

        // This will delete the connected card id from the column it was part of
        await Column.findByIdAndUpdate(card?.columnId, {
            $pull: {cards: id}
        })

        res.status(200).json({message: "Card deleted succesfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Editing card parameter
router.put("/api/cards/:cardId", validateToken, async (req: userRequest, res:Response) => {
    const {cardId} = req.params
    // This can be whatever e.g. {"Header": "Newtitle"} or {"EstimatedTime": 4}
    const updateData = req.body

    //this updates the edited time
    updateData.createdAt = Date.now()
    try {
        await Card.findByIdAndUpdate(cardId, updateData, {new: true})
        res.status(200).json({message: "Card updated successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Reorder cards within column
router.put("/api/cards/reorder/:columnId", validateToken, async( req: userRequest, res: Response) => {
    try {
        const {columnId} = req.params
        const column: IColumn | null = await Column.findById(columnId)
        if (!column) {
            res.status(404).json({message: "Column not found"})
            return
        }
        column.cards = req.body.reorderedCards

        await column.save()

        res.status(200).json({message: "List of cards updated"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Moving card from one column to another
router.put("/api/cards/column/:columnId", validateToken, async (req: userRequest, res: Response) => {
    try{
        const {columnId} = req.params
        const cardId: string = req.body.cardId

        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            res.status(404).json({message: "Card not found"})
            return
        }
        // convert ObjectId to string
        const sourceColumnId: string = card.columnId.toString()

        // If the card is already in the target column, do nothing
        if (sourceColumnId === columnId) {
            res.status(200).json({ message: "Card is already in this column, nothing changed" })
        } else {
        // Adding card to new columns cards list
        await Column.findByIdAndUpdate(columnId, {
            $push: {cards: cardId}
        })

        // Removing card from original columns cards list
        await Column.findByIdAndUpdate(sourceColumnId, {
            $pull: {cards: cardId}
        })

        // Editing the moved card's reference columnId from original to new
        await Card.findByIdAndUpdate(cardId, {columnId: new mongoose.Types.ObjectId(columnId)})

        res.status(200).json({message: "Card moved to another column and deleted from original one", card: card})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Delete card from original column
router.delete("/api/cards/:columnId", validateToken, async (req: userRequest, res: Response) => {
    try{
        const {columnId} = req.params
        const cardId: string = req.body.cardId
        //console.log(cardId + "on tämä")

        await Column.findByIdAndUpdate(columnId, {
            $push: {cards: cardId}
        })
        res.status(200).json({message: "Card moved to another column"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})


// Create comment
router.post("/api/createComment/:cardId", validateToken, async (req: userRequest, res: Response) => {
    try {
        const {cardId} = req.params
        const comment: IComment = new Comment ({
            content: req.body.content,
            cardId,
            username: req.user?.username,
            createdAt: Date.now()
        })

        console.log(comment)

        await Comment.create(comment)
        // Update the cards list of comments it has
        await Card.findByIdAndUpdate(cardId, {
            $push: {comments: comment._id}
        })
        res.status(200).json({message: "Comment created succesfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Get comments
router.get("/api/comments/:cardId", validateToken, async(req: userRequest, res: Response) => {
    try{
        const {cardId} = req.params
        const card: ICard | null = await Card.findById(cardId)
        if (!card) {
            return
        }
        const comments: IComment[] = await Comment.find({_id: {$in: card.comments}})

        res.status(200).json(comments)

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Update comment
router.put("/api/comments/:commentId", validateToken, async (req: userRequest, res: Response) => {
    const {commentId} = req.params
    const updateData = req.body

    updateData.createdAt = Date.now()

    try {
        await Comment.findByIdAndUpdate(commentId, updateData, {new: true})
        res.status(200).json({message: "Comment updated successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal server error'})
    }
})


export default router