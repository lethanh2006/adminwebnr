import type { NpcShopItem } from '@/services/GameManager/api';
// dayjs removed (not used in this table)
import noimg from '@/assets/noimg.png';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

const { Text } = Typography;

interface NpcShopTableProps {
	data: NpcShopItem[];
	loading?: boolean;
	onEdit: (record: NpcShopItem) => void;
	onDelete: (id: number) => void;
}

const formatCurrency = (value?: number) => {
	if (typeof value !== 'number') return '0';
	return value.toLocaleString('vi-VN');
};

const NpcShopTable: React.FC<NpcShopTableProps> = ({ data, loading, onEdit, onDelete }) => {
	const [previewVisible, setPreviewVisible] = useState<boolean>(false);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [previewTitle, setPreviewTitle] = useState<string>('');
	const [previewFull, setPreviewFull] = useState<boolean>(false);

	const resolveImg = (id?: number | string) => {
		if (!id && id !== 0) return noimg;
		try {
			const req = (require as any)(`@/assets/${id}.png`);
			return req && req.default ? req.default : req;
		} catch (err) {
			return noimg;
		}
	};
	const columns: ColumnsType<NpcShopItem> = [
		{
			title: 'Ảnh',
			key: 'image',
			width: 96,
			align: 'center',
			render: (_, record) => {
				const src = resolveImg(record.item_base_id ?? record.item_base_id);
				return (
					<div
						style={{
							width: 72,
							height: 72,
							overflow: 'hidden',
							borderRadius: 8,
							border: '1px solid #f0f0f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<img
							src={src}
							alt={`item-${record.item_base_id}`}
							style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
							onClick={(e) => {
								e.stopPropagation();
								setPreviewSrc(src);
								setPreviewTitle(record.ten_item || `Item ${record.item_base_id}`);
								setPreviewVisible(true);
							}}
						/>
					</div>
				);
			},
		},
		{
			title: 'Item',
			key: 'item_base_id',
			width: 160,
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
			align: 'left',
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Loại tiền',
			dataIndex: 'loaiTien',
			key: 'loaiTien',
			width: 80,
			render: (value: string) => <Tag color='blue'>{value}</Tag>,
		},
		{
			title: 'Tab',
			dataIndex: 'tab',
			key: 'tab',
			width: 80,
			render: (value: string) => <Tag>{value || '-'}</Tag>,
		},

		{
			title: 'Trạng thái',
			dataIndex: 'is_active',
			key: 'is_active',
			width: 90,
			render: (value: boolean) => <Tag color={value ? 'success' : 'default'}>{value ? 'Hoạt động' : 'Tạm tắt'}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 90,
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
		<>
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

			{/* Preview modal */}
			<Modal
				visible={previewVisible}
				title={previewTitle + (previewFull ? ' (Full)' : '')}
				footer={null}
				onCancel={() => {
					setPreviewVisible(false);
					setPreviewFull(false);
				}}
				centered
				width={previewFull ? '100vw' : '90vw'}
				style={previewFull ? { top: 0 } : { top: 20 }}
				bodyStyle={{ textAlign: 'center', padding: previewFull ? 0 : 12, background: 'transparent' }}
			>
				{previewSrc && (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								padding: previewFull ? 0 : 12,
								background: '#fff',
								borderRadius: 8,
								boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
								maxWidth: previewFull ? '100%' : 'calc(90vw - 48px)',
								width: '100%',
							}}
						>
							<img
								src={previewSrc}
								alt={previewTitle}
								onDoubleClick={() => setPreviewFull((v) => !v)}
								style={{
									width: '100%',
									height: previewFull ? '100vh' : 'auto',
									maxHeight: previewFull ? '100vh' : '80vh',
									objectFit: 'contain',
									display: 'block',
									borderRadius: 6,
								}}
							/>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default NpcShopTable;
