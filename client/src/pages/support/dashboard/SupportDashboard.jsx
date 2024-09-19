import React from 'react'
import { Breadcrumb } from 'antd'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import Adminlayout from '../../../layouts/AdminLayout'

const SupportDashboard = () => {

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
                SupportDashboard
            </div>
        </Adminlayout>
    )
}



export default SupportDashboard