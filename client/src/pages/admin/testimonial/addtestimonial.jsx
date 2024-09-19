import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Form, Breadcrumb, Space, Table, Modal, Popconfirm, Dropdown, Menu } from 'antd';
import { HomeOutlined, DownOutlined, EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../../layouts/AdminLayout';
import testimonialApi from '../../../api/testimonialApi';
import { getAllTestimonials, createTestimonial, deleteTestimonial, updateTestimonial } from '../../../store/testimonial/testimonialAction';

const AjouterTemoignage = () => {
    const { testimonials, loading } = useSelector((state) => state.testimonial);
    const [showAddTestimonial, setShowAddTestimonial] = useState(false);
    const [editTestimonial, setEditTestimonial] = useState(false);
    const [testimonialId, setTestimonialId] = useState(0);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [title, setTitle] = useState(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleShowEditModal = (testimonial) => {
        setShowAddTestimonial(true);
        setTestimonialId(testimonial.id);
        setEditTestimonial(true);
        form.setFieldsValue(testimonial);
        setTitle(testimonial.title);
    };

    const menu = (testimonial) => (
        <Menu>
            <Menu.Item key="1">
                <span onClick={() => handleShowEditModal(testimonial)}>Modifier</span>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce témoignage ?"
                    onConfirm={() => handleDelete(testimonial.id)}
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
            title: 'Titre',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Nom complet',
            dataIndex: 'fullName', // Assurez-vous que les noms de propriétés sont cohérents
        },
        {
            title: 'Emploi',
            dataIndex: 'job', // Assurez-vous que les noms de propriétés sont cohérents
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (text, testimonial) => (
                <Dropdown overlay={() => menu(testimonial)} trigger={['click']}>
                    <span className='cursor-pointer'>
                        <EllipsisOutlined className='text-blue-500 text-lg' />
                        <DownOutlined className='text-blue-500 ml-1' />
                    </span>
                </Dropdown>
            ),
        },
    ];

    const handleShowAddModal = () => {
        form.resetFields();
        setShowAddTestimonial(true);
        setEditTestimonial(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteTestimonial(id));
    };

    useEffect(() => {
        dispatch(getAllTestimonials());
    }, [dispatch]);

    const tableData = testimonials.map((testimonial, key) => ({
        key: key,
        id: testimonial.id,
        title: testimonial.title,
        description: testimonial.description,
        fullName: testimonial.fullName, // Assurez-vous que les noms de propriétés sont cohérents
        job: testimonial.job, // Assurez-vous que les noms de propriétés sont cohérents
    }));

    const handleCancel = () => {
        setShowAddTestimonial(false);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                if (editTestimonial) {
                    dispatch(updateTestimonial({ testimonialData: values, id: testimonialId })).unwrap()
                        .then(() => {
                            setShowAddTestimonial(false);
                            form.resetFields();
                        });
                } else {
                    testimonialApi.add(values)
                        .then(() => {
                            setShowAddTestimonial(false);
                            form.resetFields();
                            dispatch(getAllTestimonials()); // Met à jour la liste des témoignages après l'ajout
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'ajout du témoignage:', error);
                        });
                }
            })
            .catch(info => {
                console.log('Validation échouée:', info);
            });
    };

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
                            title: <span>Liste des témoignages</span>,
                        },
                    ]}
                />
                <Button onClick={handleShowAddModal} className="ml-auto" type="primary">
                    Ajouter Témoignage
                </Button>
            </div>
            <div className='mt-3'>
                <Table columns={columns} dataSource={tableData} loading={loading} pagination={{ pageSize: 8 }} />
            </div>
            <Modal
                visible={showAddTestimonial}
                title={editTestimonial ? "Modifier Témoignage" : "Ajouter Témoignage"}
                okText={editTestimonial ? "Modifier" : "Ajouter"}
                confirmLoading={loading}
                cancelText="Annuler"
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        hasFeedback
                        name="title"
                        label="Titre"
                        rules={[
                            { required: true, message: 'Veuillez entrer le titre du témoignage' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Veuillez entrer la description du témoignage' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="fullName"
                        label="Nom complet"
                        rules={[{ required: true, message: 'Veuillez entrer le nom complet du témoignage' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="job"
                        label="Emploi"
                        rules={[{ required: true, message: 'Veuillez entrer le poste' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
};

export default AjouterTemoignage;
