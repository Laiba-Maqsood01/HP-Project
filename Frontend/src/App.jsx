import AppNavbar from "./components/layouts/AppNavbar";
import AppFooter from "./components/layouts/AppFooter";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"

function App() {
  const location = useLocation();

  const hideFooterRoutes = ["/admin", "/instructor", "/student"];

  const hideFooter = hideFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <AppNavbar />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <main>
        <AppRoutes />
      </main>

      {!hideFooter && <AppFooter />}
    </>
  );
}

export default App;