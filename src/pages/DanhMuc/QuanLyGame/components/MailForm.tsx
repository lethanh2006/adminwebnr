import React from 'react';
import { Card, Form, Input, InputNumber, Button, message, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { lockPlayerTemporarily } from '@/services/PlayerManager/api';

interface Props {
  token: string;
  userId: number;
}

const BanAction: React.FC<Props> = ({ token, userId }) => {
  const onFinish = async (values: any) => {
    try {
      await lockPlayerTemporarily({ ...values, userId }, token);
      message.success(`Đã khóa người chơi ${userId}`);
    } catch {
      message.error("Lỗi thực hiện lệnh ban!");
    }
  };

  return (
    <Card title="Hình Phạt" variant="borderless" className="shadow-sm">
      <Alert message={`Đang chọn ID: ${userId}`} type="info" showIcon style={{ marginBottom: 15 }} />
      <Form layout="vertical" onFinish={onFinish} initialValues={{ phut: 60 }}>
        <Form.Item name="phut" label="Thời gian khóa (phút)">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="why" label="Lý do" rules={[{ required: true }]}>
          <Input.TextArea placeholder="Lý do vi phạm..." />
        </Form.Item>
        <Button danger type="primary" htmlType="submit" icon={<LockOutlined />} block>
          Khóa Tài Khoản
        </Button>
      </Form>
    </Card>
  );
};

export default BanAction;