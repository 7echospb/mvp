import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const onFinish = async (values) => {
    try {
      await login(values.username, values.password);
      message.success('Вход выполнен успешно');
      navigate('/');
    } catch (error) {
      message.error('Неверное имя пользователя или пароль');
    }
  };
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          Операционный центр
        </Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: 'Введите имя пользователя' }]}
          >
            <Input size="large" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
