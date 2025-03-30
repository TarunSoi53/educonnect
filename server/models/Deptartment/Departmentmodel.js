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
    }]
    // Add more fields as needed

    
    


});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;