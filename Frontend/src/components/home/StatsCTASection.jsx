import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import "./StatsCTASection.css";
import { Award, Users, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { icon: <Users size={24} />, value: 10000, label: "Students", suffix: "+" },
  { icon: <BookOpen size={24} />, value: 250, label: "Courses", suffix: "+" },
  { icon: <Award size={24} />, value: 120, label: "Instructors", suffix: "+" },
  { icon: <TrendingUp size={24} />, value: 95, label: "Success Rate", suffix: "%" },
];

function StatCard({ icon, value, label, suffix }) {
  const ref = useRef();
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="stat-card text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* ICON */}
      <div className="stat-icon mb-3">
        {icon}
      </div>

      {/* VALUE */}
      <h3 className="stat-value">
        {count}
        {suffix}
      </h3>

      {/* LABEL */}
      <p className="stat-label">{label}</p>
    </motion.div>
  );
}

export default function StatsCTASection() {
  return (
    <section className="stats-cta-section py-5">
      <Container>
        {/* Stats */}
        <Row className="g-4 mb-5">
          {stats.map((stat, i) => (
            <Col key={i} xs={6} md={3}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>

        {/*  CTA */}
        <div className="cta-box text-center">
          <h2 className="cta-title mb-3">
            Start Learning Today
          </h2>
          <p className="cta-subtitle mb-4">
            Join thousands of students building real-world skills and advancing their careers.
          </p>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button as={Link} to="/courses" variant="dark" size="lg">
              Browse Courses
            </Button>
            <Button as={Link} to="/profile" variant="outline-dark" size="lg">
              Become Instructor
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}