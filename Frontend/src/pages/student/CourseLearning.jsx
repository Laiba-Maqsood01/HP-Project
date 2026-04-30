import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

import "./CourseLearning.css";

export default function CourseLearning() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [enrollment, setEnrollment] = useState(null);

  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/enrollments/my-courses");

      const found = res.data.data.find(
        (item) => item.course._id === id
      );

      setEnrollment(found);
    };

    fetchData();
  }, [id]);

  if (!enrollment) return <p className="p-3">Loading...</p>;

  const course = enrollment.course;
  const lessons = course.lessons || [];
  const currentLesson = lessons[currentIndex];

  const watchedPercent = duration ? (watchTime / duration) * 100 : 0;
  const canComplete = watchedPercent >= 95;

  const handleComplete = async () => {
    try {
      const res = await api.post("/enrollments/complete-lesson", {
        enrollmentId: enrollment._id,
        lessonId: currentLesson._id,
      });

      setEnrollment((prev) => ({
        ...prev,
        completedLessons: res.data.data.completedLessons,
        progress: res.data.data.progress,
        completed: res.data.data.completed,
      }));

      if (currentIndex < lessons.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTimeUpdate = (e) => {
    setWatchTime(e.target.currentTime);
    setDuration(e.target.duration);
  };

  const handleEnded = () => {
    setWatchTime(duration);
  };

  return (
    <div className="learning-layout">

      {/* LEFT / BOTTOM (LESSONS) */}
      <div className="learning-sidebar">

        <div className="sidebar-header">
          <div className="sidebar-title">
            <ArrowLeft
              size={18}
              className="back-icon"
              onClick={() => navigate("/student/my-courses")}
            />
            <h6>Course Content</h6>
          </div>
        </div>

        <div className="progress-box">
          <small>{Math.round(enrollment.progress)}% completed</small>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        <div className="lesson-list">
          {lessons.map((lesson, index) => {
            const isActive = index === currentIndex;
            const isCompleted = enrollment.completedLessons?.includes(lesson._id);

            return (
              <div
                key={lesson._id}
                className={`lesson-item ${isActive ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="lesson-title">
                  {isCompleted && (
                    <CheckCircle2 size={16} className="text-success" />
                  )}
                  <span>{lesson.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT / TOP (VIDEO AREA) */}
      <div className="learning-main">

        <h5 className="video-title">
          {currentLesson?.title}
        </h5>

        <div className="video-controls">

          <button
            className="control-btn"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((p) => p - 1)}
          >
            <ChevronLeft size={18} /> Prev
          </button>

          <button
            className="control-btn primary"
            onClick={handleComplete}
            disabled={
              !canComplete ||
              enrollment.completedLessons?.includes(currentLesson._id)
            }
          >
            {enrollment.completedLessons?.includes(currentLesson._id)
              ? "Completed"
              : canComplete
                ? "Mark Complete"
                : "Watch 95%"}
          </button>

          <button
            className="control-btn"
            disabled={currentIndex === lessons.length - 1}
            onClick={() => setCurrentIndex((p) => p + 1)}
          >
            Next <ChevronRight size={18} />
          </button>

        </div>

        <div className="video-wrapper">
          <video
            controls
            controlsList="nodownload"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            <source src={currentLesson?.videoUrl} type="video/mp4" />
          </video>
        </div>

      </div>

    </div>
  );
}