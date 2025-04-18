import mongoose from "../../../config/index.js";
import Student from "../Students/StudentModel.js";


const TeacherSchema = new mongoose.Schema({
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
    isHeadofDepartment: {
        type: Boolean,
        default: false
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],
    role:[{
        type: String,
        enum: ['teacher', 'collegeAdmin', 'student'],

       
    }]
    // Add more fields as needed

    
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;