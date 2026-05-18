import map1 from '@/assets/map1.png';
import map2 from '@/assets/map2.png';
import map3 from '@/assets/map3.png';
import noimg from '@/assets/noimg.png';
import { getMaps, MapData } from '@/services/GameManager/api';
import { Card, message, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

interface MapListProps {
	selectedMapId?: number;
	onSelectMap: (map: MapData) => void;
}

const MapList: React.FC<MapListProps> = ({ selectedMapId, onSelectMap }) => {
	const [maps, setMaps] = useState<MapData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [previewVisible, setPreviewVisible] = useState<boolean>(false);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [previewTitle, setPreviewTitle] = useState<string>('');
	const [previewFull, setPreviewFull] = useState<boolean>(false);

	useEffect(() => {
		fetchMaps();
	}, []);

	const fetchMaps = async () => {
		setLoading(true);
		try {
			const response = await getMaps();
			const data = response?.data || response;
			if (data && data.maps) {
				setMaps(data.maps);
			} else {
				message.error('Không thể lấy dữ liệu map');
			}
		} catch (error) {
			console.error('Error fetching maps:', error);
			message.error('Có lỗi xảy ra khi lấy danh sách map');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: '20px' }}>
				<Spin tip='Đang tải danh sách map...' />
			</div>
		);
	}

	return (
		<div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '10px' }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{maps.map((map) => (
					<Card
						key={map.id}
						hoverable
						size='small'
						onClick={() => onSelectMap(map)}
						style={{
							borderColor: selectedMapId === map.id ? '#1890ff' : '#f0f0f0',
							borderWidth: selectedMapId === map.id ? '2px' : '1px',
							backgroundColor: selectedMapId === map.id ? '#e6f7ff' : '#fff',
							transition: 'all 0.3s',
							borderRadius: '8px',
							cursor: 'pointer',
						}}
						bodyStyle={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}
					>
						{/* Khung chứa ảnh map, hiển thị theo map.id */}
						<div
							style={{
								width: '70px',
								height: '70px',
								borderRadius: '6px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
								overflow: 'hidden',
								border: selectedMapId === map.id ? '1px solid #91caff' : '1px dashed #d9d9d9',
								backgroundColor: selectedMapId === map.id ? '#eaf6ff' : '#fff',
								transition: 'all 0.3s',
							}}
						>
							<img
								src={map.id === 1 ? map1 : map.id === 2 ? map2 : map.id === 3 ? map3 : noimg}
								alt={`map-${map.id}`}
								style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
								onClick={(e) => {
									e.stopPropagation();
									setPreviewSrc(map.id === 1 ? map1 : map.id === 2 ? map2 : map.id === 3 ? map3 : noimg);
									setPreviewTitle(map.ten || `Map ${map.id}`);
									setPreviewVisible(true);
								}}
							/>
						</div>

						{/* Thông tin map */}
						<div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
							<div style={{ fontWeight: 'bold', fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>
								ID: {map.id}
							</div>
							<div
								style={{
									color: selectedMapId === map.id ? '#0958d9' : '#262626',
									fontSize: '15px',
									fontWeight: 500,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
								}}
							>
								{map.ten}
							</div>
						</div>
					</Card>
				))}
			</div>
			{/* Image preview modal */}
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
		</div>
	);
};

export default MapList;
