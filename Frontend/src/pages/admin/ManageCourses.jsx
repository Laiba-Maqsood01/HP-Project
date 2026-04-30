import { useEffect, useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import api from "../../services/api";
import { showError, showSuccess } from "../../utils/toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import MobileCard from "../../components/common/MobileCard";
import "./ManageCourses.css"

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // for deletion pop over
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data.data);
    } catch (err) {
      showError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE COURSE =================
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await api.delete(`/admin/courses/${selectedCourse._id}`);

      showSuccess("Course deleted");

      setShowDeleteModal(false);
      setSelectedCourse(null);

      fetchCourses();
    } catch (err) {
      showError("Delete failed");
    }
  };

  // Toggle Publish Course
  const togglePublish = async (id) => {
    try {
      await api.put(`/admin/courses/${id}/toggle-publish`);
      showSuccess("Status updated");
      fetchCourses();
    } catch {
      showError("Failed to update");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.put(`/admin/courses/${id}/featured`);
      showSuccess("Featured status updated");
      fetchCourses();
    } catch {
      showError("Failed to update featured status");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <h4 className="mb-4">Manage Courses</h4>
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Instructor</th>
              <th>Category</th>
              <th>Price</th>
              <th>Published</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>

                <td>{course.instructor?.username}</td>

                <td>{course.category || "N/A"}</td>

                <td>${course.price || 0}</td>

                <td>
                  {course.isPublished ? (
                    <Badge bg="success">Published</Badge>
                  ) : (
                    <Badge bg="secondary">Draft</Badge>
                  )}
                </td>

                <td>
                  {course.isFeatured ? (
                    <Badge bg="warning" text="dark">Featured</Badge>
                  ) : (
                    <Badge bg="light" text="dark">Normal</Badge>
                  )}
                </td>

                <td>
                  <div className="d-flex gap-2">

                    {/* TOGGLE PUBLISH */}
                    <Button
                      size="sm"
                      variant={course.isPublished ? "outline-warning" : "success"}
                      onClick={() => togglePublish(course._id)}
                       style={{ width: "110px" }}
                    >
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </Button>

                    <Button
                      size="sm"
                      variant={course.isFeatured ? "primary" : "outline-primary"}
                      onClick={() => toggleFeatured(course._id)}
                      style={{ width: "110px" }}
                    >
                      {course.isFeatured ? "Unfeature" : "Feature"}
                    </Button>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-md-none px-2">
        {courses.map((course) => (
          <MobileCard
            key={course._id}
            title={course.title}
            fields={[
              {
                label: "Instructor",
                value: course.instructor?.username || "N/A",
              },
              {
                label: "Category",
                value: course.category || "N/A",
              },
              {
                label: "Price",
                value: `$${course.price || 0}`,
              },
              {
                label: "Status",
                value: course.isPublished ? (
                  <Badge bg="success">Published</Badge>
                ) : (
                  <Badge bg="secondary">Draft</Badge>
                ),
              },
              {
                label: "Featured",
                value: course.isFeatured ? (
                  <Badge bg="warning" text="dark">Featured</Badge>
                ) : (
                  <Badge bg="light" text="dark">Normal</Badge>
                ),
              }
            ]}
            actions={
              <>
                {/* TOGGLE PUBLISH */}
                <Button
                  size="sm"
                  variant={course.isPublished ? "outline-warning" : "success"}
                  onClick={() => togglePublish(course._id)}
                   style={{ width: "110px" }}
                >
                  {course.isPublished ? "Unpublish" : "Publish"}
                </Button>

                <Button
                  size="sm"
                  variant={course.isFeatured ? "primary" : "outline-primary"}
                  onClick={() => toggleFeatured(course._id)}
                   style={{ width: "110px" }}
                >
                  {course.isFeatured ? "Unfeature" : "Feature"}
                </Button>

                {/* DELETE */}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </>
            }
          />
        ))}
      </div>

      <ConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCourse(null);
        }}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message={`Delete "${selectedCourse?.title}" permanently? This cannot be undone.`}
      />
    </div>
  );
}