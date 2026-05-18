import type { ItemBase, LongValue, NpcBase, NpcShopItem } from '@/services/GameManager/api';
import dayjs from '@/utils/dayjs';
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Switch } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useEffect } from 'react';

interface NpcShopFormValues {
	npc_base_id: number;
	item_base_id: number;
	gia: number;
	loaiTien: string;
	tab: string;
	is_active: boolean;
	start_at: Dayjs;
	end_at: Dayjs;
}

interface NpcShopFormModalProps {
	open: boolean;
	submitting?: boolean;
	npcBases: NpcBase[];
	itemBases: ItemBase[];
	editingItem: NpcShopItem | null;
	defaultNpcBaseId?: number;
	onCancel: () => void;
	onSubmit: (payload: {
		npc_base_id: number;
		item_base_id: number;
		gia: number;
		loaiTien: string;
		tab: string;
		is_active: boolean;
		start_at: number;
		end_at: number;
	}) => Promise<void>;
}

const CURRENCY_OPTIONS = [
	{ value: 'NGOC', label: 'NGOC' },
	{ value: 'VANG', label: 'VANG' },
];

const toLongNumber = (value?: number | LongValue) => {
	if (typeof value === 'number') return value;
	if (!value || typeof value !== 'object') return undefined;

	const low = BigInt(value.low >>> 0);
	const high = BigInt(value.high);
	return Number((high << 32n) + low);
};

const NpcShopFormModal: React.FC<NpcShopFormModalProps> = ({
	open,
	submitting,
	npcBases,
	itemBases,
	editingItem,
	defaultNpcBaseId,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm<NpcShopFormValues>();

	useEffect(() => {
		if (!open) return;

		if (editingItem) {
			const startAt = toLongNumber(editingItem.start_at);
			const endAt = toLongNumber(editingItem.end_at);
			const now = dayjs().startOf('hour');

			form.setFieldsValue({
				npc_base_id: editingItem.npc_base_id,
				item_base_id: editingItem.item_base_id,
				gia: toLongNumber(editingItem.gia as number | LongValue) ?? 0,
				loaiTien: editingItem.loaiTien,
				tab: editingItem.tab,
				is_active: editingItem.is_active,
				start_at: startAt ? dayjs(startAt) : now,
				end_at: endAt ? dayjs(endAt) : now.add(7, 'day'),
			});
			return;
		}

		const start = dayjs().startOf('hour');
		form.setFieldsValue({
			npc_base_id: defaultNpcBaseId,
			is_active: true,
			gia: 1000,
			loaiTien: 'NGOC',
			tab: 'DAC_BIET',
			start_at: start,
			end_at: start.add(7, 'day'),
		});
	}, [open, editingItem, defaultNpcBaseId, form]);

	const handleOk = async () => {
		const values = await form.validateFields();

		await onSubmit({
			npc_base_id: values.npc_base_id,
			item_base_id: values.item_base_id,
			gia: values.gia,
			loaiTien: values.loaiTien,
			tab: values.tab,
			is_active: values.is_active,
			start_at: values.start_at.valueOf(),
			end_at: values.end_at.valueOf(),
		});

		form.resetFields();
	};

	const disabledEndDate = (current: Dayjs) => {
		const startAt = form.getFieldValue('start_at');
		if (!startAt || !current) return false;
		return current.isBefore(startAt);
	};

	return (
		<Modal
			title={editingItem ? 'Cập nhật item trong shop NPC' : 'Thêm item vào shop NPC'}
			open={open}
			onCancel={onCancel}
			onOk={handleOk}
			okText='Lưu'
			cancelText='Hủy'
			confirmLoading={submitting}
			width={760}
			destroyOnClose
		>
			<Form form={form} layout='vertical' preserve={false}>
				<Row gutter={12}>
					<Col xs={24} md={12}>
						<Form.Item name='npc_base_id' label='NPC' rules={[{ required: true, message: 'Vui lòng chọn NPC' }]}>
							<Select
								showSearch={false}
								placeholder='Chọn NPC'
								disabled={!!editingItem}
								options={npcBases.map((npc) => ({
									value: npc.id,
									label: `[${npc.id}] ${npc.ten} (${npc.loai})`,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='item_base_id' label='Item' rules={[{ required: true, message: 'Vui lòng chọn item' }]}>
							<Select
								showSearch={false}
								placeholder='Chọn item base'
								options={itemBases.map((item) => ({
									value: item.id,
									label: `[${item.id}] ${item.ten}${item.ma ? ` (${item.ma})` : ''}`,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col xs={24} md={8}>
						<Form.Item name='gia' label='Giá' rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name='loaiTien'
							label='Loại tiền'
							rules={[{ required: true, message: 'Vui lòng chọn loại tiền' }]}
						>
							<Select options={CURRENCY_OPTIONS} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name='tab' label='Tab hiển thị' rules={[{ required: true, message: 'Vui lòng nhập tab' }]}>
							<Input placeholder='VD: DAC BIET' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={12}>
					<Col xs={24} md={12}>
						<Form.Item
							name='start_at'
							label='Thời gian bắt đầu'
							rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
						>
							<DatePicker showTime style={{ width: '100%' }} format='DD/MM/YYYY HH:mm' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='end_at'
							label='Thời gian kết thúc'
							rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
						>
							<DatePicker showTime style={{ width: '100%' }} format='DD/MM/YYYY HH:mm' disabledDate={disabledEndDate} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='is_active' label='Kích hoạt' valuePropName='checked'>
					<Switch checkedChildren='Bật' unCheckedChildren='Tắt' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default NpcShopFormModal;
