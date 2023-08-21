import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select("-lectures");

        res.status(200).json({
            success: true,
            message: 'Allcourses',
            courses
        });
    } catch (err) {
        return next(new AppError(err.message, 400));
    }



}
const getLecturesByCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if(!course) {
            return next(new AppError("Invalid Course ID", 400));
        }
        res.status(200).json({
            success:true,
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        })
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
}

export {
    getAllCourses,
    getLecturesByCourseId
}