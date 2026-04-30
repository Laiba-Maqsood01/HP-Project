import { Form, Row, Col } from "react-bootstrap";

export default function CourseFilters({
  search,
  setSearch,
}) {
  return (
    <Row className="mb-4">
      <Col md={6}>
        <Form.Control
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Col>
    </Row>
  );
}