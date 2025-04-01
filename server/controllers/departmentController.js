import Department from '../models/Department/Departmentmodel.js';
import Section from '../models/Department/SectionModel.js';
import Teacher from '../models/UserModel/Teachers/teacherModel.js';
import College from '../models/college/CollegeModel.js';



// Add new department
export const addDepartment = async (req, res) => {
    try {
        const { name,  description } = req.body;
        console.log(req.user);
        const collegeId = req.user.collegeId;
        console.log(collegeId);

        // Check if department already exists
        const existingDepartment = await Department.findOne({ 
            $or: [{ name }],
            collegeId 
        });

        if (existingDepartment) {
            return res.status(400).json({ 
                message: 'Department with this name or ID already exists' 
            });
        }

        const department = await Department.create({
            name,
           description,
           
            collegeId
        });
       

        // Add department to college admin's department list
     
       //find the college id and add it to the department list//update
       
     const college = await College.findById(collegeId);

        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        college.Departments.push(department._id);
        await college.save();
     
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all departments for a college
export const getDepartmentsList = async (req, res) => {
    try {
        // const departments = await Department.find({ collegeId: req.user.collegeId })
        //     .populate('departmentHead', 'name email')
        //     .populate('teachers', 'name email')
        //     .populate('students', 'name email')
        //     .populate('subjects', 'name code')
        //     .populate('Sections', 'name ');
        const departments = await Department.find({ collegeId: req.user.collegeId },{ name: 1, email: 1 })
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getDepartmentsListByCollegeId = async (req, res) => {
    try {
        // const departments = await Department.find({ collegeId: req.user.collegeId })
        //     .populate('departmentHead', 'name email')
        //     .populate('teachers', 'name email')
        //     .populate('students', 'name email')
        //     .populate('subjects', 'name code')
        //     .populate('Sections', 'name ');
        console.log(req.params.collegeId)
        const departments = await Department.find({ collegeId: req.params.collegeId },{ name: 1, email: 1 })
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getDepartments = async (req, res) => {
    try {
        // const departments = await Department.find({ collegeId: req.user.collegeId })
        //     .populate('departmentHead', 'name email')
        //     .populate('teachers', 'name email')
        //     .populate('students', 'name email')
        //     .populate('subjects', 'name code')
        //     .populate('Sections', 'name ');
        const departments = await Department.find({ collegeId: req.user.collegeId })
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const { name, departmentId, description, phoneNumber } = req.body;
        // const departmentId = req.params.id;

        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId: req.user.collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Check if new name or ID already exists
        if (name !== department.name || departmentId !== department.departmentId) {
            const existingDepartment = await Department.findOne({
                $or: [{ name }, { departmentId }],
                collegeId: req.user.collegeId,
                _id: { $ne: departmentId }
            });

            if (existingDepartment) {
                return res.status(400).json({ 
                    message: 'Department with this name or ID already exists' 
                });
            }
        }

        department.name = name;
        department.departmentId = departmentId;
        department.description = description;
        department.phoneNumber = phoneNumber;

        await department.save();
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;

        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId: req.user.collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Remove department from college admin's list
        req.user.departmentList = req.user.departmentList.filter(
            id => id.toString() !== departmentId
        );
        await req.user.save();

        // Delete all sections in the department
        await Section.deleteMany({ departmentId });

        // Remove department reference from teachers
        await Teacher.updateMany(
            { department: departmentId },
            { $unset: { department: 1 } }
        );

        // Delete the department
        await department.deleteOne();
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign department head
export const assignDepartmentHead = async (req, res) => {
    try {
        const { departmentId, teacherId } = req.body;

        // Verify department exists and belongs to the college
        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId: req.user.collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Verify teacher exists and belongs to the department
        const teacher = await Teacher.findOne({ 
            _id: teacherId,
            department: departmentId,
            collegeId: req.user.collegeId
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found in this department' });
        }

        // Update department head
        department.departmentHead = teacherId;
        await department.save();

        // Update teacher's isHeadOfDepartment status
        teacher.isHeadofDepartment = true;
        await teacher.save();

        res.json({ message: 'Department head assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add teacher to department
export const addTeacherToDepartment = async (req, res) => {
    try {
        const { departmentId, teacherId } = req.body;

        // Verify department exists and belongs to the college
        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId: req.user.collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Verify teacher exists and belongs to the college
        const teacher = await Teacher.findOne({ 
            _id: teacherId,
            collegeId: req.user.collegeId
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Add teacher to department if not already added
        if (!department.teachers.includes(teacherId)) {
            department.teachers.push(teacherId);
            await department.save();
        }

        // Update teacher's department
        teacher.department = departmentId;
        await teacher.save();

        res.json({ message: 'Teacher added to department successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove teacher from department
export const removeTeacherFromDepartment = async (req, res) => {
    try {
        const { departmentId, teacherId } = req.body;

        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId: req.user.collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Remove teacher from department
        department.teachers = department.teachers.filter(
            id => id.toString() !== teacherId
        );

        // If teacher was department head, remove that
        if (department.departmentHead?.toString() === teacherId) {
            department.departmentHead = null;
        }

        await department.save();

        // Update teacher's department
        const teacher = await Teacher.findById(teacherId);
        if (teacher) {
            teacher.department = null;
            teacher.isHeadofDepartment = false;
            await teacher.save();
        }

        res.json({ message: 'Teacher removed from department successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new section to department
export const addSection = async (req, res) => {
    try {
        const { name, departmentId, capacity } = req.body;
        const collegeId = req.user.collegeId;

        // Verify department exists and belongs to the college
        const department = await Department.findOne({ 
            _id: departmentId,
            collegeId 
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const section = await Section.create({
            name,
            departmentId,
            collegeId,
            capacity
        });

        // Add section to department's sections list
        department.Sections.push(section._id);
        await department.save();

        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all sections for a department
export const getSections = async (req, res) => {
    try {
        const { departmentId } = req.params;
        
        const sections = await Section.find({ 
            departmentId,
            collegeId: req.user.collegeId 
        });
        
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update section
export const updateSection = async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const sectionId = req.params.id;

        const section = await Section.findOne({ 
            _id: sectionId,
            collegeId: req.user.collegeId 
        });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        section.name = name;
        section.capacity = capacity;

        await section.save();
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete section
export const deleteSection = async (req, res) => {
    try {
        const sectionId = req.params.id;

        const section = await Section.findOne({ 
            _id: sectionId,
            collegeId: req.user.collegeId 
        });

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Remove section from department's sections list
        const department = await Department.findById(section.departmentId);
        if (department) {
            department.Sections = department.Sections.filter(
                id => id.toString() !== sectionId
            );
            await department.save();
        }

        // Delete the section
        await section.deleteOne();
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 