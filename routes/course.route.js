import { Router } from "express";
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse } from "../controllers/course.controller.js"; import { isLoggedIn } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";
const courseRoutes = Router();

courseRoutes.route("/")
    .get(getAllCourses)
    .post(upload.single('thumbnail'), createCourse);

courseRoutes.route("/:id")
    .get(isLoggedIn, getLecturesByCourseId)
    .put(updateCourse)
    .delete(removeCourse);;

export default courseRoutes;