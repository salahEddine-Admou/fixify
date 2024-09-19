import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/auth/authActions';
import { errorToast } from '../../utils';
import { Button, Input, message } from 'antd';
import { KeyOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';


export const Login = () => {
	const { user, loading } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [messageApi, contextHolder] = message.useMessage();
	const navigate = useNavigate();
	const [loginForm, setloginForm] = useState({
		email: "",
		password: "",
	})


	const onLoginFormChange = (e) => {
		setloginForm({ ...loginForm, [e.target.name]: e.target.value })
	}

	useEffect(() => {
		if (user) {
			navigate('/', { successLogin: true });
		}
	}, [navigate, user]);

	const signinUser = async (e) => {
		dispatch(loginUser({
			email: loginForm.email,
			password: loginForm.password
		}))
			.unwrap()
			.catch((errorData) => {
				errorToast(errorData.error, messageApi);
			});
	};

	return (
		<section className="p-8">
			{/* {contextHolder} */}
			<form>
				<div>
					<h1 className='text-2xl font-bold text-blue-500'>Sign In</h1>
					<p className="mt-4 mb-8">If you don't have an account <br />
						You can <Link to='/register' className="link">Register here !</Link>
					</p>
					
				</div>
				
				<div>
					<label className="block text-primary-grey text-[13px] font-medium pb-1">Email</label>
					<div className="relative">
						<Input name='email' size='large' onChange={onLoginFormChange} placeholder="default size" prefix={<MailOutlined />} />
					</div>
				</div>
				<div>
					<label className="block text-primary-grey text-[13px] font-medium pb-1">Password</label>
					<div className="relative">
						<Input.Password name='password' size='large' onChange={onLoginFormChange} prefix={<LockOutlined />} placeholder="input password" />
					</div>
				</div>
				<Button className='primary mt-3' type="primary" onClick={signinUser} loading={loading} >
					Login
				</Button>
			</form>
		</section>
	);
};
