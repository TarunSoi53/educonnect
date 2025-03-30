import mongoose from "../config/index.js";


const DepartmentSchema = new mongoose.Schema({
    DepartmentName: {
        type: String,
        required: true,
       
    },
departmentHead:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
},
    collegeId: {
        type: String,
        required: true
    },


    departmentId:{
        type: String,
        required: true,
        unique: true
    },
    departmentDescription: {
        type: String,
        required: true
    },

  
    // Add more fields as needed
    
    collegeId: {
        type: String,
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
    Sections:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sections"
    }],
    teachers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }],
 students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],


});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;