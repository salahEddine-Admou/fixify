import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Navbar } from '../navbar/navbar';
import Sidebar from '../sidebar/Sidebar';
import { useEffect } from 'react';
import { verifyToken } from '../../store/auth/authActions';

export const PrivateRoute = ({ component: Component, requiredRole, ...props }) => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (accessToken) {
      dispatch(verifyToken(accessToken));
    }
  }, [accessToken, dispatch]);

  // Check if the pathname includes the word "dashboard"
  const isDashboard = location.pathname.includes('admin') || location.pathname.includes('support') || location.pathname.includes('repairer') || location.pathname.includes('livreur') || location.pathname.includes('client');
  const userRole = localStorage.getItem('role');

  const hasRequiredRole = () => {
    return userRole && userRole === requiredRole;
  };

  return (
    <>
      {
        !isDashboard && <Navbar />
      }

      <div className={`wrapper ${!isDashboard && "mt-[60px]"}`}>
        {
          !user
            ? <Navigate to={{ pathname: '/', state: { from: props.location } }} replace />
            : requiredRole && !hasRequiredRole()
              ? <Navigate to={{ pathname: '/', state: { from: props.location } }} replace />
              : <Component {...props} />
        }
      </div>
    </>
  );
};
