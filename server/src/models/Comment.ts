import mongoose, {Document, Schema} from "mongoose"

interface IComment extends Document{
    content: string,
    cardId: mongoose.Types.ObjectId, // Reference to parent card
    username: string,
    createdAt: Date
}


const commentSchema = new Schema({
    content: {type: String},
    cardId: { type: Schema.Types.ObjectId, ref: "Card", required: true },
    username: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const Comment: mongoose.Model<IComment> = mongoose.model<IComment>("Comment", commentSchema)


export {Comment, IComment}
