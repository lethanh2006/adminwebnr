import React, { useState } from 'react';
import { Form, Button, message, Input } from 'antd';
import { history } from 'umi';
import { useModel } from 'umi';

import { verifyOtp } from '@/services/base/api';
import bg from '@/assets/bg.png';

const Otp: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { initialState, setInitialState } = useModel('@@initialState');

    const handleVerifyOtp = async (values: { otp: string }) => {
        console.log('OTP nhập:', values.otp);
        try {
            setLoading(true);
            const sessionId = localStorage.getItem('sessionId');

            console.log('sessionId:', sessionId);
            if (!sessionId) {
                message.error('Thiếu sessionId, vui lòng đăng nhập lại');
                return;
            }

            const res = await verifyOtp({
                otp: values.otp,
                sessionId,
            });
            console.log('API response:', res);

            if (res?.data?.access_token) {
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('auth_id', res.data.auth_id);

                setInitialState({
                    ...initialState,
                    permissionLoading: false,
                });

                message.success('Đăng nhập thành công');
                history.push('/dashboard');
            }

        } catch (err) {
            message.error('OTP không đúng');
        }

        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    padding: '40px 48px',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    textAlign: 'center',
                }}
            >
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontWeight: 700, color: '#cc0000', fontSize: '24px' }}>
                        NHẬP OTP
                    </div>
                    <div style={{ color: '#004aad', marginTop: 8 }}>
                        VUI LÒNG NHẬP MÃ OTP ĐỂ XÁC THỰC
                    </div>
                </div>

                <Form onFinish={handleVerifyOtp}>
                    <Form.Item
                        name="otp"
                        rules={[{ required: true, message: 'Vui lòng nhập OTP' }]}
                    >
                        <Input.OTP
                            length={6}
                            style={{ justifyContent: 'center' }}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{
                            height: 44,
                            fontSize: 16,
                            background: '#0b3ba7',
                        }}
                    >
                        Xác nhận
                    </Button>
                    <div style={{ marginTop: 16 }}>
                        <a onClick={() => history.replace('/user/login')}>
                            ← Quay lại đăng nhập
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Otp;