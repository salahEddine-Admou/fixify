import React, { useEffect, useState } from 'react'
import AuthApi from '../../api/AuthApi';
import { useParams } from 'react-router';
import { Button, Result, Spin } from 'antd';
import { NavLink } from 'react-router-dom';

const EmailConfirmation = () => {
    let { verificationToken } = useParams();
    const [loading, setloading] = useState(false)
    const [success, setsuccess] = useState(false)
    useEffect(() => {
        const confirmEmail = async () => {
            try {
                setloading(true)
                const rest = await AuthApi.confirmEmail(verificationToken)
                setloading(false)
                setsuccess(true)
            } catch (error) {
                alert("email error")
                console.log(error);
                setloading(false)
            }

        }

        confirmEmail()



    }, [])

    return (
        <div className='h-[100vh] flex items-center'>
            {
                loading && <Spin size="large" />
            }
            {
                success && <Result
                    className='bg-gray-100 w-[40%] m-auto  rounded-md border border-gray-300'
                    status="success"
                    title="Votre email est confirme"

                    extra={[
                        <NavLink className="btn-primary bg-blue-500 text-white rounded-md p-2 hover:text-white" to='/'>
                            Aller vers l'acceuill
                        </NavLink>
                    ]}
                />
            }
        </div>

    )
}

export default EmailConfirmation