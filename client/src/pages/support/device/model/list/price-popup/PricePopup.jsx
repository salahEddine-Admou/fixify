import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import AxiosClient from '../../../../../../api/axiosClient';
import ProblemTypeApi from '../../../../../../api/ProblemTypeApi';
import { getPrices } from '../../../../../../store/dashboard/model/ModelAction';
import toast from 'react-hot-toast';

const PricePopup = ({ showPopup, setShowPopup, model }) => {
    const { prices } = useSelector((state) => state.model);
    const { user } = useSelector((state) => state.auth);
    const [selectedProbs, setselectedProbs] = useState([])
    const [loading, setloading] = useState(false)
    const [rows, setRows] = useState([]);
    const [problems, setproblems] = useState([])

    const [form] = Form.useForm();
    const dispatch = useDispatch()
    // const handleProblemChange = (selectedProblemId, currentIndex) => {
    //     // Filter out the selected problem from the other selects


    //     alert(selectedProblemId)
    //     const filteredProblems = problems.filter((problem) => problem.id !== selectedProblemId);
    //     setproblems(filteredProblems)

    //     // Update the state or handle the filteredProblems as needed
    // };
    const handleAddRow = () => {
        const newRow = { problemType: null, price: null };
        setRows([...rows, newRow]);
    };

    useEffect(() => {

        const fetchProblems = async () => {
            const problems = await (await ProblemTypeApi.getByModel(model.id)).data
            console.log("probs", problems);
            setproblems(problems)
        }
        dispatch(getPrices({ modelId: model.id, user })).unwrap()
            .then(() => {
                fetchProblems()
                form.resetFields()
            })

    }, [])

    useEffect(() => {
        setselectedProbs(prices)
        if (prices.length === 0)
            setRows([{ problemType: null, price: null }])
        else
            setRows([])
    }, [prices.length])




    console.log("prices", prices);

    const handleCancel = () => {
        setShowPopup(false)

    }
    const handleRemoveRow = (indexToRemove) => {

        const updatedRows = rows.filter((row, index) => index !== indexToRemove);
        form.setFieldsValue({
            [`problemType-${indexToRemove + (prices.length)}`]: null,
            [`price-${indexToRemove + (prices.length)}`]: null
        })
        setRows(updatedRows);

    };
    const handleSelectChange = (value, index, nameInput) => {
        selectedProbs.map(prob => {
            if (prob.problemType == value) {
                toast.error("ce probleme est deja definie")
                form.setFieldsValue({
                    [nameInput]: null
                })

            }
            else {

                const fieldValue = form.getFieldValue(nameInput);
                let updatedProbs = selectedProbs.filter(prob => prob.problemType !== fieldValue)
                updatedProbs = [...updatedProbs, { problemType: value }]
                setselectedProbs(updatedProbs)

            }

        })
    }
    return (

        <Modal
            open={showPopup}
            title={"Tarification  pour " + model.name.toUpperCase()}
            okText={"Ajouter"}
            confirmLoading={loading}
            cancelText="Annuler"
            onCancel={handleCancel}
            width={700}
            onOk={async () => {
                setloading(true)
                try {

                    const values = await form
                        .validateFields()
                    console.log("values", values);
                    await ProblemTypeApi.createPrices(values, model.id, user)
                    dispatch(getPrices(model.id))
                    setShowPopup(false)
                    setloading(false)

                    toast.success('Les prix ajoutes avec succes');

                } catch (error) {
                    alert("err")
                    console.log(error);
                    setloading(false)

                }



            }}

        >
            <Form form={form} layout="vertical"  >
                {prices.map((price, index) => (
                    <Row gutter={24} key={index} className='items-center'>
                        <Col xs={24} sm={12}>
                            <label className='font-semibold' htmlFor={`problemType-${index}`}>Probleme</label>

                            <Form.Item

                                name={`problemType-${index}`}
                                initialValue={price.problemType}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner votre probleme!',
                                    },
                                ]}
                            >
                                <Select placeholder="Sélectionner un genre" onChange={(value) => handleSelectChange(value, index, `problemType-${index}`)} >
                                    {problems.map(problem => (
                                        <Select.Option key={problem.id} value={problem.id}  >
                                            {problem.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={10}>
                            <label className='font-semibold' htmlFor={`price-${index}`}>Prix</label>

                            <Form.Item

                                name={`price-${index}`}
                                hasFeedback
                                initialValue={price.price}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer le prix!',
                                    },
                                    // {
                                    //     type: 'number',
                                    //     message: 'Veuillez entrer un nombre prix!',
                                    // },
                                ]}
                            >
                                <Input

                                    prefix="(Mad)"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                ))}
                {rows.map((row, index) => (
                    <Row gutter={24} key={index} className='items-center'>
                        <Col xs={24} sm={12}>
                            <label className='font-semibold' htmlFor={`problemType-${index + (prices.length)}`}>Probleme</label>

                            <Form.Item
                                name={`problemType-${index + (prices.length)}`}

                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner votre probleme!',
                                    },
                                ]}
                            >
                                <Select placeholder="Sélectionner un probleme" onChange={(value) => handleSelectChange(value, index, `problemType-${index + (prices.length)}`)} >
                                    {problems.map(problem => (
                                        <Select.Option key={problem.id}  >
                                            {problem.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={10}>
                            <label className='font-semibold' htmlFor={`price-${index + (prices.length)}`}>Prix</label>
                            <Form.Item
                                name={`price-${index + (prices.length)}`}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez entrer votre adresse!',
                                    },
                                ]}

                            >
                                <InputNumber
                                    prefix="(mad)"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={2}>
                            <MinusCircleOutlined className="dynamic-delete-button text-red-500" onClick={() => handleRemoveRow(index)} />
                        </Col>

                    </Row>
                ))}
            </Form>
            {
                ((prices.length < problems.length) && (rows.length < (problems.length - prices.length))) && <Space>
                    <button className='btn btn btn-outline-primary rounded-circle p-2 w-8 h-8 flex items-center' onClick={handleAddRow} >
                        <PlusOutlined />
                    </button>
                </Space>
            }


        </Modal>
    )
}

export default PricePopup