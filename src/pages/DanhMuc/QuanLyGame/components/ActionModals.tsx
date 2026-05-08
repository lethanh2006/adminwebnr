import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

interface ActionModalsProps {
  isEmailVisible: boolean;
  isBanVisible: boolean;
  loading: boolean;
  emailForm: FormInstance;
  banForm: FormInstance;
  onCancelEmail: () => void;
  onCancelBan: () => void;
  onSubmitEmail: (values: { title: string; content: string }) => void;
  onSubmitBan: (values: { phut: any; why: string }) => void;
}

export const ActionModals: React.FC<ActionModalsProps> = ({
  isEmailVisible,
  isBanVisible,
  loading,
  emailForm,
  banForm,
  onCancelEmail,
  onCancelBan,
  onSubmitEmail,
  onSubmitBan,
}) => {
  return (
    <>
      <Modal
        title={<><MailOutlined /> Gửi thông báo cho người chơi</>}
        open={isEmailVisible}
        onCancel={onCancelEmail}
        footer={null}
        destroyOnClose
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={onSubmitEmail}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề thư"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thư' }]}
          >
            <Input placeholder="Nhập tiêu đề (Ví dụ: Chào mừng, Cảnh báo...)" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung thư' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung thông báo..." />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 32 }}>
            <Space>
              <Button onClick={onCancelEmail}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Gửi thư</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<><LockOutlined style={{ color: '#ff4d4f' }} /> Khóa tài khoản tạm thời</>}
        open={isBanVisible}
        onCancel={onCancelBan}
        footer={null}
        destroyOnClose
      >
        <Form
          form={banForm}
          layout="vertical"
          onFinish={onSubmitBan}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="phut"
            label="Thời gian khóa (phút)"
            rules={[
              { required: true, message: 'Vui lòng nhập thời gian' },
              { 
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (isNaN(value) || value < 5 || value > 4320) {
                    return Promise.reject('Thời gian khóa phải từ 5 đến 4320 phút (3 ngày)');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" placeholder="Ví dụ: 60 (1 tiếng)" suffix="phút" />
          </Form.Item>
          <Form.Item
            name="why"
            label="Lý do khóa"
            rules={[{ required: true, message: 'Vui lòng nhập lý do khóa tài khoản' }]}
          >
            <Input.TextArea rows={3} placeholder="Ví dụ: Sử dụng phần mềm thứ 3..." />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 32 }}>
            <Space>
              <Button onClick={onCancelBan}>Hủy</Button>
              <Button danger type="primary" htmlType="submit" loading={loading}>Khóa ngay</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
