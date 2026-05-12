import axios from '@/utils/axios';
import { ipNR } from '@/utils/ip';
import { getAuthHeader } from '@/utils/apiHelper';


// export async function getFinanceOneUser(userId: number, token: string) {
//     return axios.get(`${ipNR}/finance/by-user`, getAuthHeader(token));
// }

export async function getFinanceAllRecord(token: string) {
    return axios.get(`${ipNR}/finance/all-record`, getAuthHeader(token));
}
