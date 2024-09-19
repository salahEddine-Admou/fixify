import {
    AppstoreOutlined,
    CarOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    CustomerServiceOutlined,
    ToolOutlined,
    UserOutlined,
    BookOutlined,
    
    ShakeOutlined,
    SnippetsOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Button, Menu, Slider } from 'antd'
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react'
import { logo } from '../../assets';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true);

    let location = useLocation();
    const [current, setCurrent] = useState(
        location.pathname === "/" || location.pathname === ""
            ? "/dashboard"
            : location.pathname,
    );
    //or simply use const [current, setCurrent] = useState(location.pathname)        

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
        getItem('Personnel', 'personnel', <UserOutlined />, [
            getItem(<NavLink className="no-underline" to="/admin/clients">Clients</NavLink>,
                '/admin/clients',
                <UserOutlined />),
            getItem(<NavLink className="no-underline" to="/admin/repairer">
                Reparateur
            </NavLink>, '/admin/repairer', <ToolOutlined />),
            getItem(<NavLink className="no-underline" to="/admin/livreurs">
                Livreur</NavLink>, '/admin/livreurs', <CarOutlined />),

        ]),

        getItem(<NavLink className="no-underline" to="/admin/testimonial/create">
            Client Testimonial
        </NavLink>, '/admin/testimonial/create', <CustomerServiceOutlined />),



        getItem('Appareils', 'appareils', <ShakeOutlined />, [
            getItem(<NavLink className="no-underline" to="/support/categoryModel">Category</NavLink>,
                '/support/category',
                <QuestionCircleOutlined />),

            getItem(<NavLink className="no-underline" to="/support/marques">
                Marque
            </NavLink>, '/support/make', <QuestionCircleOutlined />),

            getItem(<NavLink className="no-underline" to="/support/models">
                Model
            </NavLink>, '/support/model', <QuestionCircleOutlined />),

            getItem(<NavLink className="no-underline" to="/support/problems">
                Type Probleme
            </NavLink>, '/support/problems', <QuestionCircleOutlined />),

        ]),

        getItem(<NavLink className="no-underline" to="/admin/reservations">
            Reservations</NavLink>, '/admin/reservations', <QuestionCircleOutlined />),
        
        getItem(<NavLink className="no-underline" to="/admin/guides">
            Guides</NavLink>, '/admin/guides', <BookOutlined />),
        getItem(<NavLink className="no-underline" to="/admin/reservations">
            Reservations</NavLink>, '/admin/reservations', <SnippetsOutlined />),
        getItem(<NavLink className="no-underline" to="/admin/otherReservation">
            Demandes</NavLink>, '/admin/otherReservation', <ClockCircleOutlined />),



    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    return (
        <Sider
            collabsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
            width={200}
            className='bg-white fixed top-0 shadow-sm  z-10 text h-[110vh] overflow-y-scroll'
        >
            <span

                onClick={toggleCollapsed}
                style={{
                    marginBottom: 16,
                }}
                className={`p-2  text-xl text-blue-500 mt-[2px] block align-middle cursor-pointer ${collapsed ? "text-center mt-2" : "float-right mr-2"}`}
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            {
                !collapsed && <NavLink to="/" ><img src={logo} className="mt-3 block  mb-5 w-auto h-14 m-auto bg-white  p-2 rounded-full animate__animated animate__fadeIn" alt="" /></NavLink>
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
        </Sider >
    )
}

export default Sidebar