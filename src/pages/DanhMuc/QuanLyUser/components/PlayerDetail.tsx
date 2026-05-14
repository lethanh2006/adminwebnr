import React from 'react';
import { Card, Descriptions, Tag, Row, Col, Tabs, Statistic, Empty, Typography, List, Space, Avatar, Divider, Button, Popconfirm } from 'antd';
import { UserOutlined, EnvironmentOutlined, DollarOutlined, StarOutlined, ThunderboltOutlined, MailOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { PlayerProfileResponse } from '@/services/PlayerManager/api';
import { formatLongValue } from '../utils';
import blackGoku from "@/assets/avt.png";
import trungdetu from "@/assets/trung_de_tu.png";
import aovaitho from "@/assets/ao.png";
import quanthanlinh from "@/assets/quan.png";
import gangvaitho from "@/assets/gang.png";
import giayvaitho from "@/assets/giay.png";
import rada from "@/assets/rada.png";

interface Item {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const itemsMock: Item[] = [
  { id: 1, name: 'Cải trang black goku', description: 'Cải trang thành Super Black Goku', image: blackGoku, price: 10000 },
  { id: 2, name: 'Trứng đệ tử', description: 'giúp người chơi sở hữu đệ tử.', image: trungdetu, price: 20000 },
  { id: 3, name: 'Áo vải thô', description: 'Giúp giảm sát thương', image: aovaitho, price: 30000 },
  { id: 4, name: 'Quần thần linh', description: 'Giúp tăng HP', image: quanthanlinh, price: 40000 },
  { id: 5, name: 'Găng vải thô', description: 'Giúp tăng sức đánh', image: gangvaitho, price: 50000 },
  { id: 6, name: 'Giày vải thô', description: 'Giúp tăng MP', image: giayvaitho, price: 60000 },
  { id: 7, name: 'Rada', description: 'Giúp tăng Chí Mạng', image: rada, price: 70000 }
];

const { Title, Text } = Typography;

interface Props {
  playerData: PlayerProfileResponse['user'];
  onSendEmail: () => void;
  onBan: () => void;
  onUnban: () => void;
}

export const PlayerDetail: React.FC<Props> = ({ playerData, onSendEmail, onBan, onUnban }) => {
  return (
    <Row gutter={[24, 24]}>
        {/* Thông tin chính & Actions */}
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

            {/* Action Bar */}
            <div style={{ marginTop: 16, marginBottom: 24, textAlign: 'center' }}>
              <Space wrap style={{ justifyContent: 'center' }}>
                <Button 
                  type="primary" 
                  icon={<MailOutlined />} 
                  onClick={onSendEmail}
                >
                  Gửi thư
                </Button>
                <Button 
                  danger 
                  type="primary" 
                  icon={<LockOutlined />} 
                  onClick={onBan}
                >
                  Khóa tạm thời
                </Button>
                <Popconfirm
                  title="Xác nhận mở khóa"
                  description={`Bạn có chắc chắn muốn mở khóa tài khoản ID ${playerData.id} không?`}
                  onConfirm={onUnban}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button 
                    style={{ color: '#52c41a', borderColor: '#52c41a' }} 
                    icon={<UnlockOutlined />}
                  >
                    Mở khóa
                  </Button>
                </Popconfirm>
              </Space>
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
                  label: 'Thông tin & Chỉ số',
                  children: (
                    <div style={{ padding: 24, background: '#fafbfc', minHeight: 400 }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic 
                              title={<><ThunderboltOutlined style={{ color: '#faad14' }}/> Sức mạnh</>} 
                              value={formatLongValue(playerData.sucManh)} 
                              valueStyle={{ fontWeight: 600, fontSize: 22 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic 
                              title={<><DollarOutlined style={{ color: '#fadb14' }}/> Vàng</>} 
                              value={formatLongValue(playerData.vang)} 
                              valueStyle={{ color: '#d4b106', fontWeight: 600, fontSize: 22 }}
                            />
                          </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                          <Card className="stat-card" bordered={false} style={{ background: '#fff' }}>
                            <Statistic 
                              title={<><StarOutlined style={{ color: '#52c41a' }}/> Ngọc</>} 
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
                    <div style={{ padding: 24, height: 400, overflowY: 'auto' }}>
                      {playerData.danhSachVatPhamWeb && playerData.danhSachVatPhamWeb.length > 0 ? (
                        <List
                          dataSource={playerData.danhSachVatPhamWeb}
                          renderItem={(item: any, index) => {
                            const itemData = itemsMock.find((i) => i.id === Number(item));
                            
                            if (itemData) {
                              return (
                                <List.Item style={{ padding: '16px 24px', background: '#fff', borderRadius: 8, marginBottom: 12, border: '1px solid #f0f0f0' }}>
                                  <List.Item.Meta
                                    avatar={<Avatar src={itemData.image} shape="square" size={64} style={{ border: '1px solid #f0f0f0' }} />}
                                    title={<Typography.Text strong style={{ fontSize: 16, color: '#1890ff' }}>{itemData.name}</Typography.Text>}
                                    description={itemData.description}
                                  />
                                  <div>
                                    <Tag color="gold" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16, fontWeight: 600 }}>
                                      {itemData.price.toLocaleString()} VNĐ
                                    </Tag>
                                  </div>
                                </List.Item>
                              );
                            }

                            return (
                              <List.Item>
                                <Typography.Text mark>[{index + 1}]</Typography.Text> Vật phẩm ID: {JSON.stringify(item)}
                              </List.Item>
                            );
                          }}
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
