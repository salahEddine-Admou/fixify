import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate,useParams } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import { errorToast, successToast } from '../../utils';
import RepairerApi from '../../api/repairerApi';
import { Navbar } from '../../components/navbar/navbar';

const ChangePassword = () => {
    const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('id: ', id);
    console.log('Password envoyer: ', values.password);
    try{
        const response = await RepairerApi.changePassword(id,values.password);
        successToast('Votre mot de passe à été changer avec succes');
        navigate('/');
    }catch(error){
        errorToast(error);
    }
  };

  const validatePasswords = (_, value) => {
    if (value && form.getFieldValue('password') !== value) {
      return Promise.reject(new Error('Les mots de passe ne correspondent pas.'));
    }
    return Promise.resolve();
  };

  return (

    <>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Form
      form={form}
      name="change_password"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: '400px', margin: 'auto' }}
    >
      <Form.Item
        name="password"
        label="Nouveau mot de passe"
        rules={[
          {
            required: true,
            message: 'Veuillez saisir votre nouveau mot de passe!',
          },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Nouveau mot de passe" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirmez le mot de passe"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Veuillez confirmer votre mot de passe!',
          },
          {
            validator: validatePasswords,
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Confirmez le mot de passe" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Enregistrer
        </Button>
      </Form.Item>
    </Form>
    </div>
    </>
  );

};

export default ChangePassword;
