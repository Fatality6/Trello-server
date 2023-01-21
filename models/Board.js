import mongoose, { Schema } from "mongoose";

//схема для создания новой доски
const Boardschema = new mongoose.Schema(
    {
        username: { type: String },
        title: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column'}]
    },
    { timestamps: true }
)

export default mongoose.model('Board', Boardschema)