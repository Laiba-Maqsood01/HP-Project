import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { getCourseById } from "../../services/courseService";
import { enrollCourse } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";

import "./CourseDetails.css";


export default function CourseDetails() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // Get course ID from URL
  const { id } = useParams();

  // ADD STATE HERE
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  //  ADD useEffect HERE
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        // check response structure

        setCourse(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);


  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setEnrolling(true);

      const res = await enrollCourse(course._id);

      if (res.data.success) {
        setEnrolled(true);
         showSuccess("🎉 You are enrolled in this course!");
      }
    } catch (err) {
      console.error(err);
    showError("Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  //  Loading UI
  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  //  Fallback
  if (!course) {
    return <p className="text-center py-5">Course not found</p>;
  }

  //  UI
  return (
    <Container className="py-5">
      {/* HERO */}
      <div className="course-hero mb-5">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-hero-img"
        />

        <div className="course-hero-overlay">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-category">{course.category}</p>
        </div>
      </div>

      {/*  MAIN LAYOUT */}
      <Row className="g-4">
        {/* LEFT SIDE */}
        <Col lg={8}>
          <div className="course-content p-4 rounded-4">
            <h4 className="mb-3">Description</h4>
            <p className="text-muted">{course.description}</p>

            {/*  LESSONS */}
            <h4 className="mt-5 mb-3">Course Content</h4>

            <div className="lesson-accordion">
              {course.lessons?.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div key={lesson._id} className="lesson-item">
                    <button className="lesson-header">
                      <span>
                        {index + 1}. {lesson.title}
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted">No lessons available yet.</p>
              )}
            </div>
          </div>
        </Col>

        {/* RIGHT SIDE (SIDEBAR) */}
        <Col lg={4}>
          <div className="course-sidebar p-4 rounded-4">
            <h3 className="mb-3">${course.price}</h3>

            <Button
              variant={enrolled ? "success" : "dark"}
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
            >
              {enrolling
                ? "Enrolling..."
                : enrolled
                  ? "Enrolled"
                  : "Enroll Now"}
            </Button>

            <ul className="course-info list-unstyled">
              <li>📚 {course.lessons?.length || 0} Lessons</li>
              <li>📂 {course.category}</li>
              <li>🕒 Lifetime Access</li>
              <li>📜 Certificate Included</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
}