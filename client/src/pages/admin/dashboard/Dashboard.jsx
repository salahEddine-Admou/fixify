import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../../../components/navbar/navbar';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, ToolOutlined, CarOutlined } from '@ant-design/icons';
import { DashboardNavbar } from '../../../components/navbar/DashboardNavbar';
import Adminlayout from '../../../layouts/AdminLayout';
import { Layout, Menu, Card, Row, Col, Statistic, List, Avatar } from 'antd';
import { Line, Pie, Bar, Area, Column, Scatter } from '@ant-design/charts';
import AuthApi from '../../../api/AuthApi';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalClients: 0, totalRepairers: 0, totalDeliveryPersons: 0 });
  const [reservationStats, setReservationStats] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [topRepairer, setTopRepairers] = useState([]);
  const [reservationsByCity, setReservationsByCity] = useState([]);


  const fetchStats = async () => {
    try {
      const response = await AuthApi.getStats();
      console.log(response.data)
      setStats(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };
  const fetchReservationStats = async () => {
    try {
      const response = await AuthApi.getReservationByCategory();
      setReservationStats(response.data);
    } catch (error) {
      console.error('There was an error fetching the reservation data!', error);
    }
  };
  const fetchTopClients = async () => {
    try {
      const response = await AuthApi.getTopFiveClien();
      console.log('Top Clients:', response.data);
      setTopClients(response.data);
    } catch (error) {
      console.error('There was an error fetching the top clients data!', error);
    }
  };

  const fetchTopRepairers = async () => {
    try {
      const response = await AuthApi.getTopFiveRepairer();
      console.log('Top Repairers:', response.data);
      setTopRepairers(response.data);
    } catch (error) {
      console.error('There was an error fetching the top repairers data!', error);
    }
  };
  const fetchReservationsByCity = async () => {
    try {
      const response = await AuthApi.getReservationByCity();
      const data = Object.keys(response.data).map(key => ({
        city: key,
        reservations: response.data[key]
      }));
      setReservationsByCity(data);
    } catch (error) {
      console.error('There was an error fetching the reservation data by city!', error);
    }
  };



  useEffect(() => {
    fetchStats();
    fetchReservationStats();
    fetchTopClients();
    fetchTopRepairers();
    fetchReservationsByCity();
  }, []);

  const pieConfig = {
    appendPadding: 10,
    data: reservationStats,
    angleField: 'reservationCount',
    colorField: 'category',
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{name} ({percentage})',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: {
        formatter: (datum) => (datum ? datum.category : 'Total'),
      },
      content: {
        formatter: (datum) => (datum ? datum.reservationCount : ''),
      },
    },
  };


  const columnConfig = {
    data: reservationsByCity,
    xField: 'city',
    yField: 'reservations',
    seriesField: 'city',
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
                title="Nombre de Clients"
                value={stats.totalClients}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8} xs={24} sm={12} md={8} style={{ marginTop: 16 }}>
            <Card style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
              <Statistic
                title="Nombre de Réparateurs"
                value={stats.totalRepairers}
                prefix={<ToolOutlined />}
              />
            </Card>
          </Col>
          <Col span={8} xs={24} sm={12} md={8} style={{ marginTop: 16 }}>
            <Card style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
              <Statistic
                title="Nombre de Livreurs"
                value={stats.totalDeliveryPersons}
                prefix={<CarOutlined />}
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
                  <List.Item >
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
            <Card title="Top Repairers" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={topRepairer}
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
                      title={item.username}
                      description={`Nombre de réservations: ${item.reservationCount}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12} xs={24} sm={12} md={12} style={{ marginTop: 16 }}>
            <Card title="Statistiques de Réservations par Categorie" bordered={false}>
              <Pie {...pieConfig} />
            </Card>
          </Col>
          <Col span={12} xs={24} sm={12} md={12} style={{ marginTop: 16 }}>
            <Card title="Réservations par Ville" bordered={false}>
              <Column {...columnConfig} />
            </Card>
          </Col>
        </Row>

      </div>
    </Adminlayout>
  )
}



export default Dashboard;