import {
    AppstoreOutlined,
    QuestionCircleOutlined,
    ToolOutlined,
    UserOutlined,
    ContainerOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { logo } from '../../assets';

const LivreurSidebar = () => {
    const [collapsed, setCollapsed] = useState(true);

    let location = useLocation();
    const [current, setCurrent] = useState(
        location.pathname === "/" || location.pathname === ""
            ? "/dashboard"
            : location.pathname,
    );

    useEffect(() => {
        if (location) {
            if (current !== location.pathname) {
                setCurrent(location.pathname);
            }
        }
    }, [location, current]);

    function handleClick(e) {
        setCurrent(e.key);
    }

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = [
        getItem(<NavLink className="no-underline" to="/livreur/dashboard">
            Dashboard
        </NavLink>, '/livreur/dashboard', <CalendarOutlined />),
        getItem(<NavLink className="no-underline" to="/livreur/reservation">
            Votre Reservation
        </NavLink>, '/livreur/reservation', <ContainerOutlined />),
        getItem(<NavLink className="no-underline" to="/livreur/newReservation">
            New Reservation
        </NavLink>, '/livreur/newReservation', <CalendarOutlined />),

    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Sider
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={200}
            className='bg-white fixed top-0 shadow-sm z-10 text h-[110vh] overflow-y-scroll'
        >
            <span
                onClick={toggleCollapsed}
                style={{ marginBottom: 16 }}
                className={`p-2  text-xl text-blue-500 mt-[2px] block align-middle cursor-pointer ${collapsed ? "text-center mt-2" : "float-right mr-2"}`}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            {
                !collapsed && <NavLink to="/"><img src={logo} className="mt-3 block mb-5 w-auto h-14 m-auto bg-white p-2 rounded-full animate__animated animate__fadeIn" alt="" /></NavLink>
            }
            <Menu
                onClick={handleClick}
                selectedKeys={[current]}
                mode="inline"
                className='bg-white'
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                items={items}
            />
        </Sider>
    );
};

export default LivreurSidebar;
