import { Navigate } from 'react-router-dom';
import { authService } from '../services/api.service';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
