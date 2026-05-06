import React from 'react';
import { Card, Form, Input, InputNumber, Button, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface Props {
    userId: number;
    onBan: (phut: number, why: string) => void;
}

const BanControl: React.FC<Props> = ({ userId, onBan }) => {
    const onFinish = (values: any) => {
        onBan(values.phut, values.why);
    };

    return (
        <Card title="Trạng Thái Tài Khoản" variant="borderless" className="shadow-sm">
            <Alert message={`Đang tác động ID: ${userId}`} type="warning" showIcon style={{ marginBottom: 16 }} />
            <Form layout="vertical" onFinish={onFinish} initialValues={{ phut: 60 }}>
                <Form.Item label="Thời gian khóa (phút)" name="phut">
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Lý do khóa" name="why" rules={[{ required: true }]}>
                    <Input.TextArea placeholder="Lý do..." />
                </Form.Item>
                <Button type="primary" danger htmlType="submit" icon={<LockOutlined />} block>
                    Khóa Tài Khoản
                </Button>
            </Form>
        </Card>
    );
};

export default BanControl;