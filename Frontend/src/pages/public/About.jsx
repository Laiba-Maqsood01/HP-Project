import { Container, Row, Col, Card } from "react-bootstrap";

export default function About() {
  return (
    <div className="py-5">
      <Container>

        {/* HERO SECTION */}
        <div className="text-center mb-5">
          <h1 className="fw-bold">About Our Platform</h1>
          <p className="text-muted mt-3">
            A modern learning management system built to simplify teaching and learning
            for students, instructors, and admins.
          </p>
        </div>

        {/* MISSION */}
        <Row className="mb-5">
          <Col>
            <Card className="p-4 border-0 shadow-sm rounded-4">
              <h4 className="fw-bold mb-3">Our Mission</h4>
              <p className="text-muted mb-0">
                We aim to make online education simple, accessible, and scalable.
                Our platform enables instructors to create structured courses
                effortlessly while allowing students to learn at their own pace
                with progress tracking and a seamless learning experience.
              </p>
            </Card>
          </Col>
        </Row>

        {/* PLATFORM OVERVIEW */}
        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="p-4 border-0 shadow-sm h-100 rounded-4">
              <h5 className="fw-bold">How Students Learn</h5>
              <ul className="text-muted mt-3">
                <li>Browse available courses</li>
                <li>Enroll in desired courses</li>
                <li>Watch lessons step-by-step</li>
                <li>Track learning progress</li>
              </ul>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 border-0 shadow-sm h-100 rounded-4">
              <h5 className="fw-bold">How Instructors Teach</h5>
              <ul className="text-muted mt-3">
                <li>Create and manage courses</li>
                <li>Add video lessons</li>
                <li>Publish or unpublish content</li>
                <li>View analytics and student stats</li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* TECH STACK */}
        <Row className="mb-5">
          <Col>
            <Card className="p-4 border-0 shadow-sm rounded-4">
              <h4 className="fw-bold mb-3">Technology Behind the Platform</h4>
              <Row className="text-muted">
                <Col md={6}>
                  <ul>
                    <li>MERN Stack (MongoDB, Express, React, Node.js)</li>
                    <li>JWT Authentication (Access + Refresh Tokens)</li>
                    <li>Role-Based Access Control (RBAC)</li>
                  </ul>
                </Col>

                <Col md={6}>
                  <ul>
                    <li>ImageKit for media storage</li>
                    <li>Secure file uploads for videos/images</li>
                    <li>REST API architecture</li>
                  </ul>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* FINAL CTA */}
        <div className="text-center">
          <h5 className="fw-bold">Start Learning Today</h5>
          <p className="text-muted">
            Explore courses and begin your learning journey now.
          </p>
        </div>

      </Container>
    </div>
  );
}