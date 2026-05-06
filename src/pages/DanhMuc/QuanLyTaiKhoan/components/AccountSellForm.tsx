import { Button, Card, Form, Input, InputNumber } from 'antd';
import type { AccountFormValue } from '../types';

const { TextArea } = Input;

interface AccountSellFormProps {
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialValues?: Partial<AccountFormValue>;
  onSubmit: (values: AccountFormValue) => Promise<void> | void;
  onCancel?: () => void;
}

const AccountSellForm = ({
  loading,
  mode = 'create',
  initialValues,
  onSubmit,
  onCancel,
}: AccountSellFormProps) => {
  const [form] = Form.useForm<AccountFormValue>();

  return (
    <Card bordered={false}>
      <Form
        form={form}
        layout='vertical'
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Form.Item
          name='username'
          label='Tên tài khoản game'
          rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản' }]}
        >
          <Input placeholder='Ví dụ: ngocrong_vip01' />
        </Form.Item>

        <Form.Item
          name='password'
          label='Mật khẩu'
          rules={[{ required: mode === 'create', message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder='Nhập mật khẩu account' />
        </Form.Item>

        <Form.Item
          name='url'
          label='Link thông tin / hình ảnh account'
          rules={[{ required: true, message: 'Vui lòng nhập link account' }]}
        >
          <Input placeholder='https://...' />
        </Form.Item>

        <Form.Item
          name='description'
          label='Mô tả account'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả account' }]}
        >
          <TextArea rows={4} placeholder='Thông tin vật phẩm, chỉ số, server, lưu ý,...' />
        </Form.Item>

        <Form.Item
          name='price'
          label='Giá bán (VNĐ)'
          rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1000}
            step={1000}
            formatter={(value) => `${value ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            placeholder='Ví dụ: 150000'
          />
        </Form.Item>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Hủy
            </Button>
          )}
          <Button type='primary' htmlType='submit' loading={loading}>
            {mode === 'create' ? 'Đăng bán account' : 'Cập nhật account'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AccountSellForm;
