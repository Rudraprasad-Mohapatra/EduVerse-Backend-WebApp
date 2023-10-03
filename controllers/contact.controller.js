import Contact from "../models/contact.model.js";
import AppError from "../utils/error.util.js";
const contact = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return next(new AppError("All fields are required", 400));
        }

        const contact = await Contact.create({
            name,
            email,
            message
        })

        if (!contact) {
            return next(new AppError("Something went wrong, please try again."), 400);
        }

        await contact.save();

        res.status(201).json(
            {
                success: true,
                message: "Message received successfully Thank you for contacting us!"
            });

    } catch (error) {
        return next(new AppError("OOPS! Failed to send your message!"));
    }
}

export {
    contact
};