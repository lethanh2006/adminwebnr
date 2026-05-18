import type { NpcBase } from '@/services/GameManager/api';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface NpcShopToolbarProps {
	npcBases: NpcBase[];
	selectedNpcBaseId?: number;
	loading?: boolean;
	onChangeNpcBase: (value: number) => void;
	onCreate: () => void;
	onRefresh: () => void;
}

const NpcShopToolbar: React.FC<NpcShopToolbarProps> = ({
	npcBases,
	selectedNpcBaseId,
	loading,
	onChangeNpcBase,
	onCreate,
	onRefresh,
}) => {
	return (
		<Row gutter={[12, 12]} align='middle' justify='space-between' style={{ marginBottom: 16 }}>
			<Col xs={24} md={14} lg={12}>
				<Space direction='vertical' size={4} style={{ width: '100%' }}>
					<Text strong>Chọn NPC để lọc shop item</Text>
					<Select
						showSearch={false}
						value={selectedNpcBaseId}
						placeholder='Chọn NPC base'
						onChange={(value) => onChangeNpcBase(value)}
						options={npcBases.map((npc) => ({
							value: npc.id,
							label: `[${npc.id}] ${npc.ten} (${npc.loai})`,
						}))}
					/>
				</Space>
			</Col>

			<Col xs={24} md={10} lg={12} style={{ textAlign: 'right' }}>
				<Space>
					<Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
						Tải lại
					</Button>
					<Button type='primary' icon={<PlusOutlined />} onClick={onCreate}>
						Thêm item vào shop
					</Button>
				</Space>
			</Col>
		</Row>
	);
};

export default NpcShopToolbar;
