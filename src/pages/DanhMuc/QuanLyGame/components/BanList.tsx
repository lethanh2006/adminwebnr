import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Popconfirm, Button, Table, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getBannedUsers, unbanUser } from '@/services/PlayerManager/api';

const { Title, Text } = Typography;

export const BanList = () => {
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [loadingBanned, setLoadingBanned] = useState(false);

  const fetchBannedUsers = async () => {
    setLoadingBanned(true);
    try {
      const res = await getBannedUsers();
      const data = (res as any)?.data?.data || (res as any)?.data || [];
      if (Array.isArray(data)) {
        setBannedUsers(data);
      }
    } catch (error) {
      console.error('Error fetching banned users:', error);
    } finally {
      setLoadingBanned(false);
    }
  };

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: any) => <Text strong>{text}</Text>,
    },
    {
      title: 'Thời gian (Phút)',
      dataIndex: 'phut',
      key: 'phut',
      render: (text: any) => <Tag color="volcano">{text} phút</Tag>,
    },
    {
      title: 'Lý do',
      dataIndex: 'why',
      key: 'why',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xác nhận mở khóa"
          description={`Mở khóa cho User ID ${record.userId || record.id}?`}
          onConfirm={async () => {
            try {
              await unbanUser(record.userId || record.id);
              message.success('Mở khóa thành công!');
              fetchBannedUsers();
            } catch (e) {
              console.error(e);
            }
          }}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button size="small" style={{ color: '#52c41a', borderColor: '#52c41a' }}>Mở khóa</Button>
        </Popconfirm>
      ),
    },
  ];

  const normalizedData = bannedUsers.map((u: any, idx: number) => {
    if (typeof u === 'number' || typeof u === 'string') return { key: idx, userId: u, phut: 'N/A', why: 'N/A' };
    return { ...u, key: u.id || u.userId || idx };
  });

  return (
    <Card bordered={false} className="shadow-sm">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Danh sách đang bị khóa</Title>
        <Button icon={<SearchOutlined />} onClick={fetchBannedUsers} loading={loadingBanned}>Làm mới</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={normalizedData} 
        loading={loadingBanned}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};
