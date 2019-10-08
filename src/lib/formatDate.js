export function timestampToFormatted(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
}
