import jwt from 'jsonwebtoken';
import got from './got.js';
import FormData from 'form-data';
import {createReadStream, PathLike} from 'fs';

export const API_BASE = 'https://addons.mozilla.org/api/v5/addons'

export function token(userId: string, secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  return jwt.sign({
    iss: userId,
    jti: Math.random().toString(),
    iat: issuedAt,
    // 5min https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#create-a-jwt-for-each-request
    exp: issuedAt + 300
  }, secret)
}

export function upload(addonId: string, addon: PathLike, source?: PathLike) {
  const form = new FormData()
  form.append('upload', createReadStream(addon))
  if (source) form.append('source', createReadStream(source))
  return got(`${API_BASE}/addon/${encodeURIComponent(addonId)}/versions/`, {
    method: 'post',
    responseType: 'json',
    body: form
  })
}
