import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  InputNumber,
  Modal,
  Row,
  Space,
  Tabs,
  Typography,
  message,
} from 'antd';
import { useSearchParams } from '@umijs/max';
import {
  buyAccountSellV2,
  createAccountSellV2,
  deleteAccountSellV2,
  getAccountSellByActor,
  getAccountSellByIdV2,
  getAllAccountBuyerV2,
  markAccountSellV2,
  updateAccountSellV2,
} from '@/services/Partner/api';
import AccountDetailDrawer from './components/AccountDetailDrawer';
import AccountSellForm from './components/AccountSellForm';
import AccountStatsCards from './components/AccountStatsCards';
import AccountTable from './components/AccountTable';
import type { AccountFormValue, AccountItem, AccountStats } from './types';

const parseData = <T,>(response: any): T | undefined => {
  return (response?.data?.data ?? response?.data) as T | undefined;
};

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('access_token') || '';

const buildStats = (myAccounts: AccountItem[], boughtAccounts: AccountItem[]): AccountStats => {
  const selling = myAccounts.filter((item) => item.status !== 'sold').length;
  const sold = myAccounts.filter((item) => item.status === 'sold').length;
  const totalValue = boughtAccounts.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return {
    total: myAccounts.length,
    selling,
    sold,
    bought: boughtAccounts.length,
    totalValue,
  };
};

const QuanLyTaiKhoan = () => {
  const token = getAuthToken();
  const [searchParams] = useSearchParams();
  const [myAccounts, setMyAccounts] = useState<AccountItem[]>([]);
  const [myBoughtAccounts, setMyBoughtAccounts] = useState<AccountItem[]>([]);
  const [activeTab, setActiveTab] = useState('market');

  const [loadingMine, setLoadingMine] = useState(false);
  const [loadingBought, setLoadingBought] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | undefined>();

  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [searchId, setSearchId] = useState<number | undefined>();

  const stats = useMemo(() => buildStats(myAccounts, myBoughtAccounts), [myAccounts, myBoughtAccounts]);

  const openDetail = async (record: AccountItem) => {
    try {
      const response = await getAccountSellByIdV2(record.id, token);
      const detail = parseData<AccountItem>(response);
      setSelectedAccount(detail && !Array.isArray(detail) ? detail : record);
      setDetailOpen(true);
    } catch {
      setSelectedAccount(record);
      setDetailOpen(true);
      message.warning('Không lấy được chi tiết mới nhất, đang hiển thị dữ liệu hiện có.');
    }
  };

  const loadMyAccounts = async () => {
    setLoadingMine(true);
    const auth_id_str = localStorage.getItem('auth_id');
    const auth_id = auth_id_str ? Number(auth_id_str) : undefined;

    try {
      const params = {
        partner_id: auth_id,
      };

      const response = await getAccountSellByActor(params, token);
      const data: any = parseData(response) || {};
      const accountsArray = data.accounts || [];

      setMyAccounts(Array.isArray(accountsArray) ? accountsArray : []);
    } catch {
      message.error('Không thể tải danh sách account theo partner/admin');
    } finally {
      setLoadingMine(false);
    }
  };


  const loadBoughtAccounts = async () => {
    setLoadingBought(true);
    try {
      const response = await getAllAccountBuyerV2({}, token);
      const data: any = parseData(response) || {};

      const accountsArray = data.accounts || [];

      setMyBoughtAccounts(Array.isArray(accountsArray) ? accountsArray : []);
    } catch {
      message.error('Không thể tải danh sách account đã mua');
    } finally {
      setLoadingBought(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([loadMyAccounts(), loadBoughtAccounts()]);
  };

  const handleCreate = async (values: AccountFormValue) => {
    setSubmitting(true);
    try {
      await createAccountSellV2(values, token);
      message.success('Đăng account cần bán thành công. Vui lòng xác nhận qua email link.');
      await refreshAll();
    } catch {
      message.error('Đăng bán account thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values: AccountFormValue) => {
    if (!editingAccount) return;

    setSubmitting(true);
    try {
      await updateAccountSellV2(
        {
          id: editingAccount.id,
          url: values.url,
          description: values.description,
          price: values.price,
        },
        token,
      );
      message.success('Cập nhật account thành công');
      setEditOpen(false);
      setEditingAccount(null);
      await refreshAll();
    } catch {
      message.error('Cập nhật account thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: AccountItem) => {
    setSubmitting(true);
    try {
      await deleteAccountSellV2(record.id, token);
      message.success('Xóa account thành công');
      await refreshAll();
    } catch {
      message.error('Xóa account thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSold = async (record: AccountItem) => {
    setSubmitting(true);
    try {
      await markAccountSellV2(record.id, 'sold', token);
      message.success('Đã đánh dấu account là đã bán');
      await refreshAll();
    } catch {
      message.error('Đánh dấu đã bán thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBuy = async (record: AccountItem) => {
    setSubmitting(true);
    try {
      await buyAccountSellV2(record.id, token);
      message.success('Mua account thành công');
      await refreshAll();
      setActiveTab('purchased');
    } catch {
      message.error('Mua account thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFindById = async () => {
    if (!searchId) {
      message.warning('Vui lòng nhập ID account cần xem');
      return;
    }

    setSubmitting(true);
    try {
      const response = await getAccountSellByIdV2(searchId, token);
      const detail = parseData<AccountItem>(response);
      if (!detail || Array.isArray(detail)) {
        message.warning('Không tìm thấy account với ID đã nhập');
        return;
      }
      setSelectedAccount(detail);
      setDetailOpen(true);
    } catch {
      message.error('Không thể xem chi tiết account theo ID');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (!queryToken) return;
  }, [searchParams]);

  return (
    <div style={{ padding: 24 }}>
      <Row justify='space-between' align='middle' gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Quản lý tài khoản mua bán
          </Typography.Title>
          <Typography.Text type='secondary'>
            Quản lý account cần bán, xác nhận email, mua account và theo dõi lịch sử bán/mua.
          </Typography.Text>
        </Col>
        <Col>
          <Button onClick={refreshAll} loading={loadingMine || loadingBought}>
            Làm mới dữ liệu
          </Button>
        </Col>
      </Row>

      <AccountStatsCards stats={stats} />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'sell',
            label: 'Đăng bán account',
            children: (
              <>
                <AccountSellForm onSubmit={handleCreate} loading={submitting} mode='create' />
              </>
            ),
          },
          {
            key: 'inventory',
            label: 'Kho bán acc của tôi',
            children: (
              <>
                <AccountTable
                  data={myAccounts}
                  loading={loadingMine || submitting}
                  allowEdit
                  allowDelete
                  allowMarkSold
                  onViewDetail={openDetail}
                  onEdit={(record) => {
                    setEditingAccount(record);
                    setEditOpen(true);
                  }}
                  onDelete={handleDelete}
                  onMarkSold={handleMarkSold}
                />
              </>
            ),
          },
          {
            key: 'purchased',
            label: 'Kho mua của tôi',
            children: (
              <AccountTable
                data={myBoughtAccounts}
                loading={loadingBought || submitting}
                onViewDetail={openDetail}
              />
            ),
          },
          {
            key: 'lookup',
            label: 'Tra cứu theo ID',
            children: (
              <Card>
                <Space wrap size={12}>
                  <InputNumber
                    min={1}
                    value={searchId}
                    onChange={(value) => setSearchId((value as number) || undefined)}
                    placeholder='Nhập ID account'
                  />
                  <Button onClick={handleFindById} loading={submitting} type='primary'>
                    Xem chi tiết account
                  </Button>
                </Space>
                <Typography.Paragraph type='secondary' style={{ marginTop: 12, marginBottom: 0 }}>
                  Tab này dành cho tra cứu nhanh một account bất kỳ theo mã ID.
                </Typography.Paragraph>
              </Card>
            ),
          },
        ]}
      />

      <Modal
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingAccount(null);
        }}
        footer={null}
        destroyOnClose
        width={680}
        title='Cập nhật thông tin account cần bán'
      >
        <AccountSellForm
          mode='edit'
          loading={submitting}
          initialValues={
            editingAccount
              ? {
                username: editingAccount.username,
                password: '',
                url: editingAccount.url,
                description: editingAccount.description,
                price: Number(editingAccount.price || 0),
              }
              : undefined
          }
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditOpen(false);
            setEditingAccount(null);
          }}
        />
      </Modal>

      <AccountDetailDrawer
        open={detailOpen}
        account={selectedAccount}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
};

export default QuanLyTaiKhoan;