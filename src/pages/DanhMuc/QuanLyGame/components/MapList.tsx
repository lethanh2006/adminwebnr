import React, { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import { getMaps, MapData } from '@/services/GameManager/api';

interface MapListProps {
  selectedMapId?: number;
  onSelectMap: (map: MapData) => void;
}

const MapList: React.FC<MapListProps> = ({ selectedMapId, onSelectMap }) => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        <Spin tip="Đang tải danh sách map..." />
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
            size="small"
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
            {/* Khung chứa ảnh placeholder */}
            <div 
              style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: selectedMapId === map.id ? '#bae0ff' : '#f5f5f5', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                border: selectedMapId === map.id ? '1px solid #91caff' : '1px dashed #d9d9d9',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '10px', color: selectedMapId === map.id ? '#0958d9' : '#bfbfbf', fontWeight: 500 }}>Ảnh</span>
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
                  textOverflow: 'ellipsis'
                }}
              >
                {map.ten}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapList;
