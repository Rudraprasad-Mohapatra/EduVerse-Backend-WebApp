import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import path from "path";
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
        if (!course) {
            return next(new AppError("Invalid Course ID", 400));
        }
        res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        })
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
}

const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy,
        } = req.body;

        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "Dummy",
                secure_url: "Dummy"
            },

        });

        if (!course) {
            return next(new AppError('Course could not created, please try again', 500));
        }
        console.log(req.file);
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms'
                });
                console.log(JSON.stringify(result));
                if (result) {
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`);
            } catch (e) {
                return next(new AppError(e.message, 400));
            }
            await course.save();
        }
        res.status(200).json({
            success: true,
            message: "course created successfully",
            course
        });
    }
    catch (error) {
        return new AppError(error.message, 400);
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        );

        if (!course) {
            return next(
                new AppError("Course with given id does not exist", 500)
            );
        }
        return res.status(200).json({
            success: true,
            message: "Course updated Successfully!",
            course
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError("Course with given id does not exist", 500));
        }
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Course deleted successfully!"
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new AppError("Title and Description are required!"));
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError("Course with given id does not exist", 500));
        }

        const lectureData = {
            title,
            description,
            lecture: {}
        }


        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    chunk_size: 50000000,
                    resource_type: "video"
                });

                console.log(JSON.stringify(result));
                // If Success
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`);
            } catch (e) {
                // Empty the uploads directory without deleting the uploads directory
                for (const file of await fs.readdir("uploads/")) {
                    await fs.unlink(path.join("uploads/", file));
                }
                return next(new AppError(e.message, 400));
            }

            course.lectures.push(lectureData);

            course.numbersOfLectures = course.lectures.length;

            await (course.save());

            res.status(200).json({
                success: true,
                message: "Lectures successfully added to the course",
                course,
            });
        }
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

const deleteLecture = async (req, res, next) => {
    try {
        const { id, lectureIndex } = req.params;
        console.log(id, lectureIndex);
        if (!id || !lectureIndex) {
            res.status(400).json({
                success: false,
                message: "Course ID and lectureIndex are required."
            })
        }
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course with given id does not exist."
            });
        }

        if (lectureIndex < 0 || lectureIndex >= course.lectures.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid lectureIndex."
            });
        }
        else {
            course.lectures.splice(lectureIndex, 1);
            course.numbersOfLectures = course.lectures.length;
            await course.save();

            return res.status(200).json({
                success: true,
                message: "Lecture deleted successfully."
            });
        }
    } catch (e) {
        return next(new AppError(e.message, 500));
    }

}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLecture
}