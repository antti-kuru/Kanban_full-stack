import mongoose, {Document, Schema} from "mongoose"

interface ICard extends Document{
    header: string,
    content: string,
    color: string,
    columnId: mongoose.Types.ObjectId, //Link to parent column
    username: string,
    createdAt: Date,
    comments: mongoose.Types.ObjectId[], // Link to child comments
    estimatedTime: number,
    timeSpend : number
}


const cardSchema = new Schema({
    header: {type: String, required: true},
    content: {type: String},
    color: {type: String},
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    username: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    estimatedTime: [{type: Number, required: true}],
    timeSpend: [{type: Number}]
})

const Card: mongoose.Model<ICard> = mongoose.model<ICard>("Card", cardSchema)


export {Card, ICard}
