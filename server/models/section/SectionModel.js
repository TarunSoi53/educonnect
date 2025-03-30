import mongoose from "../config/index.js";


const SectionSchema = new mongoose.Schema({
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
    }

    });
    
    const Sections = mongoose.model("Sections", sectionSchema);
    
    export default Teacher;