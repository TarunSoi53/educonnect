import Section from '../models/Department/SectionModel.js';
import Department from '../models/Department/Departmentmodel.js';

// Add new section to department
export const addSection = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { name} = req.body;
        console.log(departmentId,name)

        // Check if department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Check if section with same name exists in department
        const existingSection = await Section.findOne({
            name,
            departmentId
        });
        if (existingSection) {
            return res.status(400).json({ message: 'Section with this name already exists in department' });
        }

        // Create new section
        console.log("helo")
        const section = await Section.create({
            name,
            departmentId,
            collegeId: department.collegeId,
           
           
        });
        // consoleexpect(section)

        // Add section to department's sections array
        department.Sections.push(section._id);
        await department.save();

        res.status(201).json({
            message: 'Section added successfully',
            section
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all sections of a department
export const getSections = async (req, res) => {
    try {
        const { departmentId } = req.params;

        // Check if department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Get all sections of the department
        const sections = await Section.find({ departmentId });

        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update section
export const updateSection = async (req, res) => {
    try {
        const { departmentId, sectionId } = req.params;
        const { name, capacity, currentStrength } = req.body;

        // Check if section exists
        const section = await Section.findOne({
            _id: sectionId,
            departmentId
        });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Check if new name conflicts with existing section
        if (name && name !== section.name) {
            const existingSection = await Section.findOne({
                name,
                departmentId,
                _id: { $ne: sectionId }
            });
            if (existingSection) {
                return res.status(400).json({ message: 'Section with this name already exists in department' });
            }
        }

        // Update section
        section.name = name || section.name;
        section.capacity = capacity || section.capacity;
        section.currentStrength = currentStrength || section.currentStrength;
        section.updatedAt = Date.now();

        await section.save();
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete section
export const deleteSection = async (req, res) => {
    try {
        const { departmentId, sectionId } = req.params;

        // Check if section exists
        const section = await Section.findOne({
            _id: sectionId,
            departmentId
        });
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Remove section from department's sections array
        const department = await Department.findById(departmentId);
        department.sections = department.sections.filter(
            id => id.toString() !== sectionId
        );
        await department.save();

        // Delete section
        await section.deleteOne();
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 