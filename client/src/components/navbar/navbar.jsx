import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { logoutUser, verifyUserDetails } from '../../store/auth/authActions';
import { Avatar, Button, Dropdown, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import AuthModal from '../auth/AuthModal';
import { logo } from '../../assets';

export const Navbar = () => {
    const dispatch = useDispatch();
    const { user, accessToken, refreshToken, role } = useSelector((state) => state.auth);
    const capitalizedFirstLetter = user ? user.charAt(0).toUpperCase() : '';
    const [open, setOpen] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    const isDashboard = location.pathname.includes('admin');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(currentScrollPos <= prevScrollPos || currentScrollPos < 50);
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
    }, [accessToken, dispatch]);

    const logoutHandler = () => {
        setDrawerVisible(false)
        dispatch(logoutUser({ user, refreshToken }));
    };

    const showModal = () => {
        setOpen(true);
        setDrawerVisible(false)
    };

    const items = [
        {
            label: <NavLink className="no-underline" onClick={logoutHandler}>
                Se deconnecter
            </NavLink>,
            key: '0',
        },
        {
            label: <NavLink onClick={() => setDrawerVisible(false)} to={role === "admin" ? "/admin/dashboard" : role === "support" ? "/support/dashboard" : role === "repairer" ? "/repairer/dashboard" : role === "livreur" ? "/livreur/dashboard" : "/client/dashboard"}>
                {role === "admin" ? "Dashboard" : role === "support" ? "Support Dashboard" : role === "repairer" ? "Repairer Dashboard" : role === "livreur" ? "Livreur Dashboard" : "Profile"}
            </NavLink>,
            key: '1',
        },
    ];

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <>
            <header className={`${(currentPath == "/") ? visible ? prevScrollPos > 50 ? 'bg-white text-blue-500 translate-y-0' : 'bg-transparent text-white' : "-translate-y-full " : currentPath.includes("front") ? "bg-gray-50 text-blue-500 " : "bg-gray-50 text-blue-500 ml-[0px]"} flex fixed w-full z-20 items-center shadow-sm p-2 justify-between`}>
                <NavLink to="/" className="ml-3">
                    <img src={logo} className="w-auto h-10 bg-white p-2 rounded-full" alt="" />
                </NavLink>

                <div className="hidden md:flex ml-auto items-center justify-around">
                    <ul className="flex items-center space-x-4">
                        <li><NavLink className="no-underline font-medium" to='/'>Accueil</NavLink></li>
                        <li><NavLink className="no-underline font-medium" to='/blog'>Guides</NavLink></li>

                        <li><NavLink className="no-underline font-medium" to='/about'>A propos</NavLink></li>
                    </ul>
                    {user ? (
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <a className="cursor-pointer bg-blue-500 flex items-center text-white rounded-full pl-2 pr-4 py-1 ml-4">
                                <Avatar className='h-7 w-7 mr-2'>{role === "admin" ? "A" : capitalizedFirstLetter}</Avatar>
                                <span>{user.charAt(0).toUpperCase() + user.slice(1)}</span>
                            </a>
                        </Dropdown>
                    ) : (
                        <Button className="ml-4 bg-blue-500 text-white font-medium rounded-md" onClick={showModal}>
                            Se connecter
                        </Button>
                    )}
                </div>

                <span className={`md:hidden cursor-pointer pr-2 `} onClick={toggleDrawer} >
                    <MenuOutlined className={` text-2xl  ${(currentPath == "/") ? visible && prevScrollPos > 50 ? ' text-blue-500 ' : "text-white" : currentPath.includes("front") && " text-blue-500 "}`} />
                </span>

                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={toggleDrawer}
                    visible={drawerVisible}
                >
                    <ul className="space-y-4 pl-0">
                        <li><NavLink onClick={() => setDrawerVisible(false)} className="no-underline font-medium" to='/'>Accueil</NavLink></li>
                        <li><NavLink onClick={() => setDrawerVisible(false)} className="no-underline font-medium" to='/blog'>Guides</NavLink></li>
                        <li><NavLink onClick={() => setDrawerVisible(false)} className="no-underline font-medium" to='/about'>A propos</NavLink></li>
                        {user ? (
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <a className="cursor-pointer bg-blue-500 flex items-center text-white rounded-full pl-2 pr-4 py-1">
                                    <Avatar className='h-7 w-7 mr-2'>{role === "admin" ? "A" : capitalizedFirstLetter}</Avatar>
                                    <span>{user.charAt(0).toUpperCase() + user.slice(1)}</span>
                                </a>
                            </Dropdown>
                        ) : (
                            <Button className="bg-blue-500 text-white font-medium rounded-md w-full" onClick={showModal}>
                                Se connecter
                            </Button>
                        )}
                    </ul>
                </Drawer>
            </header>
            <AuthModal open={open} setOpen={setOpen} />
        </>
    );
};
