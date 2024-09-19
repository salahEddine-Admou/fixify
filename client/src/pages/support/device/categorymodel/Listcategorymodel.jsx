import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../../../layouts/AdminLayout';
import { Button, Breadcrumb, Input, Space, Table, Modal, Form, Popconfirm, Dropdown, Menu, message } from 'antd';
import { DownOutlined, EllipsisOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { createCategoryModel, deleteCategoryModel, getAllCategoriesModel, updateCategoryModel } from '../../../../store/dashboard/category/CategoryModelAction';
import { useDispatch, useSelector } from 'react-redux';
import categoryModelApi from '../../../../api/categoryModelApi';
import { errorToast,successToast } from '../../../../utils';



const CategoryModelList = () => {
    const { categories, loading } = useSelector((state) => state.category);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [name,setName]=useState(null);

    const checkNameAvailability = (rule, value) => {
        console.log(name);
        if (!value) {
            return Promise.resolve();
        }
        if(!editMode){
            return categoryModelApi.checkName({name:value,description:""})
            .then(response => {
                return Promise.resolve();
            })
            .catch(error => {
                return Promise.reject('Name is already taken');
            });
        }else{
            if(name.trim()!==value.trim()){
                return categoryModelApi.checkName({name:value,description:""})
                .then(response => {
                    return Promise.resolve();
                })
                .catch(error => {
                    return Promise.reject('Name is already taken');
                });
            }
            return Promise.resolve();
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

    const handleShowEditModal = (category) => {
        setShowAddModal(true);
        setCategoryId(category.id);
        setEditMode(true);
        form.setFieldsValue(category);
        setName(category.name);
        setName(category.name);
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

    const menu = (category) => (
        <Menu>
            <Menu.Item key="1">
                <span onClick={() => handleShowEditModal(category)}>Modifier</span>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
                    onConfirm={() => handleDelete(category.id)}
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
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (text, category) => (
                <Dropdown overlay={() => menu(category)} trigger={['click']}>
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
        setShowAddModal(true);
        setEditMode(false);
    };

    useEffect(() => {
        dispatch(getAllCategoriesModel());
    }, [dispatch]);

    const tableData = categories.map((category, key) => ({
        key: key,
        id: category.id,
        name: category.name,
        description: category.description,
    }));

    const handleCancel = () => {
        setShowAddModal(false);
        form.resetFields();
        form.resetFields();
    };

    const handleDelete = (id) => {
        dispatch(deleteCategoryModel(id));
    };

    return (
        <AdminLayout>
            {contextHolder}
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
                                    <span>Liste des catégories</span>
                                </>
                            ),
                        },
                    ]}
                />
                <Button onClick={handleShowAddModal} className="ml-auto" type="primary">
                    Ajouter Catégorie
                </Button>
            </div>
            <div className='mt-3'>
                <Table columns={columns} dataSource={tableData} loading={loading} pagination={{ pageSize: 8 }} />
            </div>
            <Modal
                visible={showAddModal}
                title={editMode ? "Modifier Catégorie" : "Ajouter Catégorie"}
                okText={editMode ? "Modifier" : "Ajouter"}
                confirmLoading={loading}
                cancelText="Annuler"
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            if (editMode) {
                                dispatch(updateCategoryModel({ categoryModelData: values, id: categoryId })).unwrap()
                                    .then(() => {
                                        setShowAddModal(false)
                                        form.resetFields();
                                    })
                            } else {
                                dispatch(createCategoryModel(values)).unwrap()
                                    .then(() => {
                                        setShowAddModal(false)
                                        form.resetFields();
                                    })
                            }

                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        hasFeedback
                        name="name"
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de la catégorie' }, {validator:checkNameAvailability}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Veuillez entrer la description de la catégorie' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
};

export default CategoryModelList;