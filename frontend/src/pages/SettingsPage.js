import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const SettingsPage = () => {
  return (
    <div>
      <Title level={2}>Настройки</Title>
      <Paragraph>
        Страница настроек системы. Здесь будут доступны параметры конфигурации, 
        управление интеграциями и другие системные настройки.
      </Paragraph>
    </div>
  );
};

export default SettingsPage;
