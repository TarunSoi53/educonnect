import mongoose from "../../config/index.js";

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      
        trim: true
    },
departmentHead:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
},
   
    description: {
        type: String,
        trim: true
    },
    collegeId: {
           type: mongoose.Schema.Types.ObjectId,
               ref: "College"
          
       },
    phoneNumber: {
        type: String,
      
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