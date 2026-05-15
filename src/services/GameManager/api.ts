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
