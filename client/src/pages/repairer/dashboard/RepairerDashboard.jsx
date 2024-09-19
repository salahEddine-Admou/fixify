import React, { useEffect, useRef, useState }  from 'react'
import { Breadcrumb } from 'antd'
import { HomeOutlined,UserOutlined,ToolOutlined, CheckCircleOutlined ,HourglassOutlined } from '@ant-design/icons'
import Adminlayout from '../../../layouts/AdminLayout'
import RepairerApi from '../../../api/repairerApi'
import { Layout, Menu, Card, Row, Col,Statistic,List,Avatar  } from 'antd'
import { Line, Pie, Bar, Area, Column, Scatter } from '@ant-design/charts'

const RepairerDashboard = () => {
    const [stats, setStats] = useState({ totalReservation :0,totalReservationSucces: 0, totalReservationNonSucces: 0 });
    const [topClients, setTopClients] = useState([]);
    const [reservationsByProblem, setReservationsByProblem] = useState([]);

    const fetchStats = async () => {
        try {
            const response = await RepairerApi.getStatsReservation(localStorage.getItem('user'));
            console.log(response.data)
            setStats(response.data);
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    const fetchTopClients = async () => {
        try {
            const response = await RepairerApi.getTopClientByRepairer(localStorage.getItem('user'));
            console.log('Top Clients:', response.data);
            setTopClients(response.data);
        } catch (error) {
            console.error('There was an error fetching the top clients data!', error);
        }
    };

    const fetchReservationsByProblem = async () => {
      try {
        const response = await RepairerApi.getReservationByProblem(localStorage.getItem('user'));
        console.log(response)
        setReservationsByProblem(response.data);
      } catch (error) {
        console.error('There was an error fetching the reservation data by city!', error);
      }
    };

    const columnConfig = {
      data: reservationsByProblem,
      xField: 'problem',
      yField: 'reservationCount',
      seriesField: 'problem',
      label: {
        position: 'top',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
    };

    useEffect(() => {
        fetchStats();
        fetchTopClients();
        fetchReservationsByProblem();
    }, []);


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
            <div className="site-layout-content">
                    <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={8} xs={24} sm={12} md={8} style={{ marginTop: 16 }}>
                    <Card style={{ backgroundColor: '#f0f2f5', borderColor: '#d9d9d9' }}>
                      <Statistic
                        title="Nombre des Résevartions"
                        value={stats.totalReservation}
                        prefix={<ToolOutlined /> }
                      />
                    </Card>
                  </Col>
                    <Col span={8} xs={24} sm={12} md={8} style={{ marginTop: 16 }}>
                        <Card style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                        <Statistic
                            title="Réservation complétée"
                            value={stats.totalReservationSucces}
                            prefix={<CheckCircleOutlined />}
                        />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} sm={12} md={8} style={{ marginTop: 16 }}>
                        <Card style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
                        <Statistic
                            title="Réservation en cours"
                            value={stats.totalReservationNonSucces}
                            prefix={<HourglassOutlined />}
                        />
                        </Card>
                    </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12} xs={24} sm={12} md={12} style={{ marginTop: 16 }}>
                    <Card title="Top Clients" bordered={false}>
                      <List
                        itemLayout="horizontal"
                        dataSource={topClients}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                item.imageProfile ? (
                                  <Avatar src={item.imageProfile} />
                                ) : (
                                  <Avatar size={30} icon={<UserOutlined />} />
                                )
                              }
                              title={item.name}
                              description={`Nombre de réservations: ${item.reservationCount}`}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={12} xs={24} sm={12} md={12} style={{ marginTop: 16 }}>
                    <Card title="Réservations par Problème" bordered={false}>
                      <Column {...columnConfig} />
                    </Card>
                  </Col>
                </Row>
             </div>
        </Adminlayout>
    )
}

export default RepairerDashboard