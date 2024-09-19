import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import axios from 'axios';

const Ajouter = ({ visible, setVisible, fetchModels }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values) => {
    try {
      await axios.post('/api/model', values);
      fetchModels(); // Rafraîchit la liste des modèles après l'ajout
      setVisible(false); // Ferme la fenêtre modale
      form.resetFields(); // Réinitialise les champs du formulaire
    } catch (error) {
      console.error('Erreur lors de l\'ajout du model:', erreur);
    }
  };

  return (
    <Modal
      title="Ajouter le model"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Soumettre
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Veuillez entrer le nom du model!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Veuillez saisir la description!' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Ajouter;
