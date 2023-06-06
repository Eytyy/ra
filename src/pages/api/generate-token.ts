import { kv } from '@vercel/kv';
import { NextApiRequest, NextApiResponse } from 'next';

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
    // kv.set('dropbox_access_token', data.access_token);
    console.log(data);
    res.status(200).json({
      accessToken: data.access_token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
}
