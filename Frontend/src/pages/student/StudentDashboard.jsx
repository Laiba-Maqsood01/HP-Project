import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import api from "../../services/api";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await api.get("/enrollments/my-courses");
      setCourses(res.data.data || []);
    };

    fetchCourses();
  }, []);

  return (
    <div>

      <h3 className="fw-bold mb-4">Dashboard</h3>

      {/* STATS */}
     <Row className="mb-4 g-3">
        <Col md={4} className="mb-4">
          <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>Total Enrolled</h6>
            <h3>{courses.length}</h3>
          </div>
        </Col>

        <Col md={4} className="mb-4">
          <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>Completed</h6>
            <h3>
              {courses.filter(c => c.completed).length}
            </h3>
          </div>
        </Col>

        <Col md={4} className="mb-4">
          <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>In Progress</h6>
            <h3>
              {courses.filter(c => !c.completed).length}
            </h3>
          </div>
        </Col>
      </Row>

      {/* QUICK MESSAGE */}
      <div className="p-3 bg-white rounded-4 shadow-sm">
        <h5>Welcome to your learning dashboard 🎓</h5>
        <p className="text-muted mb-0">
          Track your progress and continue your courses anytime.
        </p>
      </div>

    </div>
  );
}