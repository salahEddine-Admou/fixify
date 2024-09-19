import React, { useEffect, useState,useRef } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Input, Space, Modal, Divider, Image, Table, Popconfirm, Switch, Dropdown, Menu } from 'antd'
import { HomeOutlined,SearchOutlined, EditOutlined,CheckOutlined,CloseOutlined, DeleteOutlined, EyeOutlined,UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import AdminLayout from '../../../../../layouts/AdminLayout';
import { getAllLivreur, deleteLivreur } from '../../../../../api/LivreurApi';
import Highlighter from 'react-highlight-words';
import LivreurApi from '../../../../../api/LlivreurApi';
import { successToast } from '../../../../../utils';
import { useDispatch, useSelector } from 'react-redux';


const ListLivreur = () => {
    const [livreurs, setLivreurs] = useState([]);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const switchActiveStyles = {
        backgroundColor: '#198754', // Green background color when checked
        borderColor: '#198754', // Green border color when checked
    };
    const switchInctiveStyles = {
        backgroundColor: '#dc3545', // Green background color when checked
        borderColor: '#dc3545', // Green border color when checked
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
    const handleToggleActivation = async ({ mode, id }) => {
        try {
            if(mode){
                await LivreurApi.activate(id);
                await fetchLivreurs();
                successToast('compte est activer')
            }else{
                await LivreurApi.desactivate(id);
                await fetchLivreurs();
                successToast('compte est désactiver')
            }
        } catch (err) {
            console.log("Error", err);
        }
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

    const fetchLivreurs = async () => {
        try {
            let data = await getAllLivreur();
            data = data.map((livreur, key) => ({
                key: key,
                id: livreur.id,
                username: livreur.username,
                cin:livreur.cin,
                firstname: livreur.firstName,
                lastname: livreur.lastName,
                rib: livreur.rib,
                gender: livreur.gender ? <Badge status="success" text="Homme" /> : <Badge status="success" text="Femme" />,
                address: livreur.address ? livreur.address : <Badge status="error" text="Non défini" />,
                city: livreur.city,
                email: livreur.email,
                active:livreur.active,
                profilePic: livreur.imageProfile ? <img className="w-[40px] h-[40px] object-cover rounded-full" src={livreur.imageProfile} alt="" /> : <Avatar size="large" icon={<UserOutlined />} />,
            }));
            setLivreurs(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
       
        fetchLivreurs();
    }, []);

    

    const columns = [
        {
            title: 'Profile',
            dataIndex: 'profilePic',
            align: 'center',
            width: 80,
            render: (profilePic) => (
                <Avatar src={profilePic} size="large" icon={<UserOutlined />} />
            )
        },
        {
            title: 'Username',
            dataIndex: 'username',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Prénom',
            dataIndex: 'firstname',
            render: (firstname) => (
                <span>{firstname}</span>
            )
        },
        {
            title: 'Nom',
            dataIndex: 'lastname',
            render: (lastname) => (
                <span>{lastname}</span>
            )
        },
        {
            title: 'CIN',
            dataIndex: 'cin',
        },
        {
            title: 'Rib',
            dataIndex: 'rib',
            key: 'rib',
            width: 170
        },
        {
            title: 'Genre',
            dataIndex: 'gender',
            render: (gender) => (
                <span>{gender}</span>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: (address) => (
                <span>{address}</span>
            )
        },
        {
            title: 'Ville',
            dataIndex: 'city',
            render: (city) => (
                <span>{city}</span>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width:180,
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <>
                   <Switch
                       onChange={(checked) => handleToggleActivation({ mode: checked ? 1 : 0, id: record.id })}
                        checked={record.active}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        style={record.active ? switchActiveStyles : switchInctiveStyles}
                    /> 
                </>
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
                                    <span>Liste des livreurs</span>
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={livreurs}
                    scroll={{ x: 1300 }}
                    pagination={{ pageSize: 8 }}
                    bordered
                />
            </div>
        </AdminLayout>
    );
};

export default ListLivreur;
