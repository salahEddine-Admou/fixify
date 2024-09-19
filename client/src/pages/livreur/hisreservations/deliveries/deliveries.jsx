import React, { useState, useEffect } from 'react';
import { Col, Form, InputNumber, Modal, Row, Select, Space, Table, Empty, Switch, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActivation } from '../../../../store/dashboard/livreur/livreurAction';

const Deliveries = ({ showPopup, setShowPopup, reservation, onSuccess }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [localDeliveries, setLocalDeliveries] = useState(reservation.deliveries || []);

    useEffect(() => {
        setLocalDeliveries(reservation.deliveries || []);
    }, [reservation.deliveries]);

    const switchActiveStyles = {
        backgroundColor: '#198754',
        borderColor: '#198754',
    };
    const switchInactiveStyles = {
        backgroundColor: '#dc3545',
        borderColor: '#dc3545',
    };

    const handleCancel = () => {
        setShowPopup(false);
        form.resetFields();
    };

    const handleToggleActivation = async ({ mode, id }) => {
        try {
            await dispatch(toggleActivation({ mode, id })).unwrap();
            setLocalDeliveries(prevDeliveries =>
                prevDeliveries.map(delivery =>
                    delivery.id === id ? { ...delivery, status: mode === 1 } : delivery
                )
            );
            onSuccess();
        } catch (err) {
            console.log("Error", err);
        }
    };

    const columns = [
        {
            title: 'Username de livreur',
            dataIndex: 'livreur',
            key: 'livreur',
            render: (livreur) => livreur.username,
        },
        {
            title: 'DeliveryStatus',
            dataIndex: 'deliveryType',
            key: 'deliveryType',
        },
        {
            title: 'Type',
            dataIndex: 'deliveryType',
            key: 'deliveryType',
            render: (text) => text === 'FromClientToRepairer' ? 'Aller' : text === 'FromRepairerToClient' ? 'Retour' : text,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                record.livreur.username.toLowerCase() === localStorage.getItem('user').toLowerCase() ?
                    <Switch
                        onChange={(checked) => handleToggleActivation({ mode: checked ? 1 : 0, id: record.id })}
                        checked={record.status}
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        style={record.status ? switchActiveStyles : switchInactiveStyles}
                    />
                    : <></>
            ),
        },
    ];

    return (
        <Modal
            open={showPopup}
            title={"La reservation:" + reservation.ref}
            onCancel={handleCancel}
            width={900}
            okButtonProps={{ style: { display: 'none' } }}
        >
            <Form form={form} layout="vertical">
                {localDeliveries && localDeliveries.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={localDeliveries}
                        rowKey="id"
                        pagination={false}
                    />
                ) : (
                    <Empty description="Aucune livraison disponible" />
                )}
            </Form>
        </Modal>
    );
}

export default Deliveries;
