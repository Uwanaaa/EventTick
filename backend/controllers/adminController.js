import asyncHandler from "express-async-handler";
import { User } from "../models/user.js";
import { isAdmin } from "../utils/utils.js";
import { generateToken } from "../utils/generateToken.js";


export const createSuperAdmin = asyncHandler(async (req, res) => {

    const { name, email, password, gender } = req.body;

    if (!email) {
        return res.status(400).json({ error: "missing required field" })
    }

    const userExists = await User.findOne({ email });


    if (userExists) {
        res.status(400);
        return res.status(400).json({ error: "Super Admin account already exists." });
    }

    const user = await User.create({
        name,
        email,
        password,
        gender,
        location: {
            type: "Point",
            coordinates: [0, 0]
        },
        role: "superAdmin"
    })

    if (user) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        return res.status(400).json({ errror: "Invalid user data" })
    }
})
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.status === "blocked") {
            return res.status(403).json({ error: "This user has been blocked" })
        }
        req.user = user
        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            gender: user.gender,
            date_of_birth: user.date_of_birth,
            address: user.address,
            location: user.location,
            peferences: user.peferences,
            status: user.status,
            role: user.role,
            bio: user.bio,
            profile_pic: user.profile_pic,
            subscription_id: user.subscription_id,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        res.json({ error: "Invalid email or password" });
    }
});


export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    console.log(admin);
    if (admin && (await admin.matchPassword(password))) {
        req.user = admin
        return res.json({
            _id: admin._id,
            email: admin.email,
            name: admin.name,
            gender: admin.gender,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } else {
        console.log(admin);
        res.status(401);
        res.json({ error: "Invalid email or password" });
    }
});



export const createAdmin = asyncHandler(async (req, res) => {

    const { name, email, password, gender } = req.body;

    if (req.user.role !== "superAdmin") {
        return res.status(403).json({ error: "You need a superAdmin right to create an admin account" })
    }

    if (!email) {
        return res.status(400).json({ error: "missing required field" })
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        return res.status(400).json({ error: "Admin account already exists." });
    }

    const admin = await User.create({
        name,
        email,
        password,
        gender,
        location: {
            type: "Point",
            coordinates: [0, 0]
        },
        role: "admin"
    })

    if (admin) {

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            gender: admin.gender,
            role: admin.role,
            status: admin.status,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400);
        return res.status(400).json({ errror: "Invalid user data" })
    }
});



export const getAllAdmin = asyncHandler(async (req, res) => {

    if (req.user.role !== "superAdmin") {
        return res.status(403).json({ error: "You do not have the right permission" })
    }

    const admins = await User.find({ role: "admin" }).select('-password')

    return res.status(200).json({ message: "successfuly retrieved all admins", admins })
})

export const deleteAdmin = asyncHandler(async (req, res) => {

    const id = req.params;

    if (req.user.role !== "superAdmin") {
        return res.status(403).json({ error: "you do not have the right permission" })
    }

    const deletedAdmin = User.findByIdAndDelete(id);

    if (!deletedAdmin) {
        return res.status(404).json({ error: "Admin not found" })
    }
    return res.status(200).json({
        _id: deletedAdmin._id,
        name: deletedAdmin.name,
        email: deletedAdmin.email,
        gender: deletedAdmin.gender,
        role: deletedAdmin.role,
        status: deletedAdmin.status,
    })
})

export const blockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!isAdmin(req.user)) {
        return res.status(401).json({ error: "You do not have the right permission" });
    }
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.status = "blocked";
        user.save();

        return res.status(200).json({ message: "successfully blocked the account", user });
    } catch (err) {
        console.log(`Error to blockUser: ${err}`);
        return res.status(500).json({ errro: "Internal server Error" })
    }
})

export const unblockUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!isAdmin(req.user)) {
        return res.status(401).json({ error: "You do not have the right permission" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    };
    user.status = "inactive";
    user.save()
    return res.status(200).json({ message: "Successfully unblock the account", user })
});


export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isAdmin(req.user)) {
        return res.status(401).json({ error: "You do not have the right permission" })
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id).select("-password");

        if (!deleteUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({ message: "User deleted successfully", deletedUser })
    } catch (err) {
        console.error("Delete User error: ", err);
        return res.status(500).json({ error: "Internal server error" })
    }
});