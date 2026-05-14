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
      const data = (res as any)?.data?.bans || (res as any)?.data || [];
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

  const columns: any = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
      render: (text: any) => <Text strong>{text}</Text>,
    },
    {
      title: 'Người Ban',
      dataIndex: 'admin',
      key: 'admin',
      align: 'center',
      render: (text: any) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startAt',
      key: 'startAt',
      align: 'center',
    },
    {
      title: 'Kết thúc',
      dataIndex: 'expireAt',
      key: 'expireAt',
      align: 'center',
      render: (text: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          {record.ttl ? <Text type="secondary" style={{ fontSize: 12 }}>Còn {record.ttl}s</Text> : null}
        </div>
      )
    },
    {
      title: 'Lý do',
      dataIndex: 'why',
      key: 'why',
      align: 'center',
      render: (text: any) => <Text type="danger">{text}</Text>
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xác nhận mở khóa"
          description={`Mở khóa cho User ID ${record.userId}?`}
          onConfirm={async () => {
            try {
              await unbanUser(record.userId);
              message.success('Mở khóa thành công!');
              fetchBannedUsers();
            } catch (e) {
              console.error(e);
              message.error('Có lỗi xảy ra!');
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
    return { 
      key: u.userId || idx, 
      userId: u.userId, 
      admin: u.data?.admin || 'N/A',
      why: u.data?.why || 'N/A',
      startAt: u.data?.startAt || 'N/A',
      expireAt: u.data?.expireAt || 'N/A',
      ttl: u.ttl,
    };
  });

  return (
    <Card bordered={false} className="shadow-sm" style={{ width: '100%', minHeight: 400, minWidth: 1200 }}>
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
