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

export function create(addonId: string, uploadId: string, source?: ReadStream) {
  const form = new FormData()
  form.append('upload', uploadId)
  if (source) form.append('source', source)
  return got(`addon/${encodeURIComponent(addonId)}/versions/`, {
    method: 'post',
    responseType: 'json',
    body: form
  })
}

export function upload(addon: ReadStream, channel: string) {
  const form = new FormData()
  form.append('upload', addon)
  form.append('channel', channel)
  return got(`upload/`, {
    method: 'post',
    responseType: 'json',
    body: form
  })
}

export interface UploadResponse {
  uuid: string
  channel: 'listed' | 'unlisted'
  processed: boolean
  submitted: boolean
  valid: boolean
  validation: object
  version: string
}
