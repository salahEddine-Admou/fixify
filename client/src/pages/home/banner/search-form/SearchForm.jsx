import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AutoComplete, Button, Form, Input, Spin, notification } from 'antd';
import SubCategoryApi from '../../../../api/subCategoryApi';
import ProblemTypeApi from '../../../../api/ProblemTypeApi';
import ModelApi from '../../../../api/ModelAPI';
import { cities } from '../../../../data/cities';
import categoryModelApi from '../../../../api/categoryModelApi';
import { useDispatch } from 'react-redux';
import { setInfos } from '../../../../store/front/reservationSlice';
import ReservationApi from '../../../../api/ReservationApi';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import './SearchForm.css';

const SearchForm = ({ setSelectedDeviceType, selectedDeviceType, page, setrepairers, setPage }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, role } = useSelector((state) => state.auth);
    const [marques, setMarques] = useState([]);
    const [devicetypes, setdevicetypes] = useState([]);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [modeles, setModeles] = useState([]);
    const dispatch = useDispatch();
    const [problemTypes, setproblemTypes] = useState([]);
    const [searchData, setsearchData] = useState({ city: "", problemId: "", modelId: "", modelName: "", problemName: "", marqueName: "", marqueId: "", deviceType: "" });
    const [selectedMarque, setSelectedMarque] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [isOtherProblemType, setIsOtherProblemType] = useState(false);
    const [form] = Form.useForm();

    const changeMode = mode => {
        setsearchData({ ...searchData, deviceType: mode });
        setSelectedDeviceType(mode);
        setModeles([]);
        form.setFieldsValue({ modelId: "", problemId: "", marque: "" });
        setSelectedMarque(null);
        setSelectedModel(null);
    };

    const handleCancel = () => {
        form.resetFields();
        setsearchData({ city: "", problemId: "", modelId: "", modelName: "", problemName: "", marqueName: "", marqueId: "", deviceType: "" });
        setSelectedMarque(null);
        setSelectedModel(null);
        setSelectedDeviceType(null);
    };

    const handleSearch = async () => {
        console.log("search data", searchData);
        dispatch(setInfos(searchData));
        await form.validateFields();
        if (searchParams.get("deviceType")) {
            setPage(1);
            setrepairers([]);
        }

        navigate(`../front/search-repairers?city=${searchData.city}&problemId=${searchData.problemId}&modelId=${searchData.modelId}&marqueName=${searchData.marqueName}&modelName=${searchData.modelName}&problemName=${searchData.problemName}&marqueID=${searchData.marqueId}&deviceType=${searchData.deviceType}`, { replace: true });
    };

    const handleReserve = async () => {
        try {
            const dataToSend = { ...searchData };
            if (isOtherProblemType) {
                dataToSend.problemId = null;
                dataToSend.problemName = null;
            }

            await ReservationApi.createReservationProblemOther(dataToSend);
            api.open({
                message: 'Réservation créée avec succès',
                description: 'Le support va vous contacter pour plus de détails sur votre problème',
                icon: (
                    <SmileOutlined
                        style={{
                            color: '#108ee9',
                        }}
                    />
                ),
            });
            form.resetFields();
        } catch (error) {
            api.open({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de la réservation',
                icon: (
                    <CloseCircleOutlined
                        className='text-red-500'
                    />
                ),
            });
        }
    };

    useEffect(() => {
        const getDeviceTypes = async () => {
            const { data } = await categoryModelApi.getAll();
            const filteredData = data.filter(deviceType => deviceType.name.toLowerCase() !== 'autre');
            setdevicetypes(filteredData);
        };

        if (searchParams.get("deviceType")) {
            let deviceType = searchParams.get("deviceType");
            setSelectedDeviceType(deviceType);
            const paramsObject = {};

            for (const [key, value] of searchParams.entries()) {
                paramsObject[key] = value;
            }
            setsearchData(paramsObject);
        } else {
            setsearchData({ ...searchData, deviceType: selectedDeviceType });
        }
        getDeviceTypes();
    }, []);

    useEffect(() => {
        SubCategoryApi.getAll()
            .then(response => {
                const filteredMarques = response.data.filter(marque => marque.category === selectedDeviceType);
                setMarques(filteredMarques);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des marques:', error);
            });

        const getProblemTypes = async () => {
            let { data } = await ProblemTypeApi.getAll();
            data = data.filter(problem => problem.category == selectedDeviceType);
            data.push({ id: 'other', name: 'Type de problème autre' }); // Adding "Type de problème autre"
            setproblemTypes(data);
        };
        getProblemTypes();
    }, [selectedDeviceType]);

    useEffect(() => {
        if (user) {
            setsearchData(prevData => ({ ...prevData, username: user }));
        }
    }, [user]);

    useEffect(() => {
        if (selectedMarque) {
            ModelApi.getAll()
                .then(response => {
                    const marqueModels = response.data.filter(model => model.subCategory === selectedMarque);
                    setModeles(marqueModels);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des modèles:', error);
                });
        } else if (searchParams.get("marqueName")) {
            let marque = searchParams.get("marqueName");
            ModelApi.getAll()
                .then(response => {
                    const marqueModels = response.data.filter(model => model.subCategory === marque);
                    setModeles(marqueModels);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des modèles:', error);
                });
        }
    }, [selectedMarque]);

    const handleMarqueChange = (value, option) => {
        setSelectedMarque(value);
        form.setFieldsValue({ modelId: "" });
        setSelectedModel(null);
        setsearchData({ ...searchData, marqueName: value, marqueId: option.key });
    };

    const handleModelChange = (value, option) => {
        setSelectedModel(value);
        setsearchData({ ...searchData, modelId: option.key, modelName: value });
    };

    const handleProblemChange = (value, option) => {
        setIsOtherProblemType(value === 'Type de problème autre');
        setsearchData({ ...searchData, problemId: option.key, problemName: value });
    };

    const handleDescriptionChange = (e) => {
        setsearchData({ ...searchData, description: e.target.value });
    };

    return (
        <>
            {contextHolder}
            <div className={` ${page == "home" ? "mt-5 bg-white col-md-6 py-3 px-3" : "bg-gray-50 p-0"}   md:p-4 rounded-md animate__animated animate__bounceIn`}>
                <ul className="tab-head flex font-bold scrollable-container">
                    {
                        devicetypes.map(deviceType => (
                            <li
                                key={deviceType.id}
                                onClick={() => changeMode(deviceType.name)}
                                className={`mr-2 cursor-pointer pb-1 ${selectedDeviceType === deviceType.name ? "border-blue-500  border-b-2" : "text-gray-400"}`}
                            >
                                {deviceType.name}
                            </li>
                        ))
                    }
                </ul>
                <Form form={form} name="my-form" initialValues={{ remember: true }} className="mt-4">
                    <label className="font-medium" htmlFor="">
                        Ville
                    </label>
                    <Form.Item
                        initialValue={searchParams.get("city")}
                        name="city"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez entrer votre ville!',
                            },
                        ]}
                    >
                        <AutoComplete
                            allowClear
                            className='block border border-gray-300 rounded-md'
                            size='large'
                            variant={page == "home" ? "filled" : "outlined"}
                            options={cities.map(city => { return { value: city.ville, label: city.ville } })}
                            placeholder="Sélectionner une ville"
                            filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onChange={(value, option) => setsearchData({ ...searchData, city: value })}
                        />
                    </Form.Item>

                    <label className="font-medium " htmlFor="">
                        Marque
                    </label>
                    <Form.Item
                        initialValue={searchParams.get("marqueName")}
                        name="marque"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez entrer votre marque!',
                            },
                        ]}
                    >
                        <AutoComplete
                            allowClear
                            className="block border border-gray-300 rounded-md mt-1"
                            variant={page == "home" ? "filled" : "outlined"}
                            options={marques.map(marque => ({ value: marque.name, label: marque.name, key: marque.id }))}
                            placeholder="Sélectionner la marque"
                            filterOption={(inputValue, option) =>
                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onChange={handleMarqueChange}
                            onClear={() => { form.setFieldsValue({ modelId: "" }) }}
                        />
                    </Form.Item>

                    <div>
                        <label className="font-medium " htmlFor="">
                            Modèle
                        </label>
                        <Form.Item
                            initialValue={searchParams.get("modelName")}
                            name="modelId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre modèle!',
                                },
                            ]}
                        >
                            <AutoComplete
                                allowClear
                                className="block border border-gray-300 rounded-md mt-1"
                                variant={page == "home" ? "filled" : "outlined"}
                                options={modeles.map(modele => ({ value: modele.name, label: modele.name, key: modele.id }))}
                                placeholder="Sélectionner le modèle"
                                filterOption={(inputValue, option) =>
                                    option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onChange={handleModelChange}
                            />
                        </Form.Item>
                    </div>

                    <div>
                        <label className="font-medium " htmlFor="">
                            Type de problème
                        </label>
                        <Form.Item
                            initialValue={searchParams.get("problemName")}
                            name="problemId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez entrer votre problème!',
                                },
                            ]}
                        >
                            <AutoComplete
                                allowClear
                                className="block border border-gray-300 rounded-md mt-1"
                                variant={page == "home" ? "filled" : "outlined"}
                                options={problemTypes.map(problem => ({ value: problem.name, label: problem.name, key: problem.id }))}
                                placeholder="Sélectionner le type de problème"
                                filterOption={(inputValue, option) =>
                                    option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onChange={handleProblemChange}
                            />
                        </Form.Item>
                    </div>

                    {isOtherProblemType && (
                        <div>
                            <label className="font-medium " htmlFor="description">
                                Description du problème
                            </label>
                            <Form.Item
                                name="description"
                                rules={[{ required: true, message: 'Veuillez entrer la description de la catégorie' }]}
                            >
                                <Input.TextArea
                                    onChange={handleDescriptionChange}
                                />
                            </Form.Item>
                        </div>
                    )}
                    {!isOtherProblemType && (
                        <Button onClick={handleSearch} className="float-right" type="primary">
                            Rechercher
                        </Button>
                    )}

                    {isOtherProblemType && role == 'client' ? (
                        <Button onClick={handleReserve} className="float-right" type="primary">
                            Réserver
                        </Button>
                    ) : null}


                    {
                        page == "home" && <Button onClick={handleCancel} type="default">
                            Annuler
                        </Button>
                    }

                </Form>
            </div>
        </>
    );
};

export default SearchForm;
