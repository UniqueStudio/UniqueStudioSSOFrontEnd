type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any },
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(','),
  );
};

export const regexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i',
);

export const downloadFile = (data: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(data);
  let a: HTMLAnchorElement | null = document.createElement('a');
  a.style.setProperty('display', 'none');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  a = null;
  window.URL.revokeObjectURL(url);
};

export const getRecruitmentName = (t: (x: string) => string, name: string) => {
  if (!/(\d+)(S|C|A)/.test(name)) return name;
  const [_, year, state] = name.match(/(\d+)(S|C|A)/)!;
  return `${year}${t(`common.rec.name.${state}`)}`;
};

export const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const transformedTime = (start: string, end: string) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const startHours = startTime.getHours().toString().padStart(2, '0');
  const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
  const endHours = endTime.getHours().toString().padStart(2, '0');
  const endMinutes = endTime.getMinutes().toString().padStart(2, '0');

  return `${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
};
