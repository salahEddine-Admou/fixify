import {
    AppstoreOutlined,
    CarOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    ToolOutlined,
    UserOutlined,
    ShakeOutlined,
} from '@ant-design/icons';
import { Button, Menu, Slider } from 'antd'
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react'
import { logo } from '../../assets';
import { NavLink, useLocation } from 'react-router-dom';

const SupportSidebar = () => {
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
        getItem('Appareils', 'appareils', <ShakeOutlined />, [
            getItem(<NavLink className="no-underline" to="/support/categoryModel">Category</NavLink>,
                '/support/category',
                <UserOutlined />),

            getItem(<NavLink className="no-underline" to="/support/marques">
                Marque
            </NavLink>, '/support/make', <ToolOutlined />),

            getItem(<NavLink className="no-underline" to="/support/models">
                Model
            </NavLink>, '/support/model', <QuestionCircleOutlined />),

            getItem(<NavLink className="no-underline" to="/support/problems">
                Type Probleme
            </NavLink>, '/support/problems', <QuestionCircleOutlined />),



        ]),
        getItem('Personnel', 'personnel', <UserOutlined />, [
            getItem(<NavLink className="no-underline" to="/admin/repairer">
                Reparateur
            </NavLink>, '/admin/repairer', <ToolOutlined />),
            getItem(<NavLink className="no-underline" to="/admin/livreurs">
                Livreur</NavLink>, '/admin/livreurs', <QuestionCircleOutlined />),
        ]),
        getItem('Option 3', '3', <ContainerOutlined />),
        getItem('Navigation One', 'sub1', <MailOutlined />, [
            getItem('Option 5', '5'),
            getItem('Option 6', '6'),
            getItem('Option 7', '7'),
            getItem('Option 8', '8'),
        ]),
        getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10'),
            getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
        ]),
    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    return (
        <Sider
            collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
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

export default SupportSidebar