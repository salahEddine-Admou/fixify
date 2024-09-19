import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AutoComplete, Button, Form } from 'antd';
import SubCategoryApi from '../../../../api/subCategoryApi';
import ProblemTypeApi from '../../../../api/ProblemTypeApi';
import ModelApi from '../../../../api/ModelAPI';
import { cities } from '../../../../data/cities';
import categoryModelApi from '../../../../api/categoryModelApi';
import { useDispatch, useSelector } from 'react-redux';
import { setInfos } from '../../../../store/front/reservationSlice';

const RepairerSearchform = ({ reservation, setReservation, repairer, setChildrenDrawer, setSelectedDeviceType, selectedDeviceType, page, setrepairers, setPage, repairerCity, reparations }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [marques, setMarques] = useState([]);
    const [devicetypes, setdevicetypes] = useState([]);
    const navigate = useNavigate();
    const [modeles, setModeles] = useState([]);
    const dispatch = useDispatch();
    const { infos } = useSelector((state) => state.reservation);
    const { user, role } = useSelector((state) => state.auth);


    const [problemTypes, setproblemTypes] = useState([]);
    const [searchData, setsearchData] = useState({ city: "", problemId: "", modelId: "", modelName: "", problemName: "", marqueName: "", marqueId: "", deviceType: "" });
    const [selectedMarque, setSelectedMarque] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [form] = Form.useForm();

    const changeMode = mode => {
        setsearchData({ ...searchData, deviceType: mode });
        setSelectedDeviceType(mode);
        setModeles([]);
        form.setFieldsValue({ modelId: "", problemId: "", marque: "" });
        setSelectedMarque(null);
        setSelectedModel(null);
    };

    const showChildrenDrawer = async () => {
        const getTotal = async () => {
            const { data } = await ProblemTypeApi.getTotal(infos.modelId, infos.problemId, repairer.id
            )
            return data
        }

        if (user) {
            let price = await getTotal()
            console.log(price);
            setChildrenDrawer(true);

            setReservation({ ...reservation, username: user, repairerId: repairer.id, description: "", price: price.price, priceId: price.id })
        }
        // else {
        //     setOpen(true)
        // }

    };

    const handleSearch = async () => {
        dispatch(setInfos({ marque: searchData.marqueName, model: searchData.modelName, problem: searchData.problemName }));
        await form.validateFields();
        if (searchParams.get("deviceType")) {
            setPage(1);
            setrepairers([]);
        }

        navigate(`../front/search-repairers?city=${searchData.city}&problemId=${searchData.problemId}&modelId=${searchData.modelId}&marqueName=${searchData.marqueName}&modelName=${searchData.modelName}&problemName=${searchData.problemName}&marqueID=${searchData.marqueId}&deviceType=${searchData.deviceType}`, { replace: true });
    };






    const handleMarqueChange = (value, option) => {
        setSelectedMarque(value);
        form.setFieldsValue({ modelId: "" });
        setSelectedModel(null);
        setsearchData({ ...searchData, marqueName: value, marqueId: option.key });
    };

    const handleModelChange = (value, option) => {
        if (option?.key) {
            alert(value)
            setSelectedModel(value);
            let model = modeles.find(model => model.id === option.key);
            let modelCat = model.category

            let updatedProblems = problemTypes.filter(item => item.category === modelCat)
            setproblemTypes(updatedProblems)
            setsearchData({ ...searchData, modelId: option.key, modelName: value });
            setReservation({ ...reservation, modelId: option?.key })
        }


    };

    const handleProblemChange = (value, option) => {
        if (option?.key) {
            setsearchData({ ...searchData, problemId: option.key, problemName: value });
            setReservation({ ...reservation, problemId: option?.key })
        }

    };

    let models = [];
    let problems = [];
    useEffect(() => {
        // Initialize arrays to store models and problems
        setModeles(reparations.models);
        setproblemTypes(reparations.problems);

    }, [reparations.length])



    return (
        <div className={` ${page == "home" ? "mt-5 bg-white w-[45%]" : "bg-gray-50"}  p-4 rounded-md animate__animated animate__bounceIn`}>
            <ul className="tab-head flex font-bold">
                {
                    devicetypes.map(deviceType => (
                        <li
                            key={deviceType.name}
                            onClick={() => changeMode(deviceType.name)}
                            className={`mr-2 cursor-pointer pb-1 ${selectedDeviceType === deviceType.name ? "border-blue-500  border-b-2" : "text-gray-400"
                                } `}
                        >
                            {deviceType.name}
                        </li>
                    ))
                }
            </ul>
            <Form form={form} name="my-form" initialValues={{ remember: true }} className="mt-4">


                <div>
                    <label className="font-medium " htmlFor="">
                        Modèle
                    </label>
                    <Form.Item
                        name="modelId"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez entrer votre modèle!',
                            },
                        ]}
                    >
                        {
                            console.log(models, problems)
                        }
                        <AutoComplete
                            allowClear
                            className="block border border-gray-300 rounded-md mt-1"
                            options={modeles.map(modele => ({ value: modele.name, label: modele.name, key: modele.id }))}
                            placeholder="Sélectionner le modèle"
                            filterOption={(inputValue, option) =>
                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onSelect={handleModelChange}

                        />
                    </Form.Item>
                </div>

                <div>
                    <label className="font-medium " htmlFor="">
                        Type de problème
                    </label>
                    <Form.Item
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
                            options={problemTypes.map(problem => ({ value: problem.name, label: problem.name, key: problem.id }))}
                            placeholder="Sélectionner le problème"
                            filterOption={(inputValue, option) =>
                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onChange={handleProblemChange}
                        />
                    </Form.Item>
                </div>

                <Button onClick={showChildrenDrawer} className="float-right" type="primary">
                    Reserver
                </Button>
            </Form>
        </div>
    );
};

export default RepairerSearchform;