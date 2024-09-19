import React, { useEffect, useRef, useState } from 'react';
import { Button, Avatar, Image, Breadcrumb, Input, Space, Table, Modal, Form, Popconfirm, Dropdown, Menu, Switch, Badge } from 'antd';
import { CheckOutlined, CloseOutlined, DownOutlined, EllipsisOutlined, FileTextOutlined, HomeOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { getAll, makeSuccess, notResolved } from '../../../store/front/reservationAction';
import Adminlayout from '../../../layouts/AdminLayout';
import GenInvoiceModal from './gen-invoice-modal/GenInvoiceModal';
const ReservationList = () => {
    const { user, role } = useSelector((state) => state.auth);
    const { reservations, loading } = useSelector((state) => state.reservation);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [showInvoiceModal, setShowInvoiceModal] = useState(false)

    const [reservation, setReservation] = useState(0)
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
    useEffect(() => {
        dispatch(getAll({ username: user, role }));
    }, [dispatch]);


    const tableData = reservations.map((reservation, key) => ({
        key: key,
        id: reservation.id,
        ref: reservation.ref,
        date: reservation.date,
        reparateur: reservation.reparateur,
        client: reservation.client,
        livreur: reservation.livreur,
        address: reservation.address,
        phone: reservation.phone,
        model: reservation.model,
        problem: reservation.probleme,
        price: reservation.price,
        success: reservation.success,
        imgReservations: reservation.imgReservations && reservation.imgReservations.length > 0 ? reservation.imgReservations : null,
        invoices: reservation.invoices,
        resolvable: reservation.resolvable,
        dStatus: reservation.trackStatus,
    }));

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

    const handleShowInvoiceModal = (reservation) => {
        setReservation(reservation)
        setShowInvoiceModal(true)
    }

    const handleNonResolved = (reservation) => {

        dispatch(notResolved(reservation.id))
    }

    const handleToggleSuccess = ({ mode, id }) => {
        // alert(id)
        if (mode) {
            dispatch(makeSuccess(id))
        }
    }

    const menu = (reservation) => (
        <Menu>
            {role == "admin" &&
                < Menu.Item onClick={() => handleShowInvoiceModal(reservation)} key="0">
                    <span ><FileTextOutlined className='mr-2' />
                        {reservation.invoices.length > 0 ? "Voir la facture" : " Generer la facture"}
                    </span>
                </Menu.Item >

            }
            {
                (reservation.resolvable && role == "repairer") && <Menu.Item onClick={() => handleNonResolved(reservation)} key="1">
                    <span ><QuestionCircleOutlined className='mr-2' />
                        Non resolue
                    </span>
                </Menu.Item>
            }


        </Menu >
    );

    const columns = [

        {
            title: 'Ref',
            dataIndex: 'ref',
            key: 'ref',
            width: 100,
            ...getColumnSearchProps('ref'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 200,
            ...getColumnSearchProps('date'),
        },
        {
            title: 'Modele',
            dataIndex: 'model',
            key: 'model',
            width: 250,
            ...getColumnSearchProps('model'),
        },
        {
            title: 'Probleme',
            dataIndex: 'problem',
            key: 'problem',
            width: 150,
            ...getColumnSearchProps('problem'),
        },
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            width: 250,
            ...getColumnSearchProps('client'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: 250,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Image Reservation',
            width: 120,
            align: 'center',
            render: (text, record) => (
                <>
                    {
                        record.imgReservations && record.imgReservations.length ? (
                            <Image.PreviewGroup
                                preview={{
                                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                                }}
                            >
                                <Avatar.Group>
                                    {record.imgReservations[0] && (
                                        <Image
                                            className='h-10 w-10 object-cover rounded-circle'
                                            src={record.imgReservations[0].src}
                                        />
                                    )}
                                    {record.imgReservations[1] && (
                                        <Image
                                            className='h-10 w-10 object-cover rounded-circle'
                                            src={record.imgReservations[1].src}
                                        />
                                    )}
                                    {record.imgReservations[2] && (
                                        <Image
                                            className='h-10 w-10 object-cover rounded-circle'
                                            src={record.imgReservations[2].src}
                                        />
                                    )}
                                </Avatar.Group>
                            </Image.PreviewGroup>
                        ) : (
                            "No image"
                        )
                    }
                </>
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 250,
            render: (text, record) => (
                <div className="flex gap-3 justify-center">
                    {
                        (role == "repairer" && record.resolvable) ? <Switch
                            checked={record.success}
                            onChange={(checked) => handleToggleSuccess({ mode: checked ? 1 : 0, id: record.id })}
                            checkedChildren={<CheckOutlined />} // Icon when checked
                            unCheckedChildren={<CloseOutlined />} // Icon when unchecked
                            style={record.success ? switchActiveStyles : switchInctiveStyles} // Apply custom styles when checked
                        /> : null
                    }
                    {
                        !record.success &&
                            role == "repairer" ? record.resolvable ?
                            <Dropdown overlay={() => menu(record)} trigger={['click']}>
                                <span className='cursor-pointer'>
                                    <EllipsisOutlined className='text-blue-500 text-lg' />
                                    <DownOutlined className='text-blue-500 ml-1' />
                                </span>
                            </Dropdown> : "Non resolue " : role == "client" ? <span className='bg-blue-500 p-2 rounded-full w-[90%] text-xs fw-bolder text-white'>{record.dStatus}</span> :
                            <span className='cursor-pointer'>
                                <EllipsisOutlined className='text-blue-500 text-lg' />
                                <DownOutlined className='text-blue-500 ml-1' />
                            </span>

                    }

                </div>
            ),
        },
    ];


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
                                    <span>Liste des Reservations</span>
                                </>
                            ),
                        },
                    ]}
                />

            </div>
            <div className='mt-3'>
                <Table columns={columns} scroll={{
                    x: 1400,
                }} dataSource={tableData} loading={loading} pagination={{ pageSize: 8 }} />
            </div>

            <GenInvoiceModal setReservation={setReservation} showInvoiceModal={showInvoiceModal} setshowInvoiceModal={setShowInvoiceModal} reservation={reservation} />

        </Adminlayout>
    )
}

export default ReservationList