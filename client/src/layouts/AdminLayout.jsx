import React from 'react'

import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { DashboardNavbar } from '../components/navbar/DashboardNavbar';
import Sidebar from '../components/sidebar/Sidebar';
import { useSelector } from 'react-redux';
import SupportSidebar from '../components/sidebar/SupportSidebar';
import RepairerSidebar from '../components/sidebar/RepairerSidebar';
import LivreurSidebar from '../components/sidebar/LivreurSidebar';
import ClientSidebar from '../components/sidebar/ClientSidebar';


const Adminlayout = ({ children }) => {
    const { role } = useSelector((state) => state.auth);

    return (
        <div >
            <DashboardNavbar />
            {
                role === "admin" ? <Sidebar /> :
                    role === "support" ? <SupportSidebar /> :
                        role === "repairer" ? <RepairerSidebar /> :
                            role === "livreur" ? <LivreurSidebar /> :
                                role === "client" && <ClientSidebar />
            }

            <div className="p-3 bg-gray-100 body ml-[75px]">
                <div className=' bg-white rounded-lg h-fit p-3'>
                    {children}
                </div>

            </div>
        </div>
    );
}

export default Adminlayout