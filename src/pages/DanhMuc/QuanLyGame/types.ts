export interface LongValue {
    low: number;
    high: number;
    unsigned: boolean;
}

export interface PlayerProfile {
    id: number;
    auth_id: number;
    gameName: string;
    mapHienTai: string;
    vang: LongValue;
    ngoc: LongValue;
    sucManh: LongValue;
    vangNapTuWeb: LongValue;
    ngocNapTuWeb: LongValue;
    x: number;
    y: number;
    coDeTu: boolean;
    daVaoTaiKhoanLanDau: boolean;
    danhSachVatPhamWeb: any[];
}

export interface PlayerMailPayload {
    who: string | 'ALL';
    title: string;
    content: string;
}

export interface TemporaryBanPayload {
    userId: number;
    phut: number;
    why: string;
}