import mongoose from "../../../config/index.js";


const StudentSchema = new mongoose.Schema({
   
    collegeId: {
            type: mongoose.Schema.Types.ObjectId,
                ref: "College"
           
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
    rollNumber: {
        type: String,
       
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sections",
        required: true
    },
   
    dateOfBirth: {
        type: Date,
        
    },
    gender: {
        type: String,
     
        enum: ["Male", "Female", "Other"]
    },
    phoneNumber: {
        type: String,
      
        minlength: 5,
        maxlength: 50
    },
    profilePic: {
        type: String,
        default: "default.jpg"
    },


    

    
    
    


});

const Student = mongoose.model("Student", StudentSchema);

export default Student;