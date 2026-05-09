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
  username: string;
}

export async function getPlayerProfile(id: number | string, token?: string) {
  return axios.get<PlayerProfileResponse>(`${ipNR}/player_manager/profile/${id}`, getAuthHeader(token));
}

export interface SendEmailToUserRequestDto {
  who: string;
  title: string;
  content: string;
}

export async function sendEmailUser(payload: SendEmailToUserRequestDto, token?: string) {
  return axios.post(`${ipNR}/player_manager/send-email`, payload, getAuthHeader(token));
}

export interface TemporaryBanRequestDto {
  userId: number;
  phut: number;
  why: string;
}

export async function temporaryBanUser(payload: TemporaryBanRequestDto, token?: string) {
  return axios.post(`${ipNR}/player_manager/temporary-ban`, payload, getAuthHeader(token));
}

export async function unbanUser(userId: number | string, token?: string) {
  return axios.delete(`${ipNR}/player_manager/temporary-ban/${userId}`, getAuthHeader(token));
}

export async function getBannedUsers(token?: string) {
  return axios.get(`${ipNR}/player_manager/temporary-ban-all`, getAuthHeader(token));
}
