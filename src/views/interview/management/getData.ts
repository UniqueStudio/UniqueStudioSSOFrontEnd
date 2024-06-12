export const getDate = (time: string): string => {
  const date = new Date(time);
  return `${date.getFullYear().toString().padStart(2, '0')}
    -${(date.getMonth() + 1).toString().padStart(2, '0')}
    -${date.getDate().toString().padStart(2, '0')}`;
};
export const getTime = (startStr: string, endStr: string): string => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return `${start.getHours().toString().padStart(2, '0')}:${start
    .getMinutes()
    .toString()
    .padStart(2, '0')}-${end.getHours().toString().padStart(2, '0')}:${end
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};
export const getTotalTime = (startStr: string, endStr: string): string => {
  return `${getDate(startStr)} ${getTime(startStr, endStr)}`;
};
