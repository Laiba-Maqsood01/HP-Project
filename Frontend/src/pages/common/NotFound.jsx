import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <section className="d-flex align-items-center min-vh-100 py-5">
      <Container className="py-5">
        <Row className="align-items-center">
          
          {/* Animation Column */}
          <Col md={6} className="order-md-2 text-center">
            <div className="lc-block">
              <lottie-player
                src="https://assets9.lottiefiles.com/packages/lf20_kcsr6fcp.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ maxWidth: "100%", height: "auto" }}
              ></lottie-player>
            </div>
          </Col>

          {/* Text Column */}
          <Col md={6} className="text-center text-md-start">
            
            <div className="mb-3">
              <h1 className="display-1 fw-bold text-muted">Error 404</h1>
            </div>

            <div className="mb-5">
              <p className="rfs-11 fw-light">
                The page you are looking for was moved, removed or might never existed.
              </p>
            </div>

            <div>
              <Button variant="secondary" size="lg" href="/">
                Back to homepage
              </Button>
            </div>

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NotFound;