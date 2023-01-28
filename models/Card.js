import mongoose, { Schema } from "mongoose";

//схема для создания новой карточки
const Cardschema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String},
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column'}
    },
    { timestamps: true }
)

export default mongoose.model('Card', Cardschema)