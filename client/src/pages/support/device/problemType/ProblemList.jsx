import React, { useEffect, useRef, useState } from 'react'
import Adminlayout from '../../../../layouts/AdminLayout'
import { Badge, Breadcrumb, Dropdown, Input, Menu, Space, Table, Modal, Form, Select, Button, Popconfirm } from 'antd'
import { DownOutlined, EllipsisOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons'
import { create, getAll, update, remove } from '../../../../store/dashboard/problemType/problemTypeAction'
import { useDispatch, useSelector } from 'react-redux'
import Highlighter from 'react-highlight-words'
import ProblemTypeApi from '../../../../api/ProblemTypeApi'

const ProblemList = () => {
    const { problems, loading } = useSelector((state) => state.problemType);
    const [showAddModal, setshowAddModal] = useState(false)
    const [editmode, seteditmode] = useState(false)
    const [problemId, setproblemId] = useState(0)
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState('');

    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [name,setName]=useState(null);
    const [categoryId2,setCategoryId]=useState(null);

    const checkNameAvailability = async (rule, value) => {
        console.log("rah kaytchiki")
        if (!value) {
            return Promise.resolve();
        }
        const categoryId = form.getFieldValue('categoryId');
        if (!categoryId) {
            return Promise.reject('Sélectionnez une catégorie d\'abord');
        }
        try {
            if (!editmode) {
                await ProblemTypeApi.checkName(categoryId,{name:value,description:""});
            } else {
                console.log(name.trim() !== value.trim() && categoryId2 !== categoryId)
                if (name.trim() !== value.trim() || categoryId2 !== categoryId) {
                    await ProblemTypeApi.checkName(categoryId,{name:value,description:""});
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

    const handleShowEditModal = (problem) => {
        setName(problem.name)
        setCategoryId(problem.categoryId)
        setshowAddModal(true)
        setproblemId(problem.id)
        seteditmode(true)
        console.log(problem);
        form.setFieldsValue(problem)
    }

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
    const handleDelete = (id) => {
        dispatch(remove(id));
    }
    const handleCategoryChange = (value) => {
        form.setFieldsValue({ categoryId: value });
        form.validateFields(['name']);
    };

   
    const menu = (problem) => (
        <Menu>
            <Menu.Item key="1">
                <span onClick={() => handleShowEditModal(problem)}  >Modifier</span>
            </Menu.Item>
            <Menu.Item key="2">
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => handleDelete(problem.id)}

                    okText="Yes"
                    cancelText="No"
                >
                    <span >Suprimer</span>
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
            fixed: 'right', // Fix the column on the left side
            render: (text, problem) => (

                <Dropdown overlay={() => menu(problem)} trigger={['click']}>
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
        setshowAddModal(true)
        seteditmode(false)

    }
    useEffect(() => {
        dispatch(getAll())
        const fetchCategories = async () => {
            const fetchedCategories = await ProblemTypeApi.getAllCategories();
            const filteredData = fetchedCategories.data.filter(deviceType => deviceType.name.toLowerCase() !== 'autre');
            setCategories(filteredData);
        };
        fetchCategories();
    }, [dispatch])

  
   


    const tableData = problems.map((problem, key) => ({
        key: key,
        id: problem.id,
        name: problem.name,
        description: problem.description,
        category: <Badge status="success" text={problem.category} />,
        categoryId: problem.categoryId
    }));

    const handleCancel = () => {
        
        setshowAddModal(false)
        form.resetFields();
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
                                    <span>Liste des probleme</span>
                                </>
                            ),
                        },

                    ]}
                />
                <button onClick={handleShowAddModal} className="no-underline btn btn-sm btn-primary text-white ml-auto">
                    Ajouter probleme
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
                title={editmode ? "Modifier probleme" : "Ajouter probleme"}
                okText={editmode ? "Modifier" : "Ajouter"}
                confirmLoading={loading}
                cancelText="Cancel"
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(async values => {
                            console.log("vlues", values);
                            if (editmode) {
                                await checkNameAvailability();
                                dispatch(update({ problem: values, id: problemId })).unwrap()
                                    .then(() => {
                                        setshowAddModal(false)
                                        form.resetFields();
                                    })
                            } else {
                                await checkNameAvailability();
                                dispatch(create(values)).unwrap()
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
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select 
                        placeholder="Select a category"
                        onChange={handleCategoryChange}
                         
                        >
                            {categories.map(category => (
                                <Select.Option key={category} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        hasFeedback
                        label="Nom"
                        rules={[{ required: true, message: 'Please enter the name' },{validator:checkNameAvailability}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter the description' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    
                </Form>
            </Modal>
        </Adminlayout>
    )
}

export default ProblemList