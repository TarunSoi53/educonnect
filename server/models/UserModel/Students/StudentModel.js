import mongoose from "../config/index.js";


const StudentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    
    
    


});

const Student = mongoose.model("Student", StudentSchema);

export default Student;