import { Router } from "express";
import { getAllCourses, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, deleteLecture } from "../controllers/course.controller.js";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js";
const courseRoutes = Router();

courseRoutes.route("/")
    .get(getAllCourses)
    .post(isLoggedIn, authorizedRoles("ADMIN"), upload.single('thumbnail'), createCourse);

courseRoutes.route("/:id")
    .get(
        isLoggedIn, getLecturesByCourseId
    )
    .put(
        isLoggedIn,
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
        upload.single('lectureThumbnail'),
        addLectureToCourseById
    )

courseRoutes.delete("/:id/lectures/:lectureIndex", isLoggedIn, authorizedRoles("ADMIN"), deleteLecture);

export default courseRoutes;