import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function BaseLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
