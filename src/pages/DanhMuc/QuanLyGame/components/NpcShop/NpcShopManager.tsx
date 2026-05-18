import {
	createNpcShopItem,
	deleteNpcShopItem,
	getItemBases,
	getNpcBases,
	getNpcShopItems,
	updateNpcShopItem,
	type ItemBase,
	type LongValue,
	type NpcBase,
	type NpcShopItem,
} from '@/services/GameManager/api';
import { Card, Empty, message, Space, Statistic, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import NpcShopFormModal from './NpcShopFormModal';
import NpcShopTable from './NpcShopTable';
import NpcShopToolbar from './NpcShopToolbar';

const { Text } = Typography;

const normalizeList = (payload: any, fallbackKeys: string[]) => {
	if (Array.isArray(payload)) return payload;
	if (!payload || typeof payload !== 'object') return [];

	for (const key of fallbackKeys) {
		if (Array.isArray(payload[key])) {
			return payload[key];
		}
	}

	return [];
};

const toLongNumber = (value?: number | LongValue) => {
	if (typeof value === 'number') return value;
	if (!value || typeof value !== 'object') return undefined;

	const low = BigInt(value.low >>> 0);
	const high = BigInt(value.high);
	return Number((high << 32n) + low);
};

const normalizeShopItem = (item: NpcShopItem): NpcShopItem => ({
	...item,
	gia: toLongNumber(item.gia as number | LongValue) ?? 0,
	start_at: toLongNumber(item.start_at),
	end_at: toLongNumber(item.end_at),
});

const NpcShopManager: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [npcBases, setNpcBases] = useState<NpcBase[]>([]);
	const [itemBases, setItemBases] = useState<ItemBase[]>([]);
	const [shopItems, setShopItems] = useState<NpcShopItem[]>([]);
	const [selectedNpcBaseId, setSelectedNpcBaseId] = useState<number | undefined>();
	const [modalOpen, setModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<NpcShopItem | null>(null);

	const activeCount = useMemo(() => shopItems.filter((item) => item.is_active).length, [shopItems]);

	const loadShopItems = async (npcBaseId: number) => {
		try {
			setLoading(true);
			const res = await getNpcShopItems(npcBaseId);
			const data = res?.data || res;
			const items = normalizeList(data, ['items', 'npc_shops', 'npcShops', 'data']) as NpcShopItem[];

			setShopItems(items.map(normalizeShopItem));
		} catch (error) {
			console.error('loadShopItems error:', error);
			message.error('Không thể tải danh sách item shop NPC');
			setShopItems([]);
		} finally {
			setLoading(false);
		}
	};

	const loadBootstrap = async () => {
		try {
			setLoading(true);
			const [npcRes, itemRes] = await Promise.all([getNpcBases(), getItemBases()]);
			const npcData = npcRes?.data || npcRes;
			const itemData = itemRes?.data || itemRes;
			const npcList = normalizeList(npcData, ['npcs', 'items', 'data']) as NpcBase[];

			setNpcBases(npcList);
			setItemBases(normalizeList(itemData, ['items', 'itemBases', 'data']));

			if (npcList.length > 0) {
				const firstNpcId = npcList[0].id;
				setSelectedNpcBaseId(firstNpcId);
				await loadShopItems(firstNpcId);
			}
		} catch (error) {
			console.error('loadBootstrap error:', error);
			message.error('Không thể tải dữ liệu NPC/Item base');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadBootstrap();
	}, []);

	const handleChangeNpc = (value: number) => {
		setSelectedNpcBaseId(value);
		loadShopItems(value);
	};

	const handleCreate = () => {
		setEditingItem(null);
		setModalOpen(true);
	};

	const handleEdit = (record: NpcShopItem) => {
		setEditingItem(record);
		setModalOpen(true);
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteNpcShopItem(id);
			message.success('Xóa item khỏi shop thành công');
			if (selectedNpcBaseId) {
				loadShopItems(selectedNpcBaseId);
			}
		} catch (error) {
			console.error('handleDelete error:', error);
			message.error('Không thể xóa item khỏi shop');
		}
	};

	const handleSubmit = async (payload: {
		npc_base_id: number;
		item_base_id: number;
		gia: number;
		loaiTien: string;
		tab: string;
		is_active: boolean;
		start_at: number;
		end_at: number;
	}) => {
		if (payload.end_at < payload.start_at) {
			message.error('Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu');
			return;
		}

		try {
			setSubmitting(true);

			if (editingItem) {
				await updateNpcShopItem({
					id: editingItem.id,
					...payload,
				});
				message.success('Cập nhật item shop thành công');
			} else {
				await createNpcShopItem(payload);
				message.success('Thêm item vào shop thành công');
			}

			setModalOpen(false);
			setEditingItem(null);
			if (selectedNpcBaseId) {
				loadShopItems(selectedNpcBaseId);
			}
		} catch (error) {
			console.error('handleSubmit error:', error);
			message.error('Có lỗi khi lưu item shop');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<Card bordered={false} style={{ marginBottom: 16 }}>
				<Space size={24} wrap>
					<Statistic title='Tổng item trong shop' value={shopItems.length} />
					<Statistic title='Đang hoạt động' value={activeCount} />
					<Statistic title='Tạm tắt' value={shopItems.length - activeCount} />
				</Space>
			</Card>

			<Card bordered={false}>
				<NpcShopToolbar
					loading={loading}
					npcBases={npcBases}
					selectedNpcBaseId={selectedNpcBaseId}
					onChangeNpcBase={handleChangeNpc}
					onCreate={handleCreate}
					onRefresh={() => {
						if (selectedNpcBaseId) {
							loadShopItems(selectedNpcBaseId);
						}
					}}
				/>

				{!selectedNpcBaseId && !loading ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={<Text type='secondary'>Vui lòng chọn NPC base để xem danh sách shop</Text>}
					/>
				) : shopItems.length === 0 && !loading ? (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={<Text type='secondary'>Chưa có item shop cho bộ lọc hiện tại</Text>}
					/>
				) : (
					<NpcShopTable data={shopItems} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
				)}
			</Card>

			<NpcShopFormModal
				open={modalOpen}
				submitting={submitting}
				npcBases={npcBases}
				itemBases={itemBases}
				editingItem={editingItem}
				defaultNpcBaseId={selectedNpcBaseId}
				onCancel={() => {
					setModalOpen(false);
					setEditingItem(null);
				}}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default NpcShopManager;
