import React, { useState, useEffect } from 'react';
import { banner, laptop, smartphone } from '../../../assets';
import useTypewriter from 'react-typewriter-hook';
import categoryModelApi from '../../../api/categoryModelApi';
import SearchForm from './search-form/SearchForm';
import "./banner.css"

const Banner = () => {
    const [selectedDeviceType, setSelectedDeviceType] = useState(null);
    const [devicetypes, setdevicetypes] = useState([])

    useEffect(() => {
        const getDeviceTypes = async () => {
            const { data } = await categoryModelApi.getAll()
            setdevicetypes(data)
        }
        getDeviceTypes()
    }, [])


    function MagicWriter(word) {
        const typing = useTypewriter(word);
        return typing;
    }

    const changeMode = mode => {
        setSelectedDeviceType(mode);
    };

    return (
        <div className="relative w-full inline-block ">

            <div className="absolute inset-0 bg-black opacity-50"></div>
            <img src={banner} alt="Image" className={`block w-[100%] object-cover ${selectedDeviceType ? "h-[110vh]" : "h-[75vh]  md:h-[100vh]"} `} />
            <div className="absolute top-20 md:px-5 px-3 justify-center items-center sm:row md:flex inset-0">
                <div className={`mr-10 col-md-4 `}>
                    <h1 className="text-3xl font-bold text-white">{MagicWriter("Bienvenue sur Fixify !")}</h1>
                    <p className="text-sm text-gray-100">Trouvez les meilleurs professionnels de réparation au Maroc</p>
                </div>

                {selectedDeviceType ? (
                    <SearchForm page={"home"} selectedDeviceType={selectedDeviceType} setSelectedDeviceType={setSelectedDeviceType} />
                ) : (
                    <div className="btns flex col-md-4 justify-center md:justify-start mt-10 md:mt-0 ">
                        {
                            devicetypes.slice(0, 2).map(deviceType => (
                                <span
                                    onClick={() => changeMode(deviceType.name)}
                                    className="text-white cursor-pointer border-2 border-white p-4 mr-6 rounded-full"
                                >
                                    <img src={deviceType.name == "Ordinateur" ? laptop : smartphone} className="w-14 h-auto icon" alt="" />

                                </span>
                            ))
                        }

                    </div>
                )}
            </div>
        </div>
    );
};

export default Banner;