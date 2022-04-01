import _got from 'got'
import {token} from './addons-server-api.js';
import * as core from '@actions/core';

const got = _got.extend({
  headers: {
    Authorization: `JWT ${token(core.getInput('jwtIssuer'), core.getInput('jwtSecret'))}`
  }
})

export default got
