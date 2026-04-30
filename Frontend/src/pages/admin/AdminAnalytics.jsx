import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import api from "../../services/api";
import { showError } from "../../utils/toast";
import "./AdminAnalytics.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("30"); // default 30 days

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/admin/analytics?range=${range}`);
      setData(res.data.data);
    } catch {
      showError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchAnalytics();
}, [range]);


  const formatGrowth = (arr = []) => {
    return arr.map(item => ({
      name: monthNames[item._id - 1] || "",
      value: item.count
    }));
  };
  if (loading || !data) return <Spinner animation="border" />;

  // for growth representation
  const userGrowthData = formatGrowth(data.userGrowth);
  const courseGrowthData = formatGrowth(data.courseGrowth);
  const enrollmentGrowthData = formatGrowth(data.enrollmentGrowth);


  // ================= DATA =================

  const overviewData = [
    { name: "Users", value: data.totalUsers },
    { name: "Courses", value: data.totalCourses },
    { name: "Enrollments", value: data.totalEnrollments },
  ];

  const roleData = [
    { name: "Students", value: data.totalStudents },
    { name: "Instructors", value: data.totalInstructors },
  ];

  const userBreakdown = [
    { name: "Total", value: data.totalUsers },
    { name: "Students", value: data.totalStudents },
    { name: "Instructors", value: data.totalInstructors },
  ];

const COLORS = [
  "#6366f1", // Indigo
  "#22c55e", // Green
];



  return (
    <div className="analytics-container">

      <h4 className="mb-4">Analytics Overview</h4>

      {/* ================= STAT CARDS ================= */}
      <Row className="g-4 mb-4">
        <StatCard title="Total Users" value={data.totalUsers} />
        <StatCard title="Courses" value={data.totalCourses} />
        <StatCard title="Enrollments" value={data.totalEnrollments} />
        <StatCard title="Students" value={data.totalStudents} />
        <StatCard title="Instructors" value={data.totalInstructors} />
      </Row>


      {/* Buttons for filter */}
      <div className="d-flex gap-2 mb-3">
  <button
    className={range === "7" ? "btn btn-dark" : "btn btn-outline-dark"}
    onClick={() => setRange("7")}
  >
    Last 7 Days
  </button>

  <button
    className={range === "30" ? "btn btn-dark" : "btn btn-outline-dark"}
    onClick={() => setRange("30")}
  >
    Last 30 Days
  </button>
</div>

      {/* ================= CHARTS ================= */}
      <Row className="g-4">

        {/* OVERVIEW */}
        <Col lg={6}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">Platform Overview</h6>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* ROLE DISTRIBUTION */}
        <Col lg={6}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">User Roles</h6>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" outerRadius={100} label>
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* USER BREAKDOWN */}
        <Col lg={12}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">User Breakdown</h6>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userBreakdown}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

      </Row>


      <Row className="g-4 mt-4">

        {/* USER GROWTH */}
        <Col lg={4}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">User Growth</h6>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userGrowthData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* COURSE GROWTH */}
        <Col lg={4}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">Course Growth</h6>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={courseGrowthData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* ENROLLMENT GROWTH */}
        <Col lg={4}>
          <Card className="premium-card">
            <Card.Body>
              <h6 className="chart-title">Enrollment Growth</h6>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={enrollmentGrowthData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

// ================= CARD =================

function StatCard({ title, value }) {
  return (
    <Col md={4} lg={3}>
      <Card className="stat-card">
        <Card.Body>
          <h6>{title}</h6>
          <h2>{value}</h2>
        </Card.Body>
      </Card>
    </Col>
  );
}
