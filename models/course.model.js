import { Schema, model } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true,"Title is required."],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [60, 'Title should be less than 60 characters.'],
        trim:true
    },
    description: {
        type: String,
        required: [true,"Description is required."],
        minLength: [8, 'Description must be atleast 8 characters'],
        maxLength: [200, 'Description should be less than 200 characters.'],
        trim:true
    },
    category: {
        type: String,
        required:[true, "Category is required"]
    },
    thumbnail: {
        public_id: {
            type: String,
            required:true
        },
        secure_url: {
            type: String,
            required:true
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            // lectureThumbnail: {
            lecture: {
                public_id: {
                    type: String
                },
                secure_url: {
                    type: String
                }
            }
        }
    ],
    numbersOfLectures: {
        type: Number,
        default:0
    },
    createdBy: {
        type: String
    }
}, {
    timestamps: true
});

const Course = model('Course',courseSchema);

export default Course;