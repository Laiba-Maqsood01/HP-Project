import { useEffect, useState } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import api from "../../services/api";
import "./ManageCourses.css"

export default function ManageCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/instructor/my-courses");
        setCourses(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${selectedCourseId}`);

      setCourses((prev) =>
        prev.filter((c) => c._id !== selectedCourseId)
      );

      setShowDeleteModal(false);

      showSuccess("Course deleted successfully");
    } catch (err) {
      console.log(err);
      showError("Delete failed");
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      const res = await api.put(`/courses/${courseId}/publish`);

      const updatedCourse = res.data.data;

      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? updatedCourse : c
        )
      );

      showSuccess(
        updatedCourse.isPublished
          ? "Course published successfully"
          : "Course unpublished successfully"
      );
    } catch (err) {
      showError("Add at least one lecture before publish!");
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-bold">My Courses</h3>
        <p className="text-muted">Manage, edit and add lessons</p>
      </div>

      {/* LIST */}
      <div className="d-none d-md-block">
        <div className="bg-white rounded-4 shadow-sm p-3">

          {loading ? (
            <Spinner animation="border" />
          ) : courses.length === 0 ? (
            <p className="text-muted">No courses found</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="d-flex justify-content-between align-items-center border-bottom py-3"
              >
                {/* LEFT */}
                <div>
                  <h6 className="mb-1">{course.title}</h6>
                  <small className="text-muted">
                    {course.category} • ${course.price}
                  </small>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="d-flex gap-2">

                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() =>
                      navigate(`/instructor/courses/edit/${course._id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      navigate(`/instructor/courses/${course._id}/add-lesson`)
                    }
                  >
                    Upload Lessons
                  </Button>

                  {/*  DELETE */}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    size="sm"
                    variant={course.isPublished ? "warning" : "success"}
                    style={{ width: "120px" }}
                    onClick={() => handleTogglePublish(course._id)}
                  >
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </Button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="d-md-none">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-sm rounded-4 p-3 mb-3">

            {/* TITLE */}
            <h6 className="mb-1">{course.title}</h6>

            {/* META */}
            <small className="text-muted d-block mb-2">
              {course.category} • ${course.price}
            </small>

            {/* STATUS */}
            <div className="mb-3">
              <span className={course.isPublished ? "text-success" : "text-warning"}>
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {/* ACTIONS (STACKED + WRAPPED) */}
            <div className="d-flex flex-wrap gap-2">

              <Button size="sm" variant="outline-secondary"
                onClick={() => navigate(`/courses/${course._id}`)}>
                View
              </Button>

              <Button size="sm" variant="dark"
                onClick={() => navigate(`/instructor/courses/edit/${course._id}`)}>
                Edit
              </Button>

              <Button size="sm" variant="primary"
                onClick={() => navigate(`/instructor/courses/${course._id}/add-lesson`)}>
                Lessons
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setSelectedCourseId(course._id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Button>

              <Button
                size="sm"
                variant={course.isPublished ? "warning" : "success"}
                onClick={() => handleTogglePublish(course._id)}
              >
                {course.isPublished ? "Unpublish" : "Publish"}
              </Button>

            </div>
          </div>
        ))}

      </div>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        className="delete-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this course?
          <br />
          <span className="text-danger fw-semibold">
            This action cannot be undone.
          </span>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}