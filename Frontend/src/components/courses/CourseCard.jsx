import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Img
        variant="top"
        src={course.thumbnail || "https://via.placeholder.com/300"}
        style={{ height: "180px", objectFit: "cover" }}
      />

      <Card.Body>
        <h5 className="fw-semibold">{course.title}</h5>

        <p className="text-muted small">
          {course.description?.slice(0, 90)}...
        </p>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-dark">
            ${course.price || 0}
          </span>

          <Button
            as={Link}
            to={`/courses/${course._id}`}
            size="sm"
            variant="dark"
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}