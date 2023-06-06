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
};

const upload = async ({ file, path, token }: UploadProps) => {
  try {
    const dbx = new Dropbox({ accessToken: token });
    const response = await dbx.filesUpload({
      path,
      contents: file,
      mode: { '.tag': 'add' },
      autorename: true,
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

type Props = {
  file: File;
  path: string;
};

const uploadToDropbox = async ({ file, path }: Props) => {
  let accessToken = await getToken();
  if (!accessToken) {
    accessToken = await generateNewToken();
  }

  // try to upload with current access token first
  try {
    const response = await upload({
      file,
      path,
      token: accessToken,
    });
    return response;
  } catch (error: any) {
    // if access token expired, generate new token and retry upload
    if (error.status && error.status === 401) {
      const newAccessToken = await generateNewToken();
      console.log(
        `Access token expired, retrying upload with new access token: ${newAccessToken}`
      );

      const response = await upload({
        file,
        path,
        token: newAccessToken,
      });

      return response;
    } else {
      // if error is not 401, throw error
      console.log(error);
      throw error;
    }
  }
};

export default uploadToDropbox;
