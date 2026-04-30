import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Courses from "../pages/public/Courses";
import CourseDetails from "../pages/public/CourseDetails";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail"
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import InstructorLayout from "../pages/instructor/InstructorLayout";
import AddLesson from "../pages/instructor/AddLesson";
import EditCourse from "../pages/instructor/EditCourse";
import Profile from "../pages/common/Profile"

// Not Found Page
import NotFound from "../pages/common/NotFound";


// Student
import MyCourses from "../pages/student/MyCourses";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentLayout from "../pages/student/StudentLayout";
import CourseLearning from "../pages/student/CourseLearning";


// Instructor
import CreateCourse from "../pages/instructor/CreateCourse";
import ManageInstructorCourses from "../pages/instructor/ManageCourses";

// Admin
import ManageUsers from "../pages/admin/ManageUsers";
import AdminLayout from "../pages/admin/AdminLayout";
import ManageCourses from "../pages/admin/ManageCourses";

// Protected Route
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminAnalytics from "../pages/admin/AdminAnalytics";

const AppRoutes = () => {
  return (
    <Routes>
      {/*  PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["student", "instructor", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/*  STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
      </Route>

      <Route
        path="/student/course/:id"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseLearning />
          </ProtectedRoute>
        }
      />

      {/*  INSTRUCTOR */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="courses" element={<ManageInstructorCourses />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="courses/:id/add-lesson" element={<AddLesson />} />
        <Route path="courses/edit/:id/" element={<EditCourse />} />

      </Route>

      {/*  ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route index element={<ManageUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="manageCourses" element={<ManageCourses />} />
      </Route>

{/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;