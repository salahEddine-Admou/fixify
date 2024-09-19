import React, { useEffect, useRef, useState } from 'react';
import Adminlayout from '../../../../../layouts/AdminLayout';
import { Badge, Breadcrumb, Dropdown, Input, Menu, Space, Table, Modal, Form, Select, Button, Popconfirm } from 'antd';
import { DownOutlined, EllipsisOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { createSubCategory, deleteSubCategory, getAllSubCategories, } from '../../../../../store/dashboard/subCategory/subCategoryAction'
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import SubCategoryApi from '../../../../../api/subCategoryApi';
import { createModel, getAllModel, deleteModel, updateModel } from '../../../../../store/dashboard/model/ModelAction';
import PricePopup from './price-popup/PricePopup';
import ModelApi from '../../../../../api/ModelAPI';
import PriceCsvPopup from './price-csv-popup/PriceCsvPopup';

const ModelList = () => {
    const { models, loading } = useSelector((state) => state.model);
    const { role } = useSelector((state) => state.auth);
    const [showAddModal, setshowAddModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false)

    const [isCsvModalVisible, setIsCsvModalVisible] = useState(false);

    const showCsvModal = () => {
        setIsCsvModalVisible(true);
    };

    const handleCloseCsv = () => {
        setIsCsvModalVisible(false);
    };

    const [model, setModel] = useState(0)
    const [editmode, seteditmode] = useState(false);
    const [modelId, setModelId] = useState(0);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [subcategories, setsubCategories] = useState([]);
    const [name, setName] = useState(null);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const checkNameAvailability = async (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        try {
            if (!editmode) {
                await ModelApi.checkName({ name: value, description: "" });
            } else {
                if (name.trim() !== value.trim()) {
                    await ModelApi.checkName({ name: value, description: "" });
                }
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('Nom déjà pris');
        }
    };


    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    const handleShowEditModal = (model) => {
        setName(model.name);
        setshowAddModal(true);
        setModelId(model.id);
        console.log(model);
        seteditmode(true);
        form.setFieldsValue(model);
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

    const handleShowPriceModal = (model$) => {
        setModel(model$)
        setShowPriceModal(true)

    }
    const menu = (model) => (
        <Menu>
            {
                role == "admin" ?
                    <>
                        <Menu.Item onClick={() => handleShowEditModal(model)} key="1">
                            <span >Modifier</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Popconfirm
                                title="Supprimer le model?"
                                onConfirm={() => handleDelete(model.id)}
                                okText="oui"
                                cancelText="Non"
                            >
                                <span>Supprimer</span>
                            </Popconfirm>
                        </Menu.Item>
                    </>
                    : <Menu.Item onClick={() => handleShowPriceModal(model)} key="0">
                        <span >Tarification</span>
                    </Menu.Item>
            }


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
            title: 'Marque',
            dataIndex: 'subcategory',
            width: 200,
        },
        {
            title: 'Categorie',
            dataIndex: 'category',
            width: 200,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, model) => (
                <Dropdown overlay={() => menu(model)} trigger={['click']}>
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
        setshowAddModal(true);
        seteditmode(false);
    };


    useEffect(() => {
        dispatch(getAllModel());
        const fetchsubCategories = async () => {
            const fetchedCategories = await SubCategoryApi.getAll();
            setsubCategories(fetchedCategories.data);
        };
        fetchsubCategories();
    }, [dispatch]);


    const tableData = models ? models.map((model, key) => ({
        key: key,
        id: model.id,
        name: model.name,
        description: model.description,
        subcategory: <Badge status="success" text={model.subCategory} />,
        category: model.category,
        subcategoryId: model.subCategoryId,
    })) : [];


    const handleCancel = () => {
        setshowAddModal(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteModel(id));
    };



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
                                    {
                                        role == "support" ? <span>Liste des modeles</span> : <span>Les tarifs</span>
                                    }

                                </>
                            ),
                        },
                    ]}
                />
                <div className="ml-auto">
                    {role == "admin" &&
                        <button onClick={handleShowAddModal} className="no-underline mr-2 btn btn-sm btn-primary text-white ">
                            Ajouter le model
                        </button>
                    }


                    <button className="no-underline btn btn-sm btn-success text-white " onClick={showCsvModal}>
                        Importer tarifs
                    </button>
                </div>

                <PriceCsvPopup visible={isCsvModalVisible} onClose={handleCloseCsv} />
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </div>
            {
                <Modal
                    open={showAddModal}
                    title={editmode ? "Modifier model" : "Ajouter model"}
                    okText={editmode ? "Modifier" : "Ajouter"}
                    confirmLoading={loading}
                    cancelText="Annuler"
                    onCancel={handleCancel}
                    onOk={() => {
                        form
                            .validateFields()
                            .then(values => {
                                if (editmode) {
                                    dispatch(updateModel({ Model: values, id: modelId })).unwrap()
                                        .then(() => {
                                            console.log(values);
                                            setshowAddModal(false)
                                            form.resetFields();
                                        })
                                } else {
                                    dispatch(createModel(values)).unwrap()
                                        .then(() => {
                                            setshowAddModal(false)
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
                            name="name"
                            label="Nom"
                            rules={[{ required: true, message: 'Veuillez entrer le nom' }, { validator: checkNameAvailability }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Veuillez entrer la description' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="subcategoryId"
                            label="Marque"
                            rules={[{ required: true, message: 'Sélectionner une catégorie' }]}
                        >
                            <Select
                                placeholder="Sélectionner une catégorie"

                            >
                                {subcategories.map(subcategory => (
                                    <Select.Option key={subcategory.id} value={subcategory.id}>
                                        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}></span>
                                        {subcategory.name}
                                        <Badge
                                            count={subcategory.category}
                                            style={{ backgroundColor: 'blue', marginLeft: 8 }}
                                        />
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            }
            {
                showPriceModal && <PricePopup showPopup={showPriceModal} setShowPopup={setShowPriceModal} model={model} />
            }


        </Adminlayout >
    );
};

export default ModelList;