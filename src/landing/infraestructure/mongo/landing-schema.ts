import { Schema, model } from "mongoose";

const landingSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    initial_prompt: { type: String, required: true },
    template: { type: String, required: true },
    sections: { type: Object, required: true, default: {} },
    history: { type: Array, required: true, default: [] },
    total_tokens: { type: Number, required: true },

    user_id: { type: String, required: true },
})

export default model('Landing', landingSchema)