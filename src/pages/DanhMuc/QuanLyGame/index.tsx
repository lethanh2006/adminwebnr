import React, { useState } from 'react';
import { Row, Col, Card, Typography, Empty } from 'antd';
import MapList from './components/MapList';
import NpcList from './components/NpcList';
import { MapData } from '@/services/GameManager/api';

const { Title, Text } = Typography;

const QuanLyGame = () => {
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);

  const handleSelectMap = (map: MapData) => {
    setSelectedMap(map);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', minWidth: 1200 }}>
      <Card bordered={false} className="shadow-sm" style={{ marginBottom: 24, maxHeight: '100px' }} >
        <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>Quản Lý Bản Đồ & NPC</Title>
        <Text type="secondary">Xem danh sách bản đồ và các NPC được cấu hình trên từng bản đồ trong game.</Text>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Cột trái: Danh sách Map */}
        <Col xs={24} md={8} lg={6}>
          <Card
            title="Danh sách Bản đồ"
            bordered={false}
            className="shadow-sm"
            style={{ height: '100%', minHeight: '500px' }}
            styles={{ body: { padding: '12px' } }}
          >
            <MapList selectedMapId={selectedMap?.id} onSelectMap={handleSelectMap} />
          </Card>
        </Col>

        {/* Cột phải: Danh sách NPC của Map đã chọn */}
        <Col xs={24} md={16} lg={18}>
          <Card
            bordered={false}
            className="shadow-sm"
            style={{ height: '100%', minHeight: '500px' }}
            styles={{ body: { padding: 0 } }}
          >
            {selectedMap ? (
              <NpcList map={selectedMap} />
            ) : (
              <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty description="Vui lòng chọn một bản đồ ở danh sách bên trái để xem NPC" />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <style>{`
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default QuanLyGame;