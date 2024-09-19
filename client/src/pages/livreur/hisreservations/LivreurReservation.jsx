import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Breadcrumb, Button, Input, Space, Table, Switch, Dropdown, Menu} from 'antd';
import { HomeOutlined, SearchOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import Adminlayout from '../../../layouts/AdminLayout';
import Highlighter from 'react-highlight-words';
import { EllipsisOutlined, DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservationsByLivreur } from '../../../store/dashboard/livreur/livreurAction';
import Deliveries from './deliveries/deliveries';


const LivreurReservation = () => {
    const { reservations, loading, error  } = useSelector((state) => state.livreur);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [reservation, setReservation] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [livreurId, setLivreurId]=useState(null);
    

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const handleShowDeliveriesModal = (res) => {
        setReservation(res)
        setShowModal(true)
    }
    const handleSuccess = async () => {
        const username = await localStorage.getItem('user');
        await dispatch(fetchReservationsByLivreur(username));
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
    const menu = (reservation) => (
        <Menu>
            <Menu.Item onClick={() => handleShowDeliveriesModal(reservation)} key="0" >
                <span >Deliveries</span>
            </Menu.Item>
        </Menu>
    );
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = await localStorage.getItem('user');
                await dispatch(fetchReservationsByLivreur(username));
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [dispatch]);
    
    
        

    const columns = [
        {
            title: 'Réparateur',
            dataIndex: 'reparateur',
            key: 'reparateur',
        },
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            ...getColumnSearchProps('client'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                    <Dropdown overlay={() => menu(record)} trigger={['click']}>
                        <span className='cursor-pointer'>
                            <EllipsisOutlined className='text-blue-500 text-lg' />
                            <DownOutlined className='text-blue-500 ml-1' />
                        </span>
                    </Dropdown>
            ),
        }
    ];

    return (
        <Adminlayout>
            <div className="flex items-center mb-4">
                <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Liste des réservations</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Table
                columns={columns}
                dataSource={reservations}
                loading={loading}
                pagination={{ pageSize: 8 }}
                scroll={{ x: 1000 }}
                rowKey="id"
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {
                showModal && <Deliveries reservation={reservation} setShowPopup={setShowModal} showPopup={showModal} onSuccess={handleSuccess} />
            }

        </Adminlayout>
    );

}
export default LivreurReservation