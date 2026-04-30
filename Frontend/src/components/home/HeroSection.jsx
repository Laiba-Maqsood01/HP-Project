import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HeroSection.css";

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

const COURSES = [
  { title: "React Mastery",
    src: "https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { title: "Python Bootcamp",
    src: "https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=862&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
   { title: "Data Structures", 
    src: "https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { title: "Node.js API Pro", 
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&q=80" 
  },
  { title: "MongoDB Essentials", 
    src: "https://images.unsplash.com/photo-1658204238967-3a81a063d162?q=80&w=862&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  { title: "UI/UX Design", 
    src: "https://plus.unsplash.com/premium_photo-1661589354357-f56ddf86a0b4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { title: "JavaScript Deep Dive", src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { title: "DevOps Fundamentals",
    src: "https://media.istockphoto.com/id/2224680857/photo/devops-concept.jpg?s=1024x1024&w=is&k=20&c=1k3CIyxLSRg-vNkeVcCzMwZFXGtFymAGpWPopu5Fe-s=" 
  },
  { title: "Git & GitHub", 
    src: "https://images.unsplash.com/photo-1654277041218-84424c78f0ae?q=80&w=1462&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
  { title: "SQL for Developers", 
    src: "https://images.unsplash.com/photo-1662026911591-335639b11db6?q=80&w=862&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  },
];

const ORBIT_ITEMS = COURSES.slice(0, 10);

function CourseOrbitCard({ src, title, target }) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        opacity: 1,
        scale: target.scale,
        rotate: target.rotate,
      }}
      transition={{ type: "spring", stiffness: 45, damping: 18 }}
      className="hero-orbit-card"
      style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
    >
      <img
        src={src}
        alt={title}
        className="h-100 w-100 object-fit-cover rounded-4 shadow-sm"
        draggable={false}
      />
    </motion.div>
  );
}

export default function HeroSection() {
  const [orbitSize, setOrbitSize] = useState({ width: 0, height: 0 });
  const rotationRef = useRef(0);
  const [, setTick] = useState(0);
  const orbitZoneRef = useRef(null);
  const frameRef = useRef(null);

  //  Resize Observer
  useEffect(() => {
    if (!orbitZoneRef.current) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setOrbitSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });

    observer.observe(orbitZoneRef.current);

    setOrbitSize({
      width: orbitZoneRef.current.offsetWidth,
      height: orbitZoneRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  //  Animation Loop
  useEffect(() => {
    let last = performance.now();

    const animate = (now) => {
      const delta = now - last;
      last = now;

      rotationRef.current =
        (rotationRef.current + delta * 0.015) % 360;

      setTick((v) => v + 1); 

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  //  Optimized Positions Calculation
  const positions = useMemo(() => {
    const total = ORBIT_ITEMS.length;
    const width = orbitSize.width || 560;
    const height = orbitSize.height || 520;

    const isMobile = width < 520;
    const minDim = Math.min(width, height);

    const radius = isMobile
      ? Math.max(150, minDim * 0.35)
      : Math.max(210, minDim * 0.4);

    const rotation = rotationRef.current;

    return ORBIT_ITEMS.map((_, i) => {
      const baseAngle = (i / total) * 360;
      const angle = (baseAngle + rotation) * (Math.PI / 180);

      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotate: baseAngle + rotation + 90,
        scale: isMobile ? 1 : 1.08,
      };
    });
  }, [orbitSize, rotationRef.current]);

  return (
    <section className="hero-scroll-morph position-relative overflow-hidden">
      <Container className="h-100 d-flex align-items-center">
        <Row className="hero-layout-row w-100 h-100 align-items-center g-4 g-lg-5">

          {/* LEFT */}
          <Col lg={6} className="hero-left-col d-flex">
            <div className="hero-left-content">
              <h1 className="hero-title mb-3">
                Learn Skills That Move Your Career Forward
              </h1>
              <p className="hero-subtitle mb-4">
                Build real-world expertise with structured courses,
                guided roadmaps, and role-based learning journeys.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Button as={Link} to="/courses" variant="dark" size="lg">
                  Explore Courses
                </Button>
                <Button
                  as={Link}
                  to="/profile"
                  variant="outline-dark"
                  size="lg"
                >
                  Become Instructor
                </Button>
              </div>
            </div>
          </Col>

          {/* RIGHT */}
          <Col lg={6} className="hero-right-col d-flex">
            <div
              ref={orbitZoneRef}
              className="hero-orbit-zone position-relative"
            >
              <div className="hero-cards-plane position-relative w-100 h-100">
                {ORBIT_ITEMS.map((item, i) => (
                  <CourseOrbitCard
                    key={item.title}
                    src={item.src}
                    title={item.title}
                    target={positions[i]}
                  />
                ))}
              </div>
            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}