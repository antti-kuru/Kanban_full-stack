import mongoose, {Document, Schema} from "mongoose"

interface IUser extends Document {
    email: string,
    username: string,
    password: string,

}

const userSchema: Schema = new Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

export {User, IUser}