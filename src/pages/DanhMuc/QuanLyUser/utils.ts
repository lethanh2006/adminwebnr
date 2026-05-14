export const formatLongValue = (obj: any) => {
  if (!obj || typeof obj !== 'object' || !('low' in obj)) return '0';
  try {
    const high = BigInt(obj.high || 0);
    let low = BigInt(obj.low || 0);
    if (low < 0n) {
      low = low + 4294967296n;
    }
    const val = (high * 4294967296n) + low;
    return new Intl.NumberFormat('vi-VN').format(val);
  } catch (e) {
    return '0';
  }
};
