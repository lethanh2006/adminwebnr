import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Tag, Button, Space, Popconfirm, Modal, Form, InputNumber, Select, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  getNpcsByMap, 
  NpcData, 
  MapData, 
  getNpcBases, 
  NpcBase, 
  createNpcSpawn, 
  updateNpcSpawn, 
  deleteNpcSpawn 
} from '@/services/GameManager/api';

interface NpcListProps {
  map: MapData;
}

const NpcList: React.FC<NpcListProps> = ({ map }) => {
  const [npcs, setNpcs] = useState<NpcData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [npcBases, setNpcBases] = useState<NpcBase[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNpc, setEditingNpc] = useState<NpcData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [form] = Form.useForm();

  useEffect(() => {
    if (map && map.id) {
      fetchNpcs(map.id);
    }
  }, [map]);

  useEffect(() => {
    fetchNpcBases();
  }, []);

  const fetchNpcBases = async () => {
    try {
      const res = await getNpcBases();
      const data = res?.data || res;
      if (data && data.npcs) {
        setNpcBases(data.npcs);
      } else if (Array.isArray(data)) {
        setNpcBases(data);
      }
    } catch (err) {
      console.error('Error fetching npc bases:', err);
      message.error('Không thể lấy danh sách NPC Base');
    }
  };

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

  const handleAdd = () => {
    setEditingNpc(null);
    form.resetFields();
    form.setFieldsValue({
      is_active: true,
      x: 0,
      y: 0
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record: NpcData) => {
    setEditingNpc(record);
    form.setFieldsValue({
      npc_base_id: record.npc_base_id,
      x: record.x,
      y: record.y,
      is_active: record.is_active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNpcSpawn(id);
      message.success('Xóa NPC thành công');
      fetchNpcs(map.id);
    } catch (error) {
      console.error('Error deleting npc:', error);
      message.error('Có lỗi xảy ra khi xóa NPC');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      if (editingNpc) {
        await updateNpcSpawn({
          id: editingNpc.id,
          map_id: map.id,
          x: values.x,
          y: values.y,
          is_active: values.is_active,
        });
        message.success('Cập nhật NPC thành công');
      } else {
        await createNpcSpawn({
          npc_base_id: values.npc_base_id,
          map_id: map.id,
          x: values.x,
          y: values.y,
          is_active: values.is_active,
        });
        message.success('Thêm NPC mới thành công');
      }
      
      setIsModalVisible(false);
      fetchNpcs(map.id);
    } catch (error) {
      console.error('Error saving npc:', error);
      if (error && (error as any).errorFields) {
        return; // Form validation error
      }
      message.error('Có lỗi xảy ra khi lưu NPC');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa NPC này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
      width: 100,
      align: 'center',
    },
  ];

  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', minHeight: '400px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Danh sách NPC tại: <span style={{ color: '#1890ff' }}>{map.ten}</span> (ID: {map.id})
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới NPC
        </Button>
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

      <Modal
        title={editingNpc ? 'Sửa NPC' : 'Thêm mới NPC'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={submitting}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="npc_base_id"
            label="Chọn NPC"
            rules={[{ required: true, message: 'Vui lòng chọn NPC!' }]}
          >
            <Select 
              showSearch
              placeholder="Chọn NPC"
              optionFilterProp="children"
              disabled={!!editingNpc} // Disable changing base when editing
            >
              {npcBases.map(npc => (
                <Select.Option key={npc.id} value={npc.id}>
                  [{npc.id}] {npc.ten} ({npc.loai})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="x"
            label="Tọa độ X"
            rules={[{ required: true, message: 'Vui lòng nhập tọa độ X!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="y"
            label="Tọa độ Y"
            rules={[{ required: true, message: 'Vui lòng nhập tọa độ Y!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Đã ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NpcList;
