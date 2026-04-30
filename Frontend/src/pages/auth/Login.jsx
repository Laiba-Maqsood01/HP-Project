import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showSuccess, showError } from "../../utils/toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(form, navigate);

      if (!result.success) {
        setError(result.message);
        showError("Invalid credentials")
        return;
      }
       showSuccess("🎉 You are logged in!");

    } catch (err) {
      setError("Login failed");
      showError("Login Failed")
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="p-4 shadow-lg border-0" style={{ width: "420px", borderRadius: "16px" }}>
        <h3 className="mb-3 text-center fw-bold">Welcome Back</h3>
        <p className="text-muted text-center mb-4">Login to continue learning</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>

            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </Form.Group>

          <Button type="submit" variant="dark" className="w-100 py-2">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <p className="text-center mt-3 small">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </Card>
    </Container>
  );
}

