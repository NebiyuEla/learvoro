export function isFutureExpiry(value: string, now = new Date()) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  return endOfMonth >= now;
}
