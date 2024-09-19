import React, { useState, useEffect } from 'react'
import { Col, Form, InputNumber, Modal, Row, Select, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getModelsByProblemId, assignProblemsToRepairer, getReparations, deleteRepationsByIdRepairer } from '../../../../../../store/dashboard/repairer/repairerAction';
import RepairerApi from '../../../../../../api/repairerApi';
const AssignmentModal = ({ showPopup, setShowPopup, repairer }) => {
    const [rows, setRows] = useState([{ problemeType: null, repairers: [] }]);
    const { models } = useSelector((state) => state.repairer);
    const dispatch = useDispatch()
    const [selectedProbs, setselectedProbs] = useState([])
    const [problems, setproblems] = useState([])
    const [form] = Form.useForm();
    const { reparations } = useSelector((state) => state.repairer);
    const handleCancel = () => {
        setShowPopup(false)
        form.resetFields();
    }
    const options = [];
    for (let i = 10; i < 14; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i,
        });
    }
    useEffect(() => {
        const fetchProblems = async () => {
            const problems = await (await RepairerApi.getAllProblems()).data
            console.log("probs", problems);
            setproblems(problems);
        }
        dispatch(getReparations(repairer.id)).unwrap()
            .then(() => {
                fetchProblems()
                form.resetFields()
            });
        console.log("reparations:", reparations);
    }, [dispatch, form, repairer.id, reparations]);


    useEffect(() => {
        // Mettre à jour les réparations sélectionnées.
        setselectedProbs(reparations);
        
        // Si la liste des réparations est vide, définir une ligne par défaut.
        if (reparations.length === 0) {
            setRows([{ problemType: null, price: null }]);
        } else {
            setRows(reparations); // Si non vide, définir avec la liste des réparations.
        }
    }, [reparations]); // Simplification des dépendances.
    

    const handleAddRow = () => {
        const newRow = { problemType: null, price: null };
        setRows([...rows, newRow]);
    };
    const handleSelectChange = async (value, index, nameInput) => {
        try {
            await form.validateFields([nameInput]);

            const selectedProblem = problems.find((problem) => problem.id === value);
            if (selectedProblem) {
                dispatch(getModelsByProblemId(selectedProblem.id));
            }
        } catch (error) {
            console.error('Validation error:', error);
        }

    };
    const handleSelectChange1 = (value, index, nameInput) => {
        if (reparations.length === 0) {
            handleSelectChange(value, index, nameInput);
            return;
        }

        const problemAlreadyDefined = reparations.some(prob => prob.problem.id === value);
        if (problemAlreadyDefined) {
            toast.error("Ce problème est déjà défini");
            form.setFieldsValue({
                [nameInput]: null
            });
            return;
        }

        const initialProbs = selectedProbs.map(prob => prob.problemType);
        if (initialProbs.includes(value)) {
            toast.error("Ce problème est déjà sélectionné");
            form.setFieldsValue({
                [nameInput]: null
            });
            return;
        }

        handleSelectChange(value, index, nameInput);
        const fieldValue = form.getFieldValue(nameInput);
        const updatedProbs = [...selectedProbs, { problemType: value }];
        setselectedProbs(updatedProbs);
    }

    const handleRemoveRow = (indexToRemove) => {
        const updatedRows = rows.filter((row, index) => index !== indexToRemove);
        const updatedProbs = selectedProbs.filter((_, index) => index !== indexToRemove);

        form.setFieldsValue({
            [`problemType-${indexToRemove + 5}`]: null,
            [`price-${indexToRemove + 5}`]: null
        });
        setRows(updatedRows);
        setselectedProbs(updatedProbs);
    };
    return (
        <Modal
            open={showPopup}
            title={"Affectation pour " + repairer.username.toUpperCase()}
            okText={"Ajouter"}
            cancelText="Annuler"
            onCancel={handleCancel}
            width={900}
            onOk={async () => {
                try {
                    const values = await form.validateFields();
                    const convertedData = {};
                    for (const key in values) {
                        if (key.startsWith("problemType-")) {
                            const index = key.split("-")[1];
                            convertedData[`problemType-${index}`] = values[key].toString();
                        } else {
                            convertedData[key] = values[key];
                        }
                    }
                    console.log("c values", convertedData);
                    await dispatch(deleteRepationsByIdRepairer(repairer.id));
                    dispatch(assignProblemsToRepairer({ requestBody: convertedData, repairerId: repairer.id }));
                    toast.success('Problèmes assignés avec succès');
                    setShowPopup(false);
                    console.log("values", values);
                } catch (error) {
                    console.error('Erreur lors de la validation du formulaire:', error);
                    toast.error('Veuillez remplir tous les champs requis');
                }
            }}

        >
            <Form form={form} layout="vertical">
                {reparations.map((reparation, index) => (
                    <div key={index}>
                        <Row gutter={24} className='items-center'>
                            <Col xs={24} sm={12}>
                                <label className='font-semibold' htmlFor={`problemType-${index}`}>Problème</label>
                                <Form.Item
                                    initialValue={reparation.problem.id}
                                    name={`problemType-${index}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner votre problème!',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Sélectionner un problème"
                                        onChange={(value) => handleSelectChange(value, index, `problemType-${index}`)}
                                    >
                                        {problems.map((problem) => (
                                            <Select.Option key={problem.id} value={problem.id}>
                                                {problem.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={10}>
                                <label className="font-semibold" htmlFor={`modeles-${index}`}>
                                    Modèles
                                </label>
                                <Form.Item name={`modeles-${index}`} initialValue={reparation.models.map(model => model.id)} hasFeedback>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Veuillez sélectionner un modèle"
                                    >
                                        {reparation.selectedModels.map((model) => (
                                            <Select.Option key={model.id} value={model.id}>
                                                {model.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                ))}

                {rows.map((row, index) => (
                    <Row gutter={24} key={index} className='items-center'>
                        <Col xs={24} sm={12}>
                            <label className='font-semibold' htmlFor={`problemType-${index + (reparations.length)}`}>Problème</label>
                            <Form.Item
                                name={`problemType-${(reparations.length) + index}`}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner votre problème!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Sélectionner un problème"
                                    onChange={(value) => handleSelectChange1(value, index, `problemType-${reparations.length + index}`)}
                                >
                                    {problems.map((problem) => (
                                        <Select.Option key={problem.id} value={problem.id}>
                                            {problem.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={10}>
                            <label className="font-semibold" htmlFor={`modeles-${reparations.length + index}`}>
                                Modèles
                            </label>
                            <Form.Item name={`modeles-${reparations.length + index}`} hasFeedback>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Veuillez sélectionner un modèle"
                                >
                                    {models.map((model) => (
                                        <Select.Option key={model.id} value={model.id}>
                                            {model.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={2}>
                            <MinusCircleOutlined className="dynamic-delete-button text-red-500" onClick={() => handleRemoveRow(index)} />
                        </Col>
                    </Row>
                ))}
            </Form>



            {
                ((reparations.length < problems.length) && (rows.length < (problems.length - reparations.length))) && <Space>
                    <button className='btn btn btn-outline-primary rounded-circle p-2 w-8 h-8 flex items-center' onClick={handleAddRow} >
                        <PlusOutlined />
                    </button>
                </Space>
            }


        </Modal>
    )
}

export default AssignmentModal