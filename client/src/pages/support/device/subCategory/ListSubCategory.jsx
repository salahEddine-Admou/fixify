import React, { useEffect, useRef, useState } from 'react';
import Adminlayout from '../../../../layouts/AdminLayout';
import { Badge, Breadcrumb, Dropdown, Input, Menu, Space, Table, Modal, Form, Select, Button, Popconfirm } from 'antd';
import { DownOutlined, EllipsisOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { createSubCategory, deleteSubCategory, getAllSubCategories, updateSubCategory } from '../../../../store/dashboard/subCategory/subCategoryAction';
import { useDispatch, useSelector } from 'react-redux';
import Highlighter from 'react-highlight-words';
import SubCategoryApi from '../../../../api/subCategoryApi';

const SubCategoryList = () => {
    const { subCategories, loading } = useSelector((state) => state.subCategory);
    const [showAddModal, setshowAddModal] = useState(false);
    const [editmode, seteditmode] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState(0);
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [name,setName]=useState(null);
    const [categoryId2,setCategoryId]=useState(null);

    const checkNameAvailability = async (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        const categoryId = form.getFieldValue('categoryId');
        if (!categoryId) {
            return Promise.reject('Sélectionnez une catégorie d\'abord');
        }
        try {
            if (!editmode) {
                await SubCategoryApi.checkName(categoryId,{name:value,description:""});
            } else {
                console.log(name.trim() !== value.trim() && categoryId2 !== categoryId)
                if (name.trim() !== value.trim() || categoryId2 !== categoryId) {
                    await SubCategoryApi.checkName(categoryId,{name:value,description:""});
                }
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject('Nom déjà pris pour cette catégorie');
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


    const handleShowEditModal = (subCategory) => {
        setName(subCategory.name);
        setCategoryId(subCategory.categoryId)
        setshowAddModal(true);
        setSubCategoryId(subCategory.id);
        console.log(subCategory);
        seteditmode(true);
        form.setFieldsValue(subCategory);
        const selectedCategory = categories.find(category => category.id === subCategory.categoryId);
        form.setFieldsValue({ categoryId: selectedCategory.id });
       
    };
    const handleCategoryChange = (value) => {
        form.setFieldsValue({ categoryId: value });
        form.validateFields(['name']);
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


    const menu = (subCategory) => (
        <Menu>
            <Menu.Item key="1">
                <span onClick={() => handleShowEditModal(subCategory)}>Modifier</span>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                    title="Supprimer la marque?"
                    onConfirm={() => handleDelete(subCategory.id)}
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
            width: 100,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
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
            render: (text, subCategory) => (
                <Dropdown overlay={() => menu(subCategory)} trigger={['click']}>
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
        dispatch(getAllSubCategories());
        const fetchCategories = async () => {
            const {data} = await SubCategoryApi.getAllCategories();
            const filteredData = data.filter(deviceType => deviceType.name.toLowerCase() !== 'autre');
            setCategories(filteredData);
        };
        fetchCategories();
    }, [dispatch]);


    const tableData = subCategories.map((subCategory, key) => ({
        key: key,
        id: subCategory.id,
        name: subCategory.name,
        description: subCategory.description,
        category: <Badge status="success" text={subCategory.category} />,
        categoryId: subCategory.categoryId,
    }));


    const handleCancel = () => {
        setshowAddModal(false);
        form.resetFields();
    };


    const handleDelete = (id) => {
        dispatch(deleteSubCategory(id));
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
                                    <span>Liste des marques</span>
                                </>
                            ),
                        },
                    ]}
                />
                <button onClick={handleShowAddModal} className="no-underline btn btn-sm btn-primary text-white ml-auto">
                    Ajouter Marque
                </button>
            </div>
            <div className='mt-3'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                />
            </div>
            <Modal
                open={showAddModal}
                title={editmode ? "Modifier marque" : "Ajouter marque"}
                okText={editmode ? "Modifier" : "Ajouter"}
                confirmLoading={loading}
                cancelText="Annuler"
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(async values => {
                            if (editmode) {
                                await checkNameAvailability();
                                dispatch(updateSubCategory({ subCategoryData: values, id: subCategoryId })).unwrap()
                                    .then(() => {
                                        setshowAddModal(false)
                                        form.resetFields();
                                    })
                            } else {
                                await checkNameAvailability();
                                dispatch(createSubCategory(values)).unwrap()
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
                        name="categoryId"
                        label="Category"
                        rules={[{ required: true, message: 'Sélectionner une catégorie' }]}
                    >
                        <Select
                            placeholder="Sélectionner une catégorie"
                            onChange={handleCategoryChange}
                        >
                            {categories.map(category => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        hasFeedback
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer le nom' },{validator:checkNameAvailability}]}
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
                    
                </Form>
            </Modal>
        </Adminlayout>
    );
};

export default SubCategoryList;
