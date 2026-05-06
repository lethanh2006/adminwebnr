import React from 'react';
import { Card, Descriptions, Tag, Badge, Typography } from 'antd';
import { PlayerProfile } from '../types';

const { Text } = Typography;

interface Props {
    data: PlayerProfile;
}

const ProfileView: React.FC<Props> = ({ data }) => {
    const formatNum = (val: any) => (val?.low ?? 0).toLocaleString();

    return (
        <Card title="Chi Tiết Nhân Vật" variant="borderless" className="shadow-sm">
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Nhân vật">
                    <Text strong style={{ color: '#1677ff' }}>{data.gameName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Vị trí">
                    <Tag color="cyan">{data.mapHienTai}</Tag> ({data.x}, {data.y})
                </Descriptions.Item>
                <Descriptions.Item label="Sức mạnh">
                    <Text type="danger" strong>{formatNum(data.sucManh)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tài chính">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text style={{ color: '#faad14' }}>Vàng: {formatNum(data.vang)}</Text>
                        <Text style={{ color: '#52c41a' }}>Ngọc: {formatNum(data.ngoc)}</Text>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {data.coDeTu ? <Badge status="success" text="Có đệ tử" /> : <Badge status="default" text="Chưa có đệ tử" />}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default ProfileView;