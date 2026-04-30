import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        description: {
            type: String,
            required: [true, "Course description is required"],
            minlength: 10
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            default: 0
        },
        thumbnail: {
            type: String,
            default: null
        },
        lessons: [
            {
                title: {
                    type: String,
                    required: true
                },
                content: String,
                videoUrl: String,
                duration: Number   
            }
        ],
        isPublished: {
            type: Boolean,
            default: false
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        thumbnailFileId: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

const courseModel = mongoose.model("courses", courseSchema);

export default courseModel