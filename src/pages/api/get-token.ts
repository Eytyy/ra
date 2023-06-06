import { kv } from '@vercel/kv';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GetToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = await kv.get('dropbox_access_token');
  res.status(200).json({
    accessToken,
  });
}
