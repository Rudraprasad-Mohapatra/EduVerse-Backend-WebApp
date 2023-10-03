import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [5, "Name must be atleast 5 characters"],
        maxLength: [50, 'Name should be less than 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        minLength: [8, 'Message must be atleast 8 characters'],
    },
}, {
    timestamps: true
});

const Contact = model('Contact', contactSchema);

export default Contact;