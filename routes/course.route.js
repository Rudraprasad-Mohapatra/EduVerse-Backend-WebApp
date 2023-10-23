import { Router } from "express";
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, deleteLecture } from "../controllers/course.controller.js";
import { isLoggedIn, authorizedRoles, authorizeSubscriber } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";
const courseRoutes = Router();

courseRoutes.route("/")
    .get(getAllCourses)
    .post(isLoggedIn, authorizedRoles("ADMIN"), upload.single('thumbnail'), createCourse);

courseRoutes.route("/:id")
    .get(
        isLoggedIn,
        authorizeSubscriber, getLecturesByCourseId
    )
    .put(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        updateCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        removeCourse
    )
    .post(
        isLoggedIn,
        authorizedRoles("ADMIN"),
        upload.single('lecture'),
        addLectureToCourseById
    )

courseRoutes.delete("/:id/lectures/:lectureIndex", isLoggedIn, authorizedRoles("ADMIN"), deleteLecture);

export default courseRoutes;