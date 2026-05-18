import type { NpcShopItem } from '@/services/GameManager/api';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';

const { Text } = Typography;

interface NpcShopTableProps {
	data: NpcShopItem[];
	loading?: boolean;
	onEdit: (record: NpcShopItem) => void;
	onDelete: (id: number) => void;
}

const formatDateTime = (value?: number) => {
	if (!value) return '-';
	return dayjs(value).format('DD/MM/YYYY HH:mm');
};

const formatCurrency = (value?: number) => {
	if (typeof value !== 'number') return '0';
	return value.toLocaleString('vi-VN');
};

const NpcShopTable: React.FC<NpcShopTableProps> = ({ data, loading, onEdit, onDelete }) => {
	const columns: ColumnsType<NpcShopItem> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 80,
			fixed: 'left',
		},
		{
			title: 'NPC',
			key: 'npc_base_id',
			width: 220,
			render: (_, record) => (
				<Space direction='vertical' size={0}>
					<Text>[{record.npc_base_id}]</Text>
					<Text type='secondary'>{record.ten_npc || '-'}</Text>
				</Space>
			),
		},
		{
			title: 'Item',
			key: 'item_base_id',
			width: 260,
			render: (_, record) => (
				<Space direction='vertical' size={0}>
					<Text>
						[{record.item_base_id}] {record.ten_item || '-'}
					</Text>
					<Text type='secondary'>Mã: {record.ma_item || '-'}</Text>
				</Space>
			),
		},
		{
			title: 'Giá',
			dataIndex: 'gia',
			key: 'gia',
			width: 120,
			align: 'right',
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Loại tiền',
			dataIndex: 'loaiTien',
			key: 'loaiTien',
			width: 120,
			render: (value: string) => <Tag color='blue'>{value}</Tag>,
		},
		{
			title: 'Tab',
			dataIndex: 'tab',
			key: 'tab',
			width: 140,
			render: (value: string) => <Tag>{value || '-'}</Tag>,
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'start_at',
			key: 'start_at',
			width: 160,
			render: (value: number) => formatDateTime(value),
		},
		{
			title: 'Kết thúc',
			dataIndex: 'end_at',
			key: 'end_at',
			width: 160,
			render: (value: number) => formatDateTime(value),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'is_active',
			key: 'is_active',
			width: 120,
			render: (value: boolean) => <Tag color={value ? 'success' : 'default'}>{value ? 'Hoạt động' : 'Tạm tắt'}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 120,
			fixed: 'right',
			align: 'center',
			render: (_, record) => (
				<Space>
					<Button type='primary' size='small' icon={<EditOutlined />} onClick={() => onEdit(record)} />
					<Popconfirm
						title='Xóa item khỏi shop NPC'
						description='Bạn có chắc chắn muốn xóa item này không?'
						okText='Xóa'
						cancelText='Hủy'
						onConfirm={() => onDelete(record.id)}
					>
						<Button danger size='small' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Table
			bordered
			size='middle'
			rowKey='id'
			loading={loading}
			columns={columns}
			dataSource={data}
			pagination={{ pageSize: 10, showSizeChanger: true }}
			scroll={{ x: 1380 }}
		/>
	);
};

export default NpcShopTable;
