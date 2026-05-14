export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user/otp',
				layout: false,
				name: 'otp',
				component: './user/Otp',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	// GROUP TITLE
	// {
	// 	name: 'DashboardGroup',
	// 	path: '/__group__/dashboard',
	// 	disabled: true,
	// },

	///////////////////////////////////

	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},

	// DANH MUC HE THONG
	{
		name: 'DanhMuc',
		path: '/danh-muc',
		icon: 'copy',
		routes: [
			{
				name: 'Quản Lý Rút Tiền',
				path: 'quan-ly-rut-tien',
				component: './DanhMuc/QuanLyRutTien',
			},
			{
				name: 'Quản Lý Tin Tức',
				path: 'quan-ly-tin-tuc',
				component: './DanhMuc/QuanLyTinTuc',
			},
			{
				name: 'Quản Lý Tài Khoản',
				path: 'quan-ly-tai-khoan',
				component: './DanhMuc/QuanLyTaiKhoan',
			},
			{
				name: 'Quản Lý User',
				path: 'quan-ly-user',
				component: './DanhMuc/QuanLyUser',
			},
			{
				name: 'Quản Lý Game',
				path: 'quan-ly-game',
				component: './DanhMuc/QuanLyGame',
			},
		],
	},


	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/*',
		component: './exception/404',
		layout: false,
	},
];
