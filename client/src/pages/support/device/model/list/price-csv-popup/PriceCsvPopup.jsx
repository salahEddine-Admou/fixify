

import React, { useState } from 'react';
import { Modal, Upload, Button, message, Form, Input, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import AxiosClient from '../../../../../../api/axiosClient';
import { useSelector } from 'react-redux';

const PriceCsvPopup = ({ visible, onClose }) => {

    const { user } = useSelector((state) => state.auth);
    const [fileList, setFileList] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);


    const handleUpload = () => {
        if (fileList.length === 0) {
            message.error('Please select a file to upload.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', fileList[0]);
        formData.append('username', user);

        // Replace with your upload endpoint
        AxiosClient.post('/api/problem/tarifs/upload', formData)
            .then(response => {
                message.success('File uploaded successfully');
                setFileList([]);
                setUsername('');
                onClose();
            })
            .catch(error => {
                message.error('Failed to upload file');
                alert('error')
            })
            .finally(() => {
                setLoading(false);
            });
    };









    const uploadProps = {
        beforeUpload: file => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    return (
        <Modal
            visible={visible}
            title="Importer les tarifs "
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={loading}>
                    Annuler
                </Button>,
                <Button key="upload" type="primary" onClick={handleUpload} loading={loading}>
                    Importer
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <Form>

                    <Form.Item required>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />} disabled={loading}>Selectioner votre fichier (.xlsx)</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};


export default PriceCsvPopup;
