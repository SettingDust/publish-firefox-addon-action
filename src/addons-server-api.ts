import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import {createReadStream, PathLike, ReadStream} from 'fs';
import _got from 'got'
import * as core from '@actions/core';

const got = _got.extend({
  prefixUrl: 'https://addons.mozilla.org/api/v5/addons',
  headers: {
    Authorization: `JWT ${token(core.getInput('jwtIssuer'), core.getInput('jwtSecret'))}`
  }
})

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

export function upload(addonId: string, addon: ReadStream, source?: ReadStream) {
  const form = new FormData()
  form.append('upload', addon)
  if (source) form.append('source', source)
  return got(`addon/${encodeURIComponent(addonId)}/versions/`, {
    method: 'post',
    responseType: 'json',
    body: form
  })
}
