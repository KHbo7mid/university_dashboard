import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function RoleBasedRedirect() {
    const { user } = useAuth();
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/teacher'} replace />;
}