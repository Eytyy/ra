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

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

export const getDateStamp = (date: string) => {
  const d = new Date(date);
  const stamp =
    `${(d.getMonth() + 1).toString().padStart(2, '0')}` +
    `${d.getDate().toString().padStart(2, '0')}` +
    `${d.getFullYear()}`;
  return stamp;
};

export const getFilePath = (fileName: string, date: string) => {
  const formattedDate = new Date(date);
  const monthFull = formattedDate.toLocaleString('default', {
    month: 'long',
  });
  const monthNumber = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate().toString().padStart(2, '0');

  const dateStamp = getDateStamp(date);
  // /year/month monthFull/day/dateStamp_fileName
  const path = `/${formattedDate.getFullYear()}/${monthNumber} ${monthFull}/${day}/${dateStamp}_${fileName}`;

  return path;
};

export const removeSpecialCharacters = (str: string) => {
  var regex = /[!@#$%^&*(),.?":{}|<>]/g;
  var result = str.replace(regex, '');
  return result;
};
