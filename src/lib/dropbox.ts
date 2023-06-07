import { Dropbox } from 'dropbox';

export const getToken = async (): Promise<string | undefined> => {
  const response: any = await fetch('/api/get-token');
  const data = await response.json();
  return data.accessToken;
};

export const generateNewToken = async (): Promise<string> => {
  const response: any = await fetch('/api/generate-token');
  const data = await response.json();
  return data.accessToken;
};

type UploadProps = {
  file: File;
  path: string;
  token: string;
  cb: (progress: number) => void;
};

// const uploadFile = async ({
//   file,
//   path,
//   token,
// }: Omit<UploadProps, 'logProgress'>) => {
//   try {
//     const dbx = new Dropbox({ accessToken: token });
//     const response = await dbx.filesUpload({
//       path,
//       contents: file,
//       mode: { '.tag': 'add' },
//       autorename: true,
//     });
//     return response;
//   } catch (error: any) {
//     throw error;
//   }
// };

// const UPLOAD_FILE_SIZE_LIMIT = 50 * 1024 * 1024;

const uploadChunks = async ({
  file,
  path,
  token,
  cb,
}: UploadProps) => {
  const dbx = new Dropbox({ accessToken: token });
  const maxBlob = 8 * 1024 * 1024; // 8MB - Dropbox JavaScript API suggested chunk size
  const workItems = [];
  let offset = 0;
  try {
    while (offset < file.size) {
      const chunkSize = Math.min(maxBlob, file.size - offset);
      workItems.push(file.slice(offset, offset + chunkSize));
      offset += chunkSize;
    }

    let uploadedSize = 0;

    const task = workItems.reduce(async (acc, blob, idx, items) => {
      const sessionId = await acc;
      if (idx === 0) {
        // Starting multipart upload of file
        const response = await dbx.filesUploadSessionStart({
          close: false,
          contents: blob,
        });

        return response.result.session_id;
      } else if (idx < items.length - 1) {
        // Append part to the upload session
        const cursor = {
          session_id: sessionId,
          offset: idx * maxBlob,
        };
        await dbx.filesUploadSessionAppendV2({
          cursor: cursor,
          close: false,
          contents: blob,
        });
        // log progress
        uploadedSize += blob.size;
        cb((uploadedSize / file.size) * 100);

        return sessionId;
      } else {
        // Last chunk of data, close session
        const cursor = {
          session_id: sessionId,
          offset: file.size - blob.size,
        };

        const commit = {
          path,
          mode: 'add',
          autorename: true,
          mute: false,
        };
        const response = await dbx.filesUploadSessionFinish({
          cursor,
          commit,
          contents: blob,
        });
        cb(100);
        // Log final progress
        return response;
      }
    }, Promise.resolve());

    const response = await task;

    return response;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

type Props = {
  file: File;
  path: string;
  cb: (progress: number) => void;
};

const uploadToDropbox = async ({ file, path, cb }: Props) => {
  let accessToken = await getToken();
  if (!accessToken) {
    accessToken = await generateNewToken();
  }

  // try to upload with current access token first
  try {
    const response = await uploadChunks({
      file,
      path,
      token: accessToken,
      cb,
    });
    return response;
  } catch (error: any) {
    // if access token expired, generate new token and retry upload
    if (error.status && error.status === 401) {
      console.log(`Access token expired, retrying `);
      const newAccessToken = await generateNewToken();

      const response = await uploadChunks({
        file,
        path,
        token: newAccessToken,
        cb,
      });

      return response;
    } else {
      // if error is not 401, throw error
      console.log('Error uploading file to Dropbox', error);
      throw error;
    }
  }
};

export default uploadToDropbox;
