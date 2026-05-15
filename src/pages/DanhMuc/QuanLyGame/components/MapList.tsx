import React, { useEffect, useState } from 'react';
import { Card, Spin, message, Row, Col } from 'antd';
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
      // Depending on axios configuration, response might be the data directly or nested
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
      <Row gutter={[16, 16]}>
        {maps.map((map) => (
          <Col xs={24} sm={12} md={24} lg={12} xl={8} key={map.id}>
            <Card
              hoverable
              size="small"
              onClick={() => onSelectMap(map)}
              style={{
                borderColor: selectedMapId === map.id ? '#1890ff' : '#f0f0f0',
                borderWidth: selectedMapId === map.id ? '2px' : '1px',
                backgroundColor: selectedMapId === map.id ? '#e6f7ff' : '#fff',
                transition: 'all 0.3s',
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                ID: {map.id}
              </div>
              <div style={{ color: '#595959', fontSize: '16px' }}>{map.ten}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MapList;
