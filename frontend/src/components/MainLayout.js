import { Layout, Menu, Typography, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/users', icon: <TeamOutlined />, label: 'Пользователи' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
  ];
  
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#001529'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Операционный центр
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          defaultSelectedKeys={['/']}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: 'white', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px #f0f1f2'
        }}>
          <Title level={4} style={{ margin: 0 }}>Панель управления</Title>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#1890ff' }}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <span>{user?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: 'white', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
