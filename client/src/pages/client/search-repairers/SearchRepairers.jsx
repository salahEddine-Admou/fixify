import React, { useEffect, useState } from 'react'
import RepairerCard from './repairer-card/RepairerCard'
import { AutoComplete, Button, Empty, Form, Skeleton, Spin } from 'antd';
import { cities } from '../../../data/cities';
import RepairerApi from '../../../api/repairerApi';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../../home/banner/search-form/SearchForm';
import "./search-repairer.css"
import RepairerDrawer from './repairer-drawer/RepairerDrawer';

const SearchRepairers = () => {
    const [page, setPage] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedDeviceType, setSelectedDeviceType] = useState("Ordinateur");
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setloading] = useState(false);
    const [repairer, setrepairer] = useState(null)
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const location = useLocation();
    const [repairers, setrepairers] = useState([])

    const searchRepairers = async () => {

        setloading(true)
        const searchData = {
            city: searchParams.get("city"),
            modelId: searchParams.get("modelId"),
            problemId: searchParams.get("problemId")
        }


        const { data } = await RepairerApi.search(searchData, page, 6)

        setrepairers(prevData => [...prevData, ...data]);
        setSuccess(true)
        setloading(false)

    }
    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {

        searchRepairers()

    }, [searchParams.get("modelId"), searchParams.get("city"), searchParams.get("problemId"), page])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className="px-10 mt-[80px]">
            <div className='row'>
                <div className="col-md-3 bg-gray-50 rounded-md pb-4 block relative md:fixed overflow-hidden">
                    <div className="ball bg-blue-500 rounded-circle h-[70px] w-[70px] absolute top-[-30px] right-[-30px] z-20"></div>
                    <SearchForm setPage={setPage} setrepairers={setrepairers} page={"repairer-listing"} selectedDeviceType={selectedDeviceType} setSelectedDeviceType={setSelectedDeviceType}  />
                </div>

                <div className="col-md-9 ml-0 md:ml-[27%]">

                    <div className='row'>
                        {repairers.length > 0 ? repairers.map(repairer => (
                            <RepairerCard setrepairer={setrepairer} repairer={repairer} showDrawer={showDrawer} />
                        )) : (success && !loading) ? <div className='h-[80vh] flex items-center justify-center'> <Empty />  </div> : loading &&
                            <div className='h-[80vh] flex items-center justify-center'>
                                <Spin/>
                            </div>
                        }
                    </div>
                </div>

            </div>
            {
                repairer && <RepairerDrawer repairer={repairer} open={open} onClose={onClose} />
            }

        </div>

    )
}

export default SearchRepairers