import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be atleast 5 character'],
        maxLength: [50, 'Name should be less than 50 characters'],
        lowercase: true,
        trim: true
    },
    email: {
        type: 'String',
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: 'String',
        required: [true, "password is required"],
        minLength: [8, 'Password must be atleast 8 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
}, {
    timestamps: true
});

const User = model('User', userSchema);

export default User;