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

// 2023/1 Mar 2023/04032023/fileName

export const getFilePath = (fileName: string, date: string) => {
  const formattedDate = new Date(date);
  const monthFull = formattedDate.toLocaleString('default', {
    month: 'long',
  });
  const monthNumber = formattedDate.getMonth() + 1;
  const year = formattedDate.getFullYear();
  const day = formattedDate.getDate();

  const dateString =
    `${monthNumber.toString().padStart(2, '0')}` +
    `${day.toString().padStart(2, '0')}` +
    `${year}`;
  const path = `/${formattedDate.getFullYear()}/${monthNumber} ${monthFull} ${year}/${dateString}/${fileName}`;

  return path;
};
