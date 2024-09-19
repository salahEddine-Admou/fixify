import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { logoutUser, verifyUserDetails } from '../../store/auth/authActions';
import { Avatar, Badge, Button, Dropdown } from 'antd';
import AuthModal from '../auth/AuthModal';
import { logo } from '../../assets';
import { BellOutlined } from '@ant-design/icons';


export const DashboardNavbar = () => {
    const dispatch = useDispatch();
    const { user, accessToken, refreshToken, role } = useSelector((state) => state.auth);
    const capitalizedFirstLetter = user ? user.charAt(0).toUpperCase() : '';
    const [open, setOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const location = useLocation();
    // Access the pathname property of location to get the current route path
    const currentPath = location.pathname;

    const isDashboard = location.pathname.includes('dashboard');

    useEffect(() => {
        console.log(currentPath);
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(currentScrollPos <= prevScrollPos || currentScrollPos < 50);// Show navbar if at top of page or scrolling up
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);


    useEffect(() => {
        if (accessToken) {
            dispatch(verifyUserDetails());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logoutHandler = () => {
        dispatch(logoutUser({ user, refreshToken }));
    };

    const showModal = () => {
        setOpen(true);
    };

    const items = [
        {
            label: <NavLink className="no-underline" onClick={logoutHandler}>
                Se deconnecter
            </NavLink>,
            key: '0',
        },
        {
            label: <NavLink to={role == "admin" ? "/admin/dashboard" : "/client/dashboard"}>{role == "admin" ? "Dashboard" : "Profile"}</NavLink>,
            key: '1',
        },


    ];

    return (
        <>
            <header className="bg-white text-blue-500  flex  w-full z-2  items-center shadow-sm p-2  justify-start">


                <ul className='ml-auto flex items-center justify-around'>

                    {user && (
                        <>
                            
                            <li className="mr-4">
                                <Dropdown menu={{ items }} trigger={['click']} >
                                    <a className='cursor-pointer bg-blue-500 flex items-center text-white rounded-full pl-2 pr-4 py-1' onClick={(e) => e.preventDefault()}>
                                        <Avatar className='h-7 w-7 mr-2'>{role == "admin" ? "A" : capitalizedFirstLetter}</Avatar> <span  >{user.charAt(0).toUpperCase() + user.slice(1)}</span>
                                    </a>
                                </Dropdown>

                            </li>
                        </>

                    )}

                </ul >

            </header >
            <AuthModal open={open} setOpen={setOpen} />
        </>
    );
};