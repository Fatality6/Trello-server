import mongoose, { Schema } from "mongoose";

//схема для создания новой колонки
const Columnschema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        // parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
        cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card'}]
    },
    { timestamps: true }
)

export default mongoose.model('Column', Columnschema)