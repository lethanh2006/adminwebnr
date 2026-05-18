import axios from '@/utils/axios';
import { getAuthHeader } from '@/utils/apiHelper';
import { ipNR } from '@/utils/ip';

export interface MapData {
  id: number;
  ten: string;
}

export interface MapResponse {
  maps: MapData[];
}

export interface NpcData {
  id: number;
  npc_base_id: number;
  ten_npc: string;
  loai_npc: string;
  map_id: number;
  ten_map: string;
  x: number;
  y: number;
  is_active: boolean;
}

export interface NpcResponse {
  npcs: NpcData[];
}

export interface NpcBase {
  id: number;
  ten: string;
  loai: string;
}

export interface NpcBaseResponse {
  npcs: NpcBase[];
}

export interface ItemBase {
  id: number;
  ten: string;
  ma?: string;
}

export interface ItemBaseResponse {
  items: ItemBase[];
}

export interface LongValue {
  low: number;
  high: number;
  unsigned: boolean;
}

export interface NpcShopItem {
  id: number;
  npc_base_id: number;
  item_base_id: number;
  gia: number | LongValue;
  loaiTien: string;
  tab: string;
  is_active: boolean;
  start_at?: number | LongValue;
  end_at?: number | LongValue;
  ten_npc?: string;
  ten_item?: string;
  ma_item?: string;
}

export interface NpcShopResponse {
  items: NpcShopItem[];
}

export interface CreateNpcShopDto {
  npc_base_id: number;
  item_base_id: number;
  gia: number;
  loaiTien: string;
  tab: string;
  is_active: boolean;
  start_at: number;
  end_at: number;
}

export interface UpdateNpcShopDto {
  id: number;
  npc_base_id?: number;
  item_base_id?: number;
  gia?: number;
  loaiTien?: string;
  tab?: string;
  is_active?: boolean;
  start_at?: number;
  end_at?: number;
}

export interface CreateNpcSpawnDto {
  npc_base_id: number;
  map_id: number;
  x: number;
  y: number;
  is_active: boolean;
}

export interface UpdateNpcSpawnDto {
  id: number;
  map_id: number;
  x?: number;
  y?: number;
  is_active?: boolean;
}

export async function getMaps(token?: string) {
  return axios.get<MapResponse>(`${ipNR}/game-data/map`, getAuthHeader(token));
}

export async function getNpcsByMap(mapId: number, token?: string) {
  const authHeader = getAuthHeader(token);
  return axios.get<NpcResponse>(`${ipNR}/game-data/map/npcs`, {
    ...authHeader,
    params: { map_id: mapId },
  });
}

export async function getNpcBases(token?: string) {
  return axios.get<NpcBaseResponse>(`${ipNR}/game-data/npc-base`, getAuthHeader(token));
}

export async function getItemBases(token?: string) {
  return axios.get<ItemBaseResponse>(`${ipNR}/game-data/item-base`, getAuthHeader(token));
}

export async function createNpcSpawn(data: CreateNpcSpawnDto, token?: string) {
  return axios.post(`${ipNR}/game-data/npc-spawn`, data, getAuthHeader(token));
}

export async function updateNpcSpawn(data: UpdateNpcSpawnDto, token?: string) {
  return axios.patch(`${ipNR}/game-data/npc-spawn`, data, getAuthHeader(token));
}

export async function deleteNpcSpawn(id: number, token?: string) {
  return axios.delete(`${ipNR}/game-data/npc-spawn`, {
    ...getAuthHeader(token),
    params: { id },
  });
}

export async function getNpcShopItems(npcBaseId: number, token?: string) {
  return axios.get<NpcShopResponse>(`${ipNR}/game-data/npc-shop`, {
    ...getAuthHeader(token),
    params: { npc_base_id: npcBaseId },
  });
}

export async function createNpcShopItem(data: CreateNpcShopDto, token?: string) {
  return axios.post(`${ipNR}/game-data/npc-shop`, data, getAuthHeader(token));
}

export async function updateNpcShopItem(data: UpdateNpcShopDto, token?: string) {
  return axios.patch(`${ipNR}/game-data/npc-shop`, data, getAuthHeader(token));
}

export async function deleteNpcShopItem(id: number, token?: string) {
  return axios.delete(`${ipNR}/game-data/npc-shop`, {
    ...getAuthHeader(token),
    params: { id },
  });
}
