import mongoose, {Document, Schema} from "mongoose"


interface IColumn extends Document {
    header: string,
    username: string,
    cards: mongoose.Types.ObjectId[] // Reference to child Cards
    createdAt: Date
}

const topicSchema = new Schema({
    header: {type: String, required: true},
    username: {type: String, required: true},
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }], // Reference to Card model
    createdAt: {type: Date, default: Date.now}
})

const Column: mongoose.Model<IColumn> = mongoose.model<IColumn>("Column", topicSchema)


export {Column, IColumn}