import React, { useState } from 'react';
import {
  Card, Input, Descriptions, Tag, Row, Col, message, Spin, Tabs,
  Statistic, Empty, Typography, List, Space, Avatar, Divider
} from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  StarOutlined,
  ThunderboltOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { getPlayerProfile, PlayerProfileResponse } from '@/services/PlayerManager/api';

const { Search } = Input;
const { Title, Text } = Typography;

// Helper function to format 64-bit integer object (low, high, unsigned) to string
const formatLongValue = (obj: any) => {
  if (!obj || typeof obj !== 'object' || !('low' in obj)) return '0';
  try {
    const high = BigInt(obj.high || 0);
    let low = BigInt(obj.low || 0);
    // If it's technically a 32-bit signed number from the backend but we want to treat it as part of 64-bit
    if (low < 0n) {
      low = low + 4294967296n; // 2^32
    }
    const val = (high * 4294967296n) + low;
    return new Intl.NumberFormat('vi-VN').format(val);
  } catch (e) {
    return '0';
  }
};

const QuanLyGame = () => {
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerProfileResponse['user'] | null>(null);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('Vui lòng nhập Auth ID người dùng để tìm kiếm');
      return;
    }

    setLoading(true);
    try {
      const res = await getPlayerProfile(value);

      // Fallback cho nhiều cấu trúc response khác nhau
      const userData = (res as any)?.data?.user || (res as any)?.user || (res as any)?.data || null;

      if (userData && userData.id !== undefined) {
        setPlayerData(userData);
        message.success('Tải thông tin người chơi thành công');
      } else {
        message.error('Không tìm thấy thông tin người dùng với ID này');
        setPlayerData(null);
      }
    } catch (error: any) {
      console.error('Error fetching player profile:', error);
      setPlayerData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderUserInfo = () => {
    if (!playerData) return (
      <Card bordered={false} className="shadow-sm" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Empty description="Chưa có dữ liệu. Vui lòng nhập Auth ID để tra cứu" />
      </Card>
    );

    return (
      <Row gutter={[24, 24]}>
        {/* Thông tin chính */}
        <Col xs={24} lg={8}>
          <Card bordered={false} className="shadow-sm" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '24px 0 16px 0' }}>
              <Avatar size={90} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>{playerData.gameName || 'Không rõ'}</Title>
              <div style={{ marginTop: 12 }}>
                <Space size="small">
                  <Tag color="blue" style={{ borderRadius: '12px', padding: '2px 12px' }}>ID: {playerData.id}</Tag>
                  <Tag color="purple" style={{ borderRadius: '12px', padding: '2px 12px' }}>Auth ID: {playerData.auth_id}</Tag>
                </Space>
              </div>
            </div>

            <Divider dashed style={{ margin: '16px 0' }} />

            <Descriptions column={1} labelStyle={{ color: '#8c8c8c', width: '120px' }} contentStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="Đã vào lần đầu">
                {playerData.daVaoTaiKhoanLanDau ? <Tag color="success">Đã vào</Tag> : <Tag color="default">Chưa vào</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Đệ tử">
                {playerData.coDeTu ? <Tag color="success">Có</Tag> : <Tag color="error">Không</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label={<><EnvironmentOutlined /> Bản đồ</>}>
                {playerData.mapHienTai || 'Không rõ'}
              </Descriptions.Item>
              <Descriptions.Item label="Tọa độ">
                <Text type="secondary">X: </Text>{playerData.x}
                <Divider type="vertical" />
                <Text type="secondary">Y: </Text>{playerData.y}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Chỉ số và Vật phẩm */}
        <Col xs={24} lg={16}>
          <Card bordered={false} className="shadow-sm" style={{ height: '100%' }} styles={{ body: { padding: 0 } }}>
            <Tabs
              defaultActiveKey="1"
              type="line"
              size="large"
              tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
              items={[
                {
                  key: '1',
                  label: 'Tài sản & Chỉ số',
                  children: (
                    <div style={{ padding: 24, background: '#fafbfc' }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic
                              title={<><ThunderboltOutlined style={{ color: '#faad14' }} /> Sức mạnh</>}
                              value={formatLongValue(playerData.sucManh)}
                              valueStyle={{ fontWeight: 600, fontSize: 22 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic
                              title={<><DollarOutlined style={{ color: '#fadb14' }} /> Vàng</>}
                              value={formatLongValue(playerData.vang)}
                              valueStyle={{ color: '#d4b106', fontWeight: 600, fontSize: 22 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic
                              title={<><StarOutlined style={{ color: '#52c41a' }} /> Ngọc</>}
                              value={formatLongValue(playerData.ngoc)}
                              valueStyle={{ color: '#389e0d', fontWeight: 600, fontSize: 22 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Card className="stat-card" bordered={false} style={{ background: '#f0f5ff' }}>
                            <Statistic
                              title="Vàng nạp từ Web"
                              value={formatLongValue(playerData.vangNapTuWeb)}
                              valueStyle={{ color: '#1d39c4', fontWeight: 600, fontSize: 20 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Card className="stat-card" bordered={false} style={{ background: '#f6ffed' }}>
                            <Statistic
                              title="Ngọc nạp từ Web"
                              value={formatLongValue(playerData.ngocNapTuWeb)}
                              valueStyle={{ color: '#237804', fontWeight: 600, fontSize: 20 }}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Vật phẩm Web',
                  children: (
                    <div style={{ padding: 24 }}>
                      {playerData.danhSachVatPhamWeb && playerData.danhSachVatPhamWeb.length > 0 ? (
                        <List
                          dataSource={playerData.danhSachVatPhamWeb}
                          renderItem={(item: any, index) => (
                            <List.Item>
                              <Typography.Text mark>[{index + 1}]</Typography.Text> {JSON.stringify(item)}
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có vật phẩm nào trên Web" style={{ margin: '40px 0' }} />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', maxHeight: '30vh' }}>
      <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>Tra cứu thông tin người chơi</Title>
            <Text type="secondary">Nhập Auth ID để xem chi tiết thông tin, tọa độ và tài sản của tài khoản trong Game.</Text>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Search
              placeholder="Nhập Auth ID (VD: 1)"
              allowClear
              enterButton={<><SearchOutlined /> Tìm kiếm</>}
              size="large"
              onSearch={handleSearch}
              loading={loading}
              style={{ maxWidth: 400, width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {renderUserInfo()}
      </Spin>

      <style>{`
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
          border-radius: 12px;
        }
        .stat-card {
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          border: 1px solid #f0f0f0;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
          border-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default QuanLyGame;