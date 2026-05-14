import React, { useState } from 'react';
import { Card, Input, Row, Col, message, Spin, Tabs, Empty, Typography, Form } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, LockOutlined } from '@ant-design/icons';

import { getPlayerProfile, PlayerProfileResponse, sendEmailUser, temporaryBanUser, unbanUser } from '@/services/PlayerManager/api';
import { PlayerDetail } from './components/PlayerDetail';
import { BanList } from './components/BanList';
import { ActionModals } from './components/ActionModals';

const { Search } = Input;
const { Title, Text } = Typography;

const QuanLyUser = () => {
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<(PlayerProfileResponse['user'] & { username?: string }) | null>(null);


  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isBanModalVisible, setIsBanModalVisible] = useState(false);

  const [emailForm] = Form.useForm();
  const [banForm] = Form.useForm();

  const [refreshBanListCount, setRefreshBanListCount] = useState(0);
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('Vui lòng nhập Auth ID người dùng để tìm kiếm');
      return;
    }

    setLoading(true);
    try {
      const res = await getPlayerProfile(value);
      const rawData = (res as any)?.data || (res as any);
      const userData = rawData?.user || rawData?.data || null;
      const username = rawData?.username || '';

      if (userData && userData.id !== undefined) {
        setPlayerData({ ...userData, username });
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

  const handleSendEmail = async (values: { title: string; content: string }) => {
    if (!playerData) return;
    try {
      setLoading(true);
      await sendEmailUser({
        who: playerData.username || String(playerData.id),
        title: values.title,
        content: values.content,
      });
      message.success('Gửi email thành công!');
      setIsEmailModalVisible(false);
      emailForm.resetFields();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (values: { phut: any; why: string }) => {
    if (!playerData) return;
    try {
      setLoading(true);
      await temporaryBanUser({
        userId: playerData.id,
        phut: Number(values.phut),
        why: values.why,
      });
      message.success(`Đã khóa tài khoản thành công trong ${values.phut} phút!`);
      setIsBanModalVisible(false);
      banForm.resetFields();
      setRefreshBanListCount(prev => prev + 1);
    } catch (error) {
      console.error('Error banning user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!playerData) return;
    try {
      setLoading(true);
      await unbanUser(playerData.id);
      message.success('Mở khóa tài khoản thành công!');
      setRefreshBanListCount(prev => prev + 1);
    } catch (error) {
      console.error('Error unbanning user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', minWidth: 1200 }}>
      <Tabs
        defaultActiveKey="quan-ly"
        items={[
          {
            key: 'quan-ly',
            label: <><SafetyCertificateOutlined /> Quản lý Người Chơi</>,
            children: (
              <>
                <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24 }}>
                  <Row align="middle" justify="space-between" gutter={[16, 16]}>
                    <Col xs={24} md={14}>
                      <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>Tra cứu & Quản lý</Title>
                      <Text type="secondary">Nhập Auth ID để tra cứu thông tin và thực hiện các thao tác quản lý (Gửi thư, Khóa tài khoản).</Text>
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
                  {playerData ? (
                    <PlayerDetail
                      playerData={playerData}
                      onSendEmail={() => setIsEmailModalVisible(true)}
                      onBan={() => setIsBanModalVisible(true)}
                      onUnban={handleUnbanUser}
                    />
                  ) : (
                    <Card bordered={false} className="shadow-sm" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Empty description="Chưa có dữ liệu. Vui lòng nhập Auth ID để tra cứu" />
                    </Card>
                  )}
                </Spin>
              </>
            ),
          },
          {
            key: 'ban-list',
            label: <><LockOutlined /> Danh sách bị khóa</>,
            children: <BanList key={`banlist-${refreshBanListCount}`} />
          }
        ]}
      />

      <ActionModals
        isEmailVisible={isEmailModalVisible}
        isBanVisible={isBanModalVisible}
        loading={loading}
        emailForm={emailForm}
        banForm={banForm}
        onCancelEmail={() => setIsEmailModalVisible(false)}
        onCancelBan={() => setIsBanModalVisible(false)}
        onSubmitEmail={handleSendEmail}
        onSubmitBan={handleBanUser}
      />

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

export default QuanLyUser;