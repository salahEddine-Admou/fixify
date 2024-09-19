import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Input, Space, Table, Switch } from 'antd';
import { HomeOutlined, SearchOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import Adminlayout from '../../../../../layouts/AdminLayout';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { getAll, toggleActivation } from '../../../../../store/dashboard/client/clientAction';

const ClientList = () => {
    const { clients, loading } = useSelector((state) => state.client);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const switchActiveStyles = {
        backgroundColor: '#198754',
        borderColor: '#198754',
    };
    const switchInactiveStyles = {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profil',
            key: 'profil',
            width: 100,
            render: (text, record) => (
                record.imageProfile
                ? <img className='w-[40px] h-[40px] object-cover rounded-full' src={record.imageProfile} alt="" />
                : <Avatar size="large" className='mr-2' icon={<UserOutlined />} />
            )
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
        },
        {
            title: 'Email verifie',
            dataIndex: 'emailVerified',
            key: 'emailVerified',
            render: (text) => (
                text
                ? <Badge status="success" text="Verifie" />
                : <Badge status="error" text="Non verifie" />
            )
        },
        {
            title: 'Addresse',
            dataIndex: 'address',
            key: 'address',
            render: (text) => (
                text
                ? text
                : <Badge status="error" text="Non definie" />
            )
        },
        {
            title: 'Total Reservations',
            dataIndex: 'totalReservations',
            key: 'totalReservations',
            align: 'center',
            render: (text, record) => {
                return record.size || 0;
            }
        },
        {
            title: 'Total Reclamations',
            dataIndex: 'totalReclamations',
            key: 'totalReclamations',
            align: 'center',
        },
        {
            title: 'Total commandes',
            dataIndex: 'totalOrders',
            key: 'totalOrders',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                <Switch
                    checked={record.active}
                    onChange={(checked) => handleToggleActivation({ mode: checked ? 1 : 0, id: record.id })}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    style={record.active ? switchActiveStyles : switchInactiveStyles}
                />
            ),
        },
    ];

    const handleToggleActivation = ({ mode, id }) => {
        dispatch(toggleActivation({ mode, id }))
            .unwrap()
            .catch((err) => {
                console.log("Error", err);
            });
    };

    useEffect(() => {
        dispatch(getAll());
    }, [dispatch]);

    const tableData = clients.map((client, key) => ({
        key: key,
        id: client.id,
        imageProfile: client.imageProfile,
        username: client.username,
        email: client.email,
        address: client.address,
        emailVerified: client.emailVerified,
        totalReclamations: client.totalReclamations,
        totalOrders: client.totalOrders,
        active: client.active,
        reservations: client.reservations, // Ajoutez la liste des réservations pour chaque client
    }));

    return (
        <Adminlayout>
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
                                    <span>Liste des clients</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    scroll={{
                        x: 1400,
                    }}
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </Adminlayout>
    );
};

export default ClientList;
