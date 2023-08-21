import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller.js";import { isLoggedIn } from "../middlewares/auth.middleware.js" 

const courseRoutes = Router();

courseRoutes.route("/").get(getAllCourses);
courseRoutes.get("/:id").get(isLoggedIn,getLecturesByCourseId);

export default courseRoutes;