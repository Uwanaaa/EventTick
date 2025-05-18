import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useSelector((state: any) => state.auth);
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;