import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, Button, Table, message, Badge, Popconfirm, Dropdown, Menu, Avatar, Input, Space } from 'antd';
import { HomeOutlined, EditOutlined, DeleteOutlined, DownOutlined, EllipsisOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../../layouts/AdminLayout';
import { getAllSupportsTechnique, deleteSupportTechnique } from '../../../../../api/supportTechniqueApi';
import Highlighter from 'react-highlight-words';

const ListSupport = () => {
    const [supports, setSupports] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchSupports = async () => {
            try {
                let data = await getAllSupportsTechnique();
                data = data.map((support, key) => ({
                    key: key,
                    id: support.id,
                    profilePic:support.imageProfile ? <img className='w-[40px] h-[40px] object-cover rounded-full' src={support.imageProfile} alt="" /> : <Avatar size="large" className='mr-2' icon={<UserOutlined />} />,
                    username: support.username,
                    firstname: support.firstName,
                    lastname: support.lastName,
                    gender: support.gender ? <Badge status="success" text="Homme" /> : <Badge status="success" text="Femme" />,
                    address: support.address,
                    city: support.city,
                    email: support.email,
                }));
                setSupports(data);
            } catch (error) {
                console.log(error);
                message.error("Une erreur s'est produite lors de la récupération des supports techniques.");
            }
        };
        fetchSupports();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSupportTechnique(id);
            message.success("Le support technique a été supprimé avec succès.");
            setSupports(prevSupports => prevSupports.filter(support => support.id !== id));
        } catch (error) {
            message.error("Une erreur s'est produite lors de la suppression du support technique.");
        }
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

    const menu = (record) => (
        <Menu>
            <Menu.Item key="1">
                <NavLink to={`/admin/support/edit/${record.id}`}>Modifier</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce support technique ?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <span>Supprimer</span>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profilePic',
            align: 'center',
            width: 80,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Prénom',
            dataIndex: 'firstname',
        },
        {
            title: 'Nom',
            dataIndex: 'lastname',
        },
        {
            title: 'Genre',
            dataIndex: 'gender',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Ville',
            dataIndex: 'city',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 220,
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Dropdown overlay={() => menu(record)} trigger={['click']}>
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
                            title: (
                                <>
                                    <span>List support</span>
                                </>
                            ),
                        },
                    ]}
                />
                <NavLink className="no-underline btn btn-sm btn-primary text-white ml-auto" to="/admin/support/create">
                    Ajouter support
                </NavLink>
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={supports}
                    scroll={{ x: 1300 }}
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </AdminLayout>
    );
};

export default ListSupport;
