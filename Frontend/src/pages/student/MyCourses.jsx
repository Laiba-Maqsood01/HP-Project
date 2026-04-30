import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get("/enrollments/my-courses");

        setEnrollments(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <Container className="py-4">

      <div className="mb-4">
        <h3 className="fw-bold">My Learning</h3>
        <p className="text-muted">Continue your courses anytime</p>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : enrollments.length === 0 ? (
        <p className="text-muted">No courses enrolled yet.</p>
      ) : (
        <Row className="g-4">

          {enrollments.map((enrollment) => {
            const course = enrollment.course;

            return (
              <Col md={4} key={enrollment._id}>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">

                  {/* THUMBNAIL */}
                  <div style={{ height: "180px" }}>
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <Card.Body className="d-flex flex-column">

                    <h5 className="fw-bold">{course?.title}</h5>

                    <p className="text-muted small">
                      {course?.description?.slice(0, 90)}...
                    </p>

                    {/* BUTTON ONLY */}
                    <div className="mt-auto">

                      <Button
                        variant="dark"
                        className="w-100"
                        onClick={() =>
                          navigate(`/student/course/${course._id}`)
                        }
                      >
                        Continue
                      </Button>

                    </div>

                  </Card.Body>

                </Card>

              </Col>
            );
          })}

        </Row>
      )}
    </Container>
  );
}