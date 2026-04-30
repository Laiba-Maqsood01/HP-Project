import { useEffect, useState } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import CourseForm from "./CourseForm";
import { showSuccess, showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export default function EditCourse() {

    const { id } = useParams();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // fetch course
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setForm({
                    ...res.data.data,
                    thumbnail: null
                });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);

            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                if (form[key] !== undefined && form[key] !== null) {
                    formData.append(key, form[key]);
                }
            });

            await api.put(`/courses/${id}`, formData);

            // toast 
            showSuccess("Course updated successfully");

            //  redirect 
            navigate("/instructor/dashboard");

        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !form) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="py-4">

            <Card className="p-4 shadow-sm border-0">
                <h3 className="mb-3">Edit Course</h3>

                <CourseForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSubmit}
                    loading={updating}
                    mode="edit"
                />

            </Card>

        </Container>
    );
}