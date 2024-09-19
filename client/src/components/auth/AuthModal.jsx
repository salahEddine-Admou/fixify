import { KeyOutlined, LockOutlined, MailOutlined, UserOutlined, ToolOutlined, CarOutlined } from '@ant-design/icons';

import { Button, Input, Modal, Form, Result, message, notification } from 'antd';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerClient } from '../../store/auth/authActions';
import { errorToast, successToast } from '../../utils';
import MasterInput from '../forms/MasterInput';
import { clearErrors } from '../../store/auth/authSlice';
import toast, { useToaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { clientIcon, deliveryIcon, repairerIcon } from '../../assets';
import LivreurSignup from './livreurSignup/LivreurSignup';
import ClientSignup from './livreurSignup/ClientSignup';
import RepairerSignup from './repairerSignup/RepairerSignup';
import AuthApi from '../../api/AuthApi';

const AuthModal = ({ open, setOpen }) => {
    const { user, loading, error, role } = useSelector((state) => state.auth);
    const [submitType, setSubmitType] = useState("")
    const [signupMode, setsignupMode] = useState("")
    const [isLogin, setIsLogin] = useState(true)
    const dispatch = useDispatch();
    const [showNotif, setShowNotif] = useState(false)
    const navigate = useNavigate();
    const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [forgotPasswordForm] = Form.useForm();


    const [loginForm, setloginForm] = useState({
        username: "",
        password: "",
    })

    const checkEmailAvailability = async (rule, value) => {
        if (!value) {
            return Promise.resolve();
        }
        try {
            const response = await AuthApi.checkUsername({ username: "", email: value });
            return await Promise.reject('Email is not existe!');
        } catch (error) {
            return await Promise.resolve();
        }
    };


    const emailChangePassword = async ()=>{
        try{
            const values=await forgotPasswordForm.validateFields();
            console.log("email",values.email);
            await AuthApi.emailChangePassword(values.email);
            setForgotPasswordVisible(false)
            forgotPasswordForm.resetFields();
            return successToast("Vérifier votre email")
        }catch(error){
            errorToast("Email does not existe")
        }
    }


    const onLoginFormChange = (e) => {
        setloginForm({ ...loginForm, [e.target.name]: e.target.value })
    }


    const handleCancel = () => {
        setOpen(false);
        setIsLogin(true)
        setShowNotif(false)
        setsignupMode("")
        setSubmitType("")
    };

    const handleSignin = async (e) => {
        dispatch(loginUser(loginForm))
            .unwrap()
            .then(() => {
                handleCancel()
                setloginForm({})
                if (role === "admin") {
                    navigate("/admin/dashboard")
                }
            })
            .catch(({ error }) => {

                if (error.status == 403) {
                    toast.error('Utilisateur introuvable ou email non verifie');
                } else {
                    console.log("error", error);
                    toast.error(error);
                }

            });
    };

    const handleSwitch = () => {
        setIsLogin(isLogin => !isLogin)
        setloginForm({})
        dispatch(clearErrors())
        setsignupMode("")
    }

    const handleForgotPassword = () => {
        setForgotPasswordVisible(true);
    };

    const modalFooter = [
        <Button className={isLogin ? '' : 'hidden'} onClick={handleSwitch}>
            Vous n'avez pas un compte ?
        </Button>,
        <Button className={isLogin ? '' : 'hidden'} onClick={handleForgotPassword}>
            Mot de passe oublié ?
        </Button>,
        <Button className={isLogin ? 'hidden' : ''} onClick={handleSwitch}>
            Avez vous deja un compte ?
        </Button>,
        <Button className={isLogin ? '' : 'hidden'} type="primary" loading={loading} onClick={handleSignin}>
            Se connecter
        </Button>,
        <Button className={(isLogin || signupMode == "") ? 'hidden' : ''} type="primary" loading={loading}
            onClick={signupMode === "client"
                ? (() => setSubmitType("client"))
                : (signupMode === "livreur"
                    ? (() => setSubmitType("livreur"))
                    : signupMode === "repairer"
                    && (() => setSubmitType("repairer")))}

        >
            S'enregister
        </Button>,

    ]
    return (
        <>
            <Modal
                open={open}
                onCancel={handleCancel}
                footer={
                    showNotif ? null : modalFooter
                }
                width={700}
                className='overflow-hidden'
            >

                {
                    showNotif ?
                        <Result
                            className='animate__animated animate__bounceIn'
                            icon={<MailOutlined />}
                            title="Compte cree avec succes"
                            subTitle="Consulter votre boite d'email pour confirmer votre email"
                            extra={<Button onClick={() => handleCancel()} type="primary">Ok</Button>}
                        />

                        :
                        !isLogin
                            ? signupMode == "client" ?
                                // client signup
                                <div className='h-[60vh] overflow-y-scroll  pr-2 mr-5 '>
                                    <ClientSignup setSignupMode={setsignupMode} setSubmitType={setSubmitType} setloginForm={setloginForm} setShowNotif={setShowNotif} submitType={submitType} />
                                </div>
                                : signupMode == "livreur" ?
                                    // Livreur signup
                                    <div className='h-[60vh] overflow-y-scroll  pr-2 mr-5 '>
                                        <LivreurSignup setSignupMode={setsignupMode} setSubmitType={setSubmitType} setloginForm={setloginForm} setShowNotif={setShowNotif} submitType={submitType} />
                                    </div>

                                    : signupMode == "repairer" ?
                                        // Reparateur signup
                                        <div className='h-[60vh] overflow-y-scroll mr-5 pr-2'>
                                            <RepairerSignup setSignupMode={setsignupMode} setSubmitType={setSubmitType} setloginForm={setloginForm} setShowNotif={setShowNotif} submitType={submitType} />
                                        </div>
                                        : <div className='modes h-[15em] items-center flex justify-evenly animate__animated animate__fadeIn'>

                                            <div onClick={() => setsignupMode("client")} className='p-4 text-center md:w-[122px] md:text-sm text-sm w-[80px]   hover:fill-white cursor-pointer border-2 border-blue-500 rounded-full text-blue-500 '>
                                                <img className='md:h-[50px] h-[25px] w-auto fill-current m-auto icon' src={clientIcon} alt="" />
                                                <span className='hidden md:block'>Client</span>
                                            </div>
                                            <div onClick={() => setsignupMode("repairer")} className='p-4 text-center md:w-[122px] md:text-sm text-sm w-[80px]  border-2  hover:fill-white cursor-pointer border-blue-500 rounded-full text-blue-500 '>
                                                <img className='md:h-[50px] h-[25px] w-auto fill-current m-auto icon' src={repairerIcon} alt="" />
                                                <span className='hidden md:block'>Reparateur</span>
                                            </div>
                                            <div onClick={() => setsignupMode("livreur")} className='p-4 text-center md:w-[122px] md:text-sm text-sm w-[80px]  border-2  hover:fill-white cursor-pointer border-blue-500 rounded-full text-blue-500 '>
                                                <img className='md:h-[50px] h-[25px] w-auto  m-auto icon' src={deliveryIcon} alt="" />
                                                <span className='hidden md:block'>Livreur</span>
                                            </div>

                                        </div>
                            :
                            <div div className='animate__animated animate__fadeIn'>

                                <div >
                                    <label className="block text-primary-grey text-[13px] font-medium pb-1">Username</label>
                                    <div className="relative">
                                        <MasterInput
                                            count={{
                                                show: true,
                                                max: 30,
                                            }}
                                            status={error?.username && "error"}
                                            value={loginForm.username}
                                            autoComplete="off"
                                            name='username'
                                            size='large'
                                            onChange={onLoginFormChange}
                                            placeholder="Entrez votre username"
                                            error={error?.username}
                                            icon={<UserOutlined className={error?.username ? "text-red-500" : "text-blue-500"} />}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-primary-grey text-[13px] font-medium pb-1">Mot de passe</label>
                                    <div className="relative">
                                        <MasterInput
                                            type='password'
                                            status={error?.password && "error"}
                                            value={loginForm.password}
                                            autoComplete="off"
                                            name='password'
                                            size='large'
                                            onChange={onLoginFormChange}
                                            placeholder="Entrez votre mot de passe"
                                            error={error?.password}
                                            icon={<LockOutlined className={error?.password ? "text-red-500" : "text-blue-500"} />}
                                        />
                                    </div>
                                </div>
                            </div>
                }

            </Modal>

            <Modal
                title="Réinitialiser le mot de passe"
                open={forgotPasswordVisible}
                onCancel={() => setForgotPasswordVisible(false)}
                onOk={emailChangePassword}
                okText="Envoyer par email"
                cancelText="Annuler"
            >
                <Form form={forgotPasswordForm} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Adresse email"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez saisir votre adresse email!',
                            },
                            {
                                type: 'email',
                                message: 'Veuillez saisir une adresse email valide!',
                            },
                            {
                                validator:checkEmailAvailability,
                            }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Entrez votre adresse email" />
                    </Form.Item>
                </Form>
            </Modal>

        </>


    )
}

export default AuthModal