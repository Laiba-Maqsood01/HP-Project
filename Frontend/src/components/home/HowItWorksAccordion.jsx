import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ChevronDown } from "lucide-react";
import "./HowItWorksAccordion.css";

const steps = [
  {
    title: "Browse Courses",
    content:
      "Explore a wide range of courses designed by industry experts and choose what fits your goals.",
  },
  {
    title: "Enroll & Start Learning",
    content:
      "Sign up and get instant access to structured lessons, projects, and learning materials.",
  },
  {
    title: "Track Your Progress",
    content:
      "Monitor your learning journey with progress tracking and stay motivated throughout.",
  },
  {
    title: "Earn Certificates",
    content:
      "Complete courses and receive certificates to showcase your skills professionally.",
  },
];

export default function HowItWorksAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="how-section py-5">
      <Container>
        <Row className="justify-content-center mb-4 text-center">
          <Col lg={6}>
            <h2 className="how-title">How It Works</h2>
            <p className="how-subtitle">
              Simple steps to start your learning journey and grow your skills.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="accordion-custom">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`accordion-item-custom ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <button
                    className="accordion-header-custom"
                    onClick={() => toggleItem(index)}
                  >
                    <span>{step.title}</span>
                    <ChevronDown
                      size={18}
                      className={`icon ${
                        activeIndex === index ? "rotate" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`accordion-body-custom ${
                      activeIndex === index ? "open" : ""
                    }`}
                  >
                    <p>{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}