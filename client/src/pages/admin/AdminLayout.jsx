import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
    const { isAdmin, loading, user } = useContext(AppContext);

    if (loading) {
        return <h2>Loading...</h2>
    }
    if (!isAdmin || !user) {
        toast.error("User not logged in or Authorized to access this")
        return <Navigate to='/' />
    }
    return (
        <div >
            <Navbar />
            <hr />
            <Sidebar />
        </div>
    )
}

export default AdminLayout