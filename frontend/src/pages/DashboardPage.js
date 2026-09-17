import { Typography, Card, Row, Col, Statistic } from 'antd';
import { 
  TeamOutlined, 
  CameraOutlined, 
  AlertOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <div>
      <Title level={2}>Дашборд</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Пользователей"
              value={0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Устройств"
              value={0}
              prefix={<CameraOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активных заявок"
              value={0}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Выполнено за сегодня"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
