import { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { showSuccess, showError } from "../../utils/toast";
import api from "../../services/api";

export default function VerifyEmail() {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sendOtp = async () => {
      try {
        await api.post("/auth/resend-otp", { email });
      } catch (err) {
        console.log("OTP resend failed", err);
      }
    };

    if (email) {
      sendOtp();
    }
  }, [email]);

  useEffect(() => {
    let interval;

    if (!canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [canResend]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // auto move next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const code = otp.join("");

      const res = await api.post("/auth/verify-email", {
        email,
        otp: code,
      });

      const user = res.data.data;

      //  CRITICAL: update global auth state
      setUser(user);

      showSuccess("You are Verified now!");
      // navigate("/");
      navigate("/login", {
        state: { message: "Email verified. Please login." }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      showError("Something went wrong!")
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { email });

      // reset timer
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  if (!email) {
    return (
      <Container className="text-center mt-5">
        <h4>Invalid Access</h4>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className="p-4 shadow border-0 rounded-4 text-center"
        style={{ width: "420px" }}
      >
        <h4 className="fw-bold">Verify Your Email</h4>

        <p className="text-muted">
          OTP sent to <b>{email}</b>
        </p>

        {error && <p className="text-danger">{error}</p>}

        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center gap-2 my-3">
            {otp.map((digit, i) => (
              <Form.Control
                key={i}
                id={`otp-${i}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                maxLength={1}
                className="text-center"
                style={{ width: "45px", height: "50px", fontSize: "20px" }}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="dark"
            disabled={loading}
            className="w-100"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

        </Form>

        {/* MOVE OUTSIDE FORM */}
        <div className="mt-3 text-center">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={!canResend}
            onClick={handleResend}
          >
            {canResend
              ? "Resend OTP"
              : `Resend in ${timer}s`}
          </Button>
        </div>
      </Card>
    </Container>
  );
}



