import { unitName } from '@/services/base/constant';
import { getFinanceAllRecord, getSystemCashFlow } from '@/services/finance/api';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Card, Col, Row, Spin, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './components/style.less';

const getAuthToken = () => localStorage.getItem('token') || localStorage.getItem('access_token') || '';

const TrangChu = () => {
	const intl = useIntl();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({ total_nap: 0, total_rut: 0, balance: 0 });
	const [chartData, setChartData] = useState<{ dates: string[], data: number[] }>({ dates: [], data: [] });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = getAuthToken();
				const [recordRes, flowRes] = await Promise.all([
					getFinanceAllRecord(token),
					getSystemCashFlow(token)
				]);

				const flowData = flowRes?.data || { total_nap: 0, total_rut: 0, balance: 0 };
				setStats(flowData);

				const finances = recordRes?.data?.finances || [];


				const sorted = [...finances].sort((a, b) => new Date(a.create_at).getTime() - new Date(b.create_at).getTime());


				const groupedByDate: Record<string, number> = {};
				sorted.forEach((item: any) => {
					if (item.type === 'NAP') {
						const dateStr = new Date(item.create_at).toLocaleDateString('vi-VN');
						groupedByDate[dateStr] = (groupedByDate[dateStr] || 0) + item.amount;
					}
				});

				const dates = Object.keys(groupedByDate);
				const amounts = dates.map(date => groupedByDate[date]);

				setChartData({ dates, data: amounts });

			} catch (error) {
				console.error('Lỗi khi lấy dữ liệu trang chủ', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const chartOptions: ApexCharts.ApexOptions = {
		chart: {
			type: 'bar',
			height: 380,
			toolbar: { show: false },
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: true,
				color: '#1890ff',
				top: 8,
				left: 0,
				blur: 8,
				opacity: 0.15
			}
		},
		plotOptions: {
			bar: {
				borderRadius: 8,
				columnWidth: '15%',
				dataLabels: {
					position: 'top',
				},
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => val.toLocaleString('vi-VN') + ' đ',
			offsetY: -30,
			style: {
				fontSize: '14px',
				colors: ["#1890ff"],
				fontWeight: 700,
			},
			background: {
				enabled: true,
				foreColor: '#ffffff',
				padding: 6,
				borderRadius: 6,
				borderWidth: 0,
				dropShadow: {
					enabled: true,
					top: 2,
					left: 0,
					blur: 4,
					color: '#000',
					opacity: 0.1
				}
			}
		},
		stroke: {
			show: false
		},
		fill: {
			type: 'gradient',
			gradient: {
				type: 'vertical',
				shadeIntensity: 1,
				opacityFrom: 1,
				opacityTo: 0.8,
				colorStops: [
					{ offset: 0, color: '#40a9ff', opacity: 1 },
					{ offset: 100, color: '#096dd9', opacity: 1 }
				]
			}
		},
		xaxis: {
			categories: chartData.dates,
			labels: { style: { colors: '#8c8c8c', fontSize: '13px', fontWeight: 500 } },
			axisBorder: { show: false },
			axisTicks: { show: false }
		},
		yaxis: {
			labels: {
				formatter: (value) => value.toLocaleString('vi-VN') + ' đ',
				style: { colors: '#8c8c8c', fontSize: '13px', fontWeight: 500 }
			}
		},
		grid: {
			borderColor: '#f0f0f0',
			strokeDashArray: 5,
			padding: { top: 20 }
		},
		tooltip: {
			theme: 'light',
			y: {
				formatter: (value) => value.toLocaleString('vi-VN') + ' VNĐ'
			},
			style: {
				fontSize: '14px'
			}
		}
	};

	return (
		<div style={{ padding: 24 }}>
			{/* <Card variant='borderless' style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '24px 0' }}>
				<div className='home-welcome'>
					<h1 className='title' style={{ marginBottom: 8, color: '#262626' }}>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
					<h2 className='sub-title' style={{ color: '#595959', margin: 0 }}>
						{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} - {intl.formatMessage({ id: unitName }).toUpperCase()}
					</h2>
				</div>
			</Card> */}

			<Spin spinning={loading}>
				<Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
					<Col xs={24} sm={8}>
						<Card variant='borderless' style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #1890ff' }}>
							<Statistic
								title={<span style={{ fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', fontSize: 13 }}>Số Dư Hệ Thống</span>}
								value={stats.balance}
								precision={0}
								valueStyle={{ color: '#1890ff', fontWeight: 700, fontSize: 28 }}
								prefix={<DollarOutlined />}
								suffix="VNĐ"
							/>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card variant='borderless' style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #52c41a' }}>
							<Statistic
								title={<span style={{ fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', fontSize: 13 }}>Tổng Nạp</span>}
								value={stats.total_nap}
								precision={0}
								valueStyle={{ color: '#52c41a', fontWeight: 700, fontSize: 28 }}
								prefix={<ArrowUpOutlined />}
								suffix="VNĐ"
							/>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card variant='borderless' style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderLeft: '4px solid #cf1322' }}>
							<Statistic
								title={<span style={{ fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', fontSize: 13 }}>Tổng Rút</span>}
								value={stats.total_rut}
								precision={0}
								valueStyle={{ color: '#cf1322', fontWeight: 700, fontSize: 28 }}
								prefix={<ArrowDownOutlined />}
								suffix="VNĐ"
							/>
						</Card>
					</Col>
				</Row>

				{/* Beautiful Chart */}
				<Card
					title={<span style={{ fontWeight: 700, fontSize: 18, color: '#262626' }}>Thống Kê Nạp Tiền (VNĐ)</span>}
					variant='borderless'
					style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
				>
					{chartData.data.length > 0 ? (
						<ReactApexChart
							options={chartOptions}
							series={[{ name: 'Nạp Tiền', data: chartData.data }]}
							type="bar"
							height={380}
						/>
					) : (
						<div style={{ textAlign: 'center', padding: '60px 0', color: '#bfbfbf', fontSize: 16 }}>
							Chưa có dữ liệu giao dịch nạp tiền để hiển thị
						</div>
					)}
				</Card>
			</Spin>
		</div>
	);
};

export default TrangChu;

