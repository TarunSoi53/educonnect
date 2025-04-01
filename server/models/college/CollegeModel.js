import mongoose from "../../config/index.js";
import Department from "../Department/Departmentmodel.js";
const collegeSchema = new mongoose.Schema({
    name: {
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
        
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    // },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    contactNumber: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    Departments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    }]
    
});
const College = mongoose.model("College", collegeSchema);
export default College;
