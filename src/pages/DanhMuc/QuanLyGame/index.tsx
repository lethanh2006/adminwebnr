import React, { useState } from 'react';
import { Layout, Row, Col, Input, Button, Space, message, Typography, Divider, Card } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

// Import API từ đường dẫn bạn cung cấp
import { getPlayerProfile } from '@/services/PlayerManager/api';

// Import Components con
import ProfileView from './components/ProfileView';
import MailAction from './components/MailForm';
import BanAction from './components/BanControl';
import { PlayerProfile } from './types';

const { Content } = Layout;
const { Title } = Typography;

const QuanLyGame = () => {
  const token = "YOUR_ADMIN_TOKEN"; // Lấy từ Redux hoặc LocalStorage
  const [searchId, setSearchId] = useState('');
  const [playerData, setPlayerData] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchId) return message.warning("Vui lòng nhập ID người chơi!");
    setLoading(true);
    try {
      const res = await getPlayerProfile(searchId, token);
      // Giả sử API trả về data.user như bạn đã gửi ở trên
      setPlayerData(res.data.user);
      message.success("Tải dữ liệu thành công!");
    } catch (err) {
      setPlayerData(null);
      message.error("Không tìm thấy người chơi này!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Content>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}><UserOutlined /> Quản Lý Người Chơi</Title>
          <Space.Compact style={{ width: '100%', maxWidth: 500 }}>
            <Input 
              placeholder="Nhập Player ID..." 
              value={searchId} 
              onChange={e => setSearchId(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
            />
            <Button type="primary" size="large" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
              Tra cứu
            </Button>
          </Space.Compact>
        </div>

        <Divider />

        <Row gutter={[24, 24]}>
          {/* Cột 1: Thông tin */}
          <Col xs={24} lg={8}>
            {playerData ? (
              <ProfileView data={playerData} />
            ) : (
              <Card className="shadow-sm" style={{ textAlign: 'center', padding: '40px 0', color: '#ccc' }}>
                Nhập ID để xem thông tin
              </Card>
            )}
          </Col>

          {/* Cột 2: Gửi thư */}
          <Col xs={24} lg={8}>
            <MailAction token={token} targetId={playerData?.id.toString()} />
          </Col>

          {/* Cột 3: Ban/Khóa */}
          <Col xs={24} lg={8}>
            {playerData ? (
              <BanAction token={token} userId={playerData.id} />
            ) : (
              <Card className="shadow-sm" disabled style={{ opacity: 0.5 }}>
                Chọn người chơi để thực hiện khóa
              </Card>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default QuanLyGame;