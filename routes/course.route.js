import { Router } from "express";
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse } from "../controllers/course.controller.js";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";
const courseRoutes = Router();

courseRoutes.route("/")
    .get(getAllCourses)
    .post(isLoggedIn,authorizedRoles("ADMIN"),upload.single('thumbnail'), createCourse);

courseRoutes.route("/:id")
    .get(isLoggedIn, getLecturesByCourseId)
    .put(isLoggedIn, updateCourse
    )
    .delete(isLoggedIn, removeCourse);;

export default courseRoutes;