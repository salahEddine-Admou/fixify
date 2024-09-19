import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, Button, Table, message, Popconfirm, Dropdown, Menu, Input, Space } from 'antd';
import { HomeOutlined, DownOutlined, EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import AdminLayout from '../../../layouts/AdminLayout';
import ReservationApi from '../../../api/ReservationApi';

const ListReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = React.useRef(null);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const response = await ReservationApi.getAll();
                console.log(response)
                const mappedData = response.data.map((reservation, key) => ({
                    key: key,

                    Date: reservation.date,
                    reparateur: reservation.reparateur,
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
        fetchReservations();
    }, []);



    const columns = [

        {
            title: 'Date de réservation',
            dataIndex: 'Date',

        },
        {
            title: 'Nom du Reparateur',
            dataIndex: 'reparateur',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },

        {
            title: 'Phone',
            dataIndex: 'phone',
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
                            title: (
                                <>
                                    <span>List des reservations</span>
                                </>
                            ),
                        },
                    ]}
                />

            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={reservations}
                    scroll={{ x: 1300 }}
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </AdminLayout>
    );
};

export default ListReservation;








