import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { fetchCourses } from "../../services/courseService";
import { Link } from "react-router-dom";
import "./FeatureSection.css";

function getCardsPerView(width) {
  if (width < 768) return 1;
  if (width < 1200) return 2;
  return 3;
}

export default function FeatureSection({
  title = "Featured Courses",
  description = "Explore high-impact courses designed to help students and professionals upskill faster.",
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView(window.innerWidth));

  //  FETCH FEATURED COURSES
  useEffect(() => {
   const loadFeaturedCourses = async () => {
  try {
    const data = await fetchCourses({
      limit: 5,
      featured: "true",
    });

    setCourses(data.courses || []);
  } catch (err) {
    console.error("Failed to fetch featured courses", err);
  } finally {
    setLoading(false);
  }
};
    loadFeaturedCourses();
  }, []);

  //  RESPONSIVE
  useEffect(() => {
    const onResize = () => setCardsPerView(getCardsPerView(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = Math.max(courses.length - cardsPerView, 0);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [currentIndex, maxIndex]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const slides = useMemo(() => courses, [courses]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="featured-courses py-5 py-lg-6">
      <Container>
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4 mb-lg-5">
          <div>
            <h2 className="featured-title mb-2">{title}</h2>
            <p className="featured-subtitle mb-0">{description}</p>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-dark"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={!canGoPrev}
            >
              ←
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))}
              disabled={!canGoNext}
            >
              →
            </Button>
          </div>
        </div>

        <div className="featured-track-wrap">
          <div
            className="featured-track"
            style={{
              transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`,
            }}
          >
            {slides.map((course) => (
              <article key={course._id} className="featured-item">
                <div className="featured-card">
                  <div className="featured-image-wrap">
                    <img
                      src={course.thumbnail || "https://via.placeholder.com/400"}
                      alt={course.title}
                      className="featured-image"
                    />
                    <span className="featured-badge">{course.level || "All Levels"}</span>
                    <div className="featured-overlay" />
                  </div>

                  <div className="featured-content">
                    <h3 className="featured-card-title">{course.title}</h3>
                    <p className="featured-card-text">{course.description}</p>

                    <div className="featured-meta">
                      <span>{course.duration || "—"}</span>
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <span className="featured-price">${course.price || 0}</span>

                      <Button
                        as={Link}
                        to={`/courses/${course._id}`}
                        variant="dark"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}