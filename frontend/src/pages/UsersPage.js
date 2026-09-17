import { Typography, Table, Tag } from 'antd';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

const { Title } = Typography;

const UsersPage = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/auth/');
      return response.data;
    },
  });
  
  const columns = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ФИО',
      key: 'name',
      render: (_, record) => `${record.last_name || ''} ${record.first_name || ''}`.trim() || '-',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleNames = {
          admin: 'Администратор',
          dispatcher: 'Диспетчер',
          engineer: 'Инженер',
          viewer: 'Наблюдатель',
        };
        const colors = {
          admin: 'red',
          dispatcher: 'blue',
          engineer: 'green',
          viewer: 'gray',
        };
        return <Tag color={colors[role]}>{roleNames[role] || role}</Tag>;
      },
    },
    {
      title: 'Отдел',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => dept || '-',
    },
  ];
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  return (
    <div>
      <Title level={2}>Пользователи</Title>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};

export default UsersPage;
