import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getNpcsByMap, NpcData, MapData } from '@/services/GameManager/api';

interface NpcListProps {
  map: MapData;
}

const NpcList: React.FC<NpcListProps> = ({ map }) => {
  const [npcs, setNpcs] = useState<NpcData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (map && map.id) {
      fetchNpcs(map.id);
    }
  }, [map]);

  const fetchNpcs = async (mapId: number) => {
    setLoading(true);
    try {
      const response = await getNpcsByMap(mapId);
      const data = response?.data || response;
      if (data && data.npcs) {
        setNpcs(data.npcs);
      } else {
        setNpcs([]);
        message.warning('Map này chưa có NPC nào hoặc không thể tải dữ liệu');
      }
    } catch (error) {
      console.error('Error fetching npcs:', error);
      message.error('Có lỗi xảy ra khi lấy danh sách NPC');
      setNpcs([]);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<NpcData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'NPC Base ID',
      dataIndex: 'npc_base_id',
      key: 'npc_base_id',
      width: 120,
    },
    {
      title: 'Tên NPC',
      dataIndex: 'ten_npc',
      key: 'ten_npc',
    },
    {
      title: 'Loại NPC',
      dataIndex: 'loai_npc',
      key: 'loai_npc',
      render: (text) => {
        let color = 'default';
        if (text === 'NGUOI') color = 'blue';
        else if (text === 'CAYDAU') color = 'green';
        else if (text === 'RUONGDO') color = 'gold';
        else if (text === 'DUIGA') color = 'volcano';

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tọa độ X',
      dataIndex: 'x',
      key: 'x',
      width: 100,
    },
    {
      title: 'Tọa độ Y',
      dataIndex: 'y',
      key: 'y',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Đã ẩn'}
        </Tag>
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', minHeight: '400px' }}>
      <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
        Danh sách NPC tại: <span style={{ color: '#1890ff' }}>{map.ten}</span> (ID: {map.id})
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin tip="Đang tải danh sách NPC..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={npcs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      )}
    </div>
  );
};

export default NpcList;
