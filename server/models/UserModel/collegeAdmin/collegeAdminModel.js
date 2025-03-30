import mongoose from "../config/index.js";


const CollegeAdminSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    address: { type: String, required: true },
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
    collegeId: {
        type: String,
        required: true,
        unique: true,
       
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    date: {
        type: Date,
        default: Date.now
    },
    departmentList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department"
     }]



    
    


});

const CollegeAdmin = mongoose.model("CollegeAdmin", CollegeAdminSchema);

export default CollegeAdminSchema;