import { Dropbox } from 'dropbox';
import axios from 'axios';

export const getToken = async (): Promise<string | undefined> => {
  const response = await axios.get('/api/token');
  return response.data.accessToken;
};

export const clientToken = async (): Promise<string> => {
  // https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/Issue-in-generating-access-token/td-p/592667/highlight/true
  // I'm not using the dropbox sdk to avoid redirecting to dropbox login page to get access token
  // Instead I'm using the oauth2/token endpoint to generate a new access token manually using the refresh token
  // maybe this needs to be updated in the future
  const url = 'https://api.dropbox.com/oauth2/token';
  const referesh_token = process.env.NEXT_PUBLIC_REFRESH_TOKEN;
  const clientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_SECRET;

  if (!referesh_token || !clientId || !clientSecret) {
    throw new Error('Missing required fields');
  }
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', referesh_token);
    const headers = {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate access token');
  }
};

export const generateNewToken = async (): Promise<string> => {
  const response = await axios.get('/api/generate-token');
  return response.data.accessToken;
};

const uploadFile = async ({
  file,
  path,
  token,
}: {
  file: File;
  path: string;
  token: string;
}) => {
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

type UploadProps = {
  file: File;
  path: string;
};

const uploadToDropbox = async ({ file, path }: UploadProps) => {
  let accessToken = await getToken();
  if (!accessToken) {
    accessToken = await generateNewToken();
  }
  console.log('existing access token', accessToken);
  try {
    const response = await uploadFile({
      file,
      path,
      token: accessToken,
    });
    return response;
  } catch (error: any) {
    if (error.status && error.status === 401) {
      const newAccessToken = await generateNewToken();
      console.log(
        `Access token expired, retrying upload with new access token: ${newAccessToken}`
      );

      const response = await uploadFile({
        file,
        path,
        token: newAccessToken,
      });
      return response;
    } else {
      console.log(error);
      throw error;
    }
  }
};

export default uploadToDropbox;
