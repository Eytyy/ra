import { kv } from '@vercel/kv';
import { NextApiRequest, NextApiResponse } from 'next';

// https://www.dropboxforum.com/t5/Dropbox-API-Support-Feedback/Issue-in-generating-access-token/td-p/592667/highlight/true
// I'm not using the dropbox sdk to avoid redirecting to dropbox login page to get access token
// Instead I'm using the oauth2/token endpoint to generate a new access token manually using the refresh token
// maybe this needs to be updated in the future

export default async function generateToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = 'https://api.dropbox.com/oauth2/token';
    const refresh_token = process.env.DROPBOX_REFRESH_TOKEN;
    const client = process.env.DROPBOX_CLIENT_ID;
    const secret = process.env.DROPBOX_CLIENT_SECRET;

    if (!refresh_token || !client || !secret) {
      throw new Error('Missing required fields');
    }

    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refresh_token);

    const headers = {
      Authorization: `Basic ${btoa(`${client}:${secret}`)}`,
    };

    const reponse = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await reponse.json();
    kv.set('dropbox_access_token', data.access_token);

    res.status(200).json({
      accessToken: data.access_token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
