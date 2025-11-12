import { useAuth } from "@/providers/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = () => {
    const { authenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;