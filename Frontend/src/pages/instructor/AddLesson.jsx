import { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";

export default function AddLesson() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState({
    title: "",
    content: "",
    duration: 0
  });

  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    setLesson({
      ...lesson,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    // for auto detection of video duration
    if (file) {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);

        const durationInSeconds = Math.floor(video.duration);

        setLesson((prev) => ({
          ...prev,
          duration: durationInSeconds
        }));
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", lesson.title);
      formData.append("content", lesson.content);
      formData.append("duration", lesson.duration);

      if (videoFile) {
        formData.append("video", videoFile);
      }

      await api.post(`/courses/${courseId}/lesson`, formData);

      showSuccess("Lesson added successfully");
      navigate("/instructor/courses");

    } catch (err) {
      console.log(err);
      showError("Failed to add lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>

          <Card className="p-4 shadow-lg border-0" style={{ borderRadius: "16px" }}>
            <h3 className="mb-3">Add Lesson</h3>

            <Form onSubmit={handleSubmit}>

              {/* TITLE */}
              <Form.Group className="mb-3">
                <Form.Label>Lesson Title</Form.Label>
                <Form.Control
                  name="title"
                  value={lesson.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* CONTENT */}
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="content"
                  value={lesson.content}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* VIDEO */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                {lesson.duration > 0 && (
                <small className="text-muted">
                  Duration: {formatDuration(lesson.duration)}
                </small>
              )}
              </Form.Group>

              {/* SUBMIT */}
              <Button type="submit" variant="dark" disabled={loading}>
                {loading ? "Uploading..." : "Add Lesson"}
              </Button>

            </Form>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}