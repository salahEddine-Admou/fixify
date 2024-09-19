import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Dropdown, Menu } from 'antd';
import { HomeOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import AdminLayout from '../../../layouts/AdminLayout';
import ReservationApi from '../../../api/ReservationApi';
import ReservationPopup from './reservationPopup/reservationPopup';

const OtherReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reservationModal, setReservationModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleReservationModal = (reservation) => {
        setSelectedReservation(reservation);
        setReservationModal(true);
    }

    const menu = (reservation) => (
        <Menu>
            <Menu.Item onClick={() => handleReservationModal(reservation)} key="0">
                <span>Affectation</span>
            </Menu.Item>
        </Menu>
    );

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await ReservationApi.getAllReservationProblemOther();
            const mappedData = response.data.map((reservation, key) => ({
                key: key,
                ref: reservation.ref,
                Date: reservation.date,
                client: reservation.client,
                model: reservation.model,
                address: reservation.address,
                phone: reservation.phone,
            }));
            setReservations(mappedData);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Une erreur s'est produite lors de la récupération des réservations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
       
        fetchReservations();
    }, []);

    const columns = [
        {
            title: 'Ref',
            dataIndex: 'ref',
        },
        {
            title: 'Date de réservation',
            dataIndex: 'Date',
        },
        {
            title: 'Client',
            dataIndex: 'client',
        },
        {
            title: 'Model',
            dataIndex: 'model',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, reservation) => (
                <Dropdown overlay={() => menu(reservation)} trigger={['click']}>
                    <span className='cursor-pointer'>
                        <EllipsisOutlined className='text-blue-500 text-lg' />
                        <DownOutlined className='text-blue-500 ml-1' />
                    </span>
                </Dropdown>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="flex items-center">
                <Breadcrumb
                    items={[
                        {
                            href: '',
                            title: <HomeOutlined />,
                        },
                        {
                            href: '',
                            title: <span>List des reservations</span>,
                        },
                    ]}
                />
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={reservations}
                    loading={loading}
                    scroll={{ x: 1300 }}
                    pagination={{ pageSize: 8 }}
                />
            </div>
            {reservationModal && selectedReservation && (
                <ReservationPopup 
                    showPopup={reservationModal} 
                    setShowPopup={setReservationModal} 
                    reservation={selectedReservation} 
                    fetchReservations={fetchReservations}
                />
            )}
        </AdminLayout>
    );
};

export default OtherReservation;
