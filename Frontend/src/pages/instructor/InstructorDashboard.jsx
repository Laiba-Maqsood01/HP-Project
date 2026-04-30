import { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import api from "../../services/api";

//  Recharts
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function InstructorDashboard() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/courses/instructor/stats");
        const coursesRes = await api.get("/courses/instructor/my-courses");

        setStats(statsRes.data.data || {});
        setCourses(coursesRes.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;

  // PIE DATA
  const pieData = [
    { name: "Published", value: stats?.publishedCourses || 0 },
    {
      name: "Draft",
      value: (stats?.totalCourses || 0) - (stats?.publishedCourses || 0)
    }
  ];

  const COLORS = ["#28a745", "#dc3545"];

  //  BAR DATA
  const barData = [
    {
      name: "Courses",
      total: stats?.totalCourses || 0,
      published: stats?.publishedCourses || 0
    }
  ];

  const studentsData = stats?.studentsPerCourse || [];

  return (
   <div className="px-2 px-md-0">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-bold">Dashboard</h3>
        <p className="text-muted">Instructor analytics overview</p>
      </div>

      {/* STATS CARDS */}
      <Row className="mb-4 g-3">
        <Col md={4} className="mb-3">
          <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>Total Courses</h6>
            <h3>{stats?.totalCourses || 0}</h3>
          </div>
        </Col>

        <Col md={4} className="mb-3">
          <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>Published Courses</h6>
            <h3>{stats?.publishedCourses || 0}</h3>
          </div>
        </Col>

        <Col md={4} className="mb-3">
         <div className="p-3 bg-white rounded-4 shadow-sm h-100">
            <h6>Total Revenue</h6>
            <h3>$0</h3>
          </div>
        </Col>
      </Row>

      {/* students per course */}
      <div className="p-3 bg-white shadow-sm rounded-4 mt-4">
        <h5 className="mb-3">Students per Course</h5>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={studentsData}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/*  CHARTS SECTION */}
      <Row className="mb-4">

        {/* PIE CHART */}
        <Col md={6}>
          <div className="p-3 bg-white shadow-sm rounded-4">
            <h5 className="mb-3">Course Status</h5>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* BAR CHART */}
        <Col md={6}>
          <div className="p-3 bg-white shadow-sm rounded-4">
            <h5 className="mb-3">Overview</h5>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="total" fill="#0d6efd" />
                <Bar dataKey="published" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

      </Row>

      {/* RECENT COURSES */}
      <div className="p-3 bg-white rounded-4 shadow-sm">
        <h5 className="mb-3">Recent Courses</h5>

        {courses.length === 0 ? (
          <p className="text-muted">No courses created yet.</p>
        ) : (
          courses.slice(0, 5).map(course => (
            <div
              key={course._id}
              className="d-flex justify-content-between border-bottom py-2"
            >
              <span>{course.title}</span>
              <span className="text-muted">
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}