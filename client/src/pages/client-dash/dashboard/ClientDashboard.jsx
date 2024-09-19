import React from 'react'
import { Navbar } from '../../../components/navbar/navbar'
import { Breadcrumb } from 'antd'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { DashboardNavbar } from '../../../components/navbar/DashboardNavbar'
import Adminlayout from '../../../layouts/AdminLayout'

const ClientDashboard = () => {
    return (
        <Adminlayout>
            <Breadcrumb
                items={[
                    {
                        href: '',
                        title: <HomeOutlined />,
                    },
                    {
                        href: '',
                        title: (
                            <>
                                <span>Dashboard</span>
                            </>
                        ),
                    },

                ]}
            />
            <div className='mt-3'>
                Dahboard
            </div>
        </Adminlayout>
    )
}



export default ClientDashboard