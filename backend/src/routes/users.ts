import express from "express";
import * as Usercontroller from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requiresAuth, Usercontroller.getAuthenticatedUser);

router.post("/signup", Usercontroller.signUp);

router.post("/login", Usercontroller.login);

router.post('/logout', Usercontroller.logout);


export default router;