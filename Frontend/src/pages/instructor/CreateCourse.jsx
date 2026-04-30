import { useState } from "react";
import { Container, Card } from "react-bootstrap";
import api from "../../services/api";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";

export default function CreateCourse() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: null
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      });

      await api.post("/courses", formData);

      // toast 
      showSuccess("Course created successfully");

      //  redirect 
      navigate("/instructor/dashboard");

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">

      <Card className="p-4 shadow-sm border-0">
        <h3 className="mb-3">Create Course</h3>

        <CourseForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          loading={loading}
          mode="create"
        />

      </Card>

    </Container>
  );
}