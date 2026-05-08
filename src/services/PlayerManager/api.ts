import axios from '@/utils/axios';
import { getAuthHeader } from '@/utils/apiHelper';
import { ipNR } from '@/utils/ip';

export interface PlayerProfileResponse {
  user: {
    danhSachVatPhamWeb: any[];
    id: number;
    vang: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    ngoc: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    sucManh: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    vangNapTuWeb: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    ngocNapTuWeb: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    x: number;
    y: number;
    mapHienTai: string;
    daVaoTaiKhoanLanDau: boolean;
    coDeTu: boolean;
    auth_id: number;
    gameName: string;
  };
}

export async function getPlayerProfile(id: number | string, token?: string) {
  return axios.get<PlayerProfileResponse>(`${ipNR}/player_manager/profile/${id}`, getAuthHeader(token));
}
