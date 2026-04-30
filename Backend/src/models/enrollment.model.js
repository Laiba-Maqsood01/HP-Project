import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    progress: {
      type: Number,
      default: 0, // percentage
      min: 0,
      max: 100,
    },
    completed: { //this will be used for showing that the lesson is completed or not?
      type: Boolean,
      default: false,
    },
    completedLessons: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    }
  },
  { timestamps: true }
);

// prevent duplicate enrollment, it keeps the combination of student and course uniqu.
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const enrollmentModel = mongoose.model("enrollments", enrollmentSchema);

export default enrollmentModel;