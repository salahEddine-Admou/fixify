import {
    AppstoreOutlined,
    QuestionCircleOutlined,
    ToolOutlined,
    UserOutlined,
    ContainerOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    CloseOutlined,
    CheckOutlined,
    DollarCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Menu, Switch } from 'antd';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { logo } from '../../assets';
import RepairerApi from '../../api/repairerApi';
import { successToast, errorToast } from '../../utils';

const RepairerSidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [repairer, setRepairerInfo] = useState(null);

    const switchActiveStyles = {
        backgroundColor: '#198754',
        borderColor: '#198754',
    };
    const switchInctiveStyles = {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
    };

    let location = useLocation();
    const [current, setCurrent] = useState(
        location.pathname === "/" || location.pathname === ""
            ? "/dashboard"
            : location.pathname,
    );
    const fetchRepairer = async () => {
        try {
            const username = localStorage.getItem('user');
            console.log(username);
            if (username) {
                const response = await RepairerApi.getByUsername(username);
                const repairerData = response.data;
                setRepairerInfo(repairerData);
                console.log("Ha howa repairer", repairer);
            }
        } catch (error) {
            console.error('Error fetching repairer info:', error);
        }
    };

    useEffect(() => {


        if (location) {
            if (current !== location.pathname) {
                setCurrent(location.pathname);
            }
        }
        fetchRepairer();
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
        getItem(<NavLink className="no-underline" to="/repairer/dashboard">
            Dashboard
        </NavLink>, '/repairer/dashboard', <AppstoreOutlined />),

        getItem(<NavLink className="no-underline" to="/repairer/profile">
            Profile
        </NavLink>, '/repairer/profile', <UserOutlined />),

        getItem(<NavLink className="no-underline" to="/repairer/tarifs">
            Tarifs
        </NavLink>, '/repairer/tarifs', <DollarCircleOutlined />),

        getItem(<NavLink className="no-underline" to="/repairer/reservations">
            List des reservations
        </NavLink>, '/repairer/reservations', <CalendarOutlined />),
    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const handleAvailabilityChange = async (checked) => {
        if (repairer) {
            try {
                if (checked) {
                    await RepairerApi.Dispo(repairer.id);
                    successToast("Vous êtes maintenant disponible")

                } else {
                    await RepairerApi.NonDispo(repairer.id);
                    successToast("Vous êtes maintenant non disponible")
                }
                fetchRepairer();
            } catch (error) {
                console.error('Error updating availability:', error);
            }
        }
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
                className='bg-white relative'
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                items={items}
            />
            {
                !collapsed && <div className={`absolute bottom-[12%]  ${collapsed ? "left-[10px]" : "left-[45px]"}`} >


                    <Switch
                        checked={repairer && repairer.disonible}
                        checkedChildren="Disponible"
                        unCheckedChildren="Non dispo"
                        style={repairer && repairer.disonible ? switchActiveStyles : switchInctiveStyles}
                        onChange={handleAvailabilityChange}
                    />
                </div>
            }

        </Sider>
    );
};

export default RepairerSidebar;
