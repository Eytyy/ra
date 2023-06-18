export const formatSize = (sizeInBytes: number) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (sizeInBytes >= GB) {
    return `${(sizeInBytes / GB).toFixed(2)} GB`;
  } else if (sizeInBytes >= MB) {
    return `${(sizeInBytes / MB).toFixed(2)} MB`;
  } else if (sizeInBytes >= KB) {
    return `${(sizeInBytes / KB).toFixed(2)} KB`;
  } else {
    return `${sizeInBytes} B`;
  }
};

const timeFormatter = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Asia/Hebron',
  }).format(date);
};

const dateFormatter = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Hebron',
  }).format(date);
};

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const time = timeFormatter(dateObj);
  const formattedDate = dateFormatter(dateObj);
  return {
    time,
    date: formattedDate,
  };
};

export const readFileAsArrayBuffer = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const getDatesForPath = (date: string) => {
  const d = new Date(date);
  let month = d.getMonth() + 1;
  let day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours();

  // if hour is between 00:00 and 04:00, then the date is the previous day
  const isPreviousDay = hour >= 0 && hour <= 4;
  // if isPreviousDay is true, then the day is the previous day
  // if the day is the first of the month, then the day is the last day of the previous month and
  // the month is the previous month
  const isFirstDayOfMonth = d.getDate() === 1;
  if (isPreviousDay) {
    day = d.getDate() - 1;
  }
  if (isFirstDayOfMonth) {
    month = d.getMonth();
    day = new Date(d.getFullYear(), d.getMonth(), 0).getDate();
  }

  const stamp =
    `${month.toString().padStart(2, '0')}` +
    `${day.toString().padStart(2, '0')}` +
    `${year}`;

  return {
    stamp,
    monthIdx: month,
    day,
    year,
  };
};

const getMonthName = (monthIdx: number) => {
  const date = new Date();
  date.setMonth(monthIdx - 1);
  const month = date.toLocaleString('en-US', {
    month: 'short',
  });
  return month;
};

export const getFilePath = (fileName: string, date: string) => {
  const { stamp, monthIdx, year } = getDatesForPath(date);
  const month = getMonthName(monthIdx);

  // Radio Alhara HD/Year/6 jun 2023/06092023/20230609_showname as it was uplaoded.mp3
  const path = `/Radio Alhara HD/${year}/${
    monthIdx + 1
  } ${month} ${year}/${stamp}/${stamp}_${fileName}`;
  return path;
};

export const removeSpecialCharacters = (str: string) => {
  var regex = /[!@#$%^&*(),.?":{}|<>]/g;
  var result = str.replace(regex, '');
  return result;
};
