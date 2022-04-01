import _got from 'got';
import { token } from './addons-server-api.js';
import * as core from '@actions/core';
const got = _got.extend({
    headers: {
        Authorization: `JWT ${token(core.getInput('apiKey'), core.getInput('apiSecret'))}`
    }
});
export default got;
//# sourceMappingURL=got.js.map