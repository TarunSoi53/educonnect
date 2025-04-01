import College from '../models/college/CollegeModel.js';
import CollegeAdmin from '../models/UserModel/collegeAdmin/collegeAdminModel.js';

// Create new college
export const createCollege = async (req, res) => {
    try {
        const { name, address, email, logo, description, website, contactNumber } = req.body;
        const adminId = req.user._id;

        // Check if college with same email already exists
        const existingCollege = await College.findOne({ email });
        if (existingCollege) {
            return res.status(400).json({ message: 'College with this email already exists' });
        }

        // Create new college
        const college = await College.create({
            name,
            address,
            email,
            logo,
            description,
            website,
            contactNumber
        });

        // Update admin with college reference
        const admin = await CollegeAdmin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        admin.collegeId = college._id;
        await admin.save();

        res.status(201).json({
            message: 'College created successfully',
            college
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all colleges
export const getColleges = async (req, res) => {
    try {
        const colleges = await College.find()
            .select('name  address ');
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get college by ID
export const getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.json(college);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update college
export const updateCollege = async (req, res) => {
    try {
        const { name, address, email, logo, description, website, contactNumber, contactEmail } = req.body;
        const collegeId = req.params.id;

        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== college.email) {
            const existingCollege = await College.findOne({ email });
            if (existingCollege) {
                return res.status(400).json({ message: 'Email is already in use by another college' });
            }
        }

        // Update fields
        college.name = name || college.name;
        college.address = address || college.address;
        college.email = email || college.email;
        college.logo = logo || college.logo;
        college.description = description || college.description;
        college.website = website || college.website;
        college.contactNumber = contactNumber || college.contactNumber;
        college.contactEmail = contactEmail || college.contactEmail;
        college.updatedAt = Date.now();

        await college.save();
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete college
export const deleteCollege = async (req, res) => {
    try {
        const collegeId = req.params.id;

        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        // Remove college reference from admin
        await CollegeAdmin.updateMany(
            { college: collegeId },
            { $unset: { college: 1 } }
        );

        // Delete the college
        await college.deleteOne();
        res.json({ message: 'College deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 