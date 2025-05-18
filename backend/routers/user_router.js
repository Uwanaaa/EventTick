import express from "express";
import { userProfile, getUser, updateUser, deleteUser, getHosts, userRole, getToken, getUserById } from "../controllers/userController.js";



export const userRouter = express.Router();     

userRouter.get("/profile", userProfile);
userRouter.get("/role", userRole);
userRouter.get("/user-data", getUser);
userRouter.put("/profile", updateUser);
userRouter.delete("/profile", deleteUser);
userRouter.get("/hosts", getHosts);
userRouter.get("/getToken", getToken);
userRouter.get("/user-data/:id", getUserById);


