import { User } from "../models/user.js"
import bcrypt from "bcrypt"


export const userRole = async (req,res) => {
    res.status(200).json({ role: req.user.role });
}

export const userProfile = async (req,res) => {
    res.status(200).json({'id': req.user._id})
}

export const getUser = async (req,res) => {
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
}

export const getUserById = async (req,res) => {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
}

export const getToken = async (req,res) => {
    res.status(200).json({ token: req.cookies.token })
}

export const updateUser = async (req, res) => {
    const { name, email, gender, date_of_birth, phone, country, currentPassword, newPassword } = req.body;
    
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If password update is requested
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Update other fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (gender) user.gender = gender;
        if (date_of_birth) user.date_of_birth = date_of_birth;
        if (phone) user.phone = phone;
        if (country) user.country = country;

        await user.save();

        // Return user data without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            phone: user.phone,
            country: user.country,
            role: user.role
        };

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

// Delete user account
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete user's tickets if they are a host
        if (user.role === 'host') {
            await Ticket.deleteMany({ host: user._id });
        }

        // Delete the user
        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

// Get all hosts
export const getHosts = async (req, res) => {
    try {
      const hosts = await User.find({ role: 'host' })
        .select('name email country')
        .sort({ name: 1 });
      
      res.json(hosts);
    } catch (error) {
      console.error('Error fetching hosts:', error);
      res.status(500).json({ message: 'Error fetching hosts' });
    }
  }; 