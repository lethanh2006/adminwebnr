import { Button, Popconfirm, Space, Table, Tag, Tooltip, Typography, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from '@/utils/dayjs';
import type { AccountItem } from '../types';

interface AccountTableProps {
  data: AccountItem[];
  loading?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowBuy?: boolean;
  allowMarkSold?: boolean;
  onViewDetail: (record: AccountItem) => void;
  onEdit?: (record: AccountItem) => void;
  onDelete?: (record: AccountItem) => void;
  onBuy?: (record: AccountItem) => void;
  onMarkSold?: (record: AccountItem) => void;
}

const getStatusColor = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === 'sold') return 'green';
  if (s === 'active') return 'blue';
  if (s === 'pending') return 'gold';
  return 'default';
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  return dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY HH:mm') : value;
};

const AccountTable = ({
  data,
  loading,
  allowEdit,
  allowDelete,
  allowBuy,
  allowMarkSold,
  onViewDetail,
  onEdit,
  onDelete,
  onBuy,
  onMarkSold,
}: AccountTableProps) => {
  const columns: ColumnsType<AccountItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 72,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'url',
      width: 100,
      fixed: 'left',
      align: 'center',
      render: (url: string) => (
        <Image
          src={url}
          alt="Account"
          width={64}
          height={64}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          fallback="https://placehold.co/64x64/EEE/31343C?text=No+Image" // Hiển thị ảnh thay thế nếu link không phải là file ảnh hợp lệ
          preview={{ mask: 'Xem' }}
        />
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      width: 140,
      render: (value: number) => (
        <Typography.Text strong style={{ color: '#cf1322' }}>
          {Number(value || 0).toLocaleString('vi-VN')} đ
        </Typography.Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {(status || 'UNKNOWN').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
      render: (value: string) => (
        <Tooltip title={value || '-'}>
          <span style={{ color: '#595959' }}>{value || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 160,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 280,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Button size="small" onClick={() => onViewDetail(record)}>
            Chi tiết
          </Button>

          {allowEdit && onEdit && (
            <Button size="small" onClick={() => onEdit(record)}>
              Sửa
            </Button>
          )}

          {allowMarkSold && onMarkSold && record.status?.toLowerCase() !== 'sold' && (
            <Button size="small" type="primary" ghost onClick={() => onMarkSold(record)}>
              Đã bán
            </Button>
          )}

          {allowBuy && onBuy && record.status?.toLowerCase() !== 'sold' && (
            <Button size="small" type="primary" onClick={() => onBuy(record)}>
              Mua ngay
            </Button>
          )}

          {allowDelete && onDelete && (
            <Popconfirm
              title="Bạn có chắc muốn xóa account này?"
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => onDelete(record)}
            >
              <Button danger size="small">
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      bordered
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 1000 }}
    />
  );
};

export default AccountTable;