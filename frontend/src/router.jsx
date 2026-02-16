import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeamManagement from "./pages/AdminTeamManagement";
import MapView from "./pages/MapView";
import JobPage from "./pages/JobPage";
import BookingsPage from "./pages/BookingsPage";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import SupervisorTeamMonitor from "./pages/SupervisorTeamMonitor";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import AuthRedirect from "./auth/AuthRedirect";
import Terms from "./pages/terms";
import ProtectedRoute from "./auth/ProtectedRoute";
import SupervisorLayout from "./layouts/SupervisorLayout";
import TechnicianLayout from "./layouts/TechnicianLayout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },

  {
    path: "/terms",
    element: <Terms />,
  },

  // -------------------------
  // ADMIN (protected)
  // -------------------------
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "team", element: <AdminTeamManagement /> },
      { path: "map", element: <MapView /> },
      { path: "jobs/:jobId", element: <JobPage /> },
      { path: "bookings", element: <BookingsPage /> },
    ],
  },

  // -------------------------
  // SUPERVISOR (protected)
  // -------------------------
{
  path: "/supervisor",
  element: (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <SupervisorLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <SupervisorDashboard /> },
    { path: "team", element: <SupervisorTeamMonitor /> },
    { path: "map", element: <MapView /> },
    { path: "jobs/:jobId", element: <JobPage /> },
    { path: "bookings", element: <BookingsPage /> },
  ],
},

  // -------------------------
  // TECHNICIAN (protected)
  // -------------------------
{
  path: "/technician",
  element: (
    <ProtectedRoute allowedRoles={["technician"]}>
      <TechnicianLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <TechnicianDashboard /> },
    { path: "jobs/:jobId", element: <JobPage /> },
  ],
},

  // -------------------------
  // PUBLIC ROUTES
  // -------------------------
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
