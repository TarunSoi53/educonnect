import mongoose from "../../../config/index.js";

const CollegeAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
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
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const CollegeAdmin = mongoose.model("CollegeAdmin", CollegeAdminSchema);

export default CollegeAdmin;
