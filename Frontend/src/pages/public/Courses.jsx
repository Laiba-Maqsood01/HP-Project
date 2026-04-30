import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import CourseCard from "../../components/courses/CourseCard";
import CourseFilters from "../../components/courses/CourseFilters";
import { fetchCourses } from "../../services/courseService";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);

      const data = await fetchCourses({
        page,
        limit: 9,
        search,
      });

      setCourses(data.courses);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, search]);

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">All Courses</h2>

      <CourseFilters
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <Row className="g-4">
            {courses.map((course) => (
              <Col md={4} key={course._id}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            <Button
              variant="outline-dark"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>

            <span className="align-self-center">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline-dark"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}