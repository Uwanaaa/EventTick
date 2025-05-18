import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSelector((state: any) => state.auth);
    return user.role === 'admin' ? children : <Navigate to="/home" replace />;
}

export default AdminRoute;