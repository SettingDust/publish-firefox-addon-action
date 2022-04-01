import {upload} from './addons-server-api.js';
import * as core from '@actions/core';

const addonId = core.getInput('addonId')
const addonFile = core.getInput('addonFile')
const sourceFile = core.getInput('sourceFile')

upload(addonId, addonFile, sourceFile).then(it => core.debug(JSON.stringify(it)))
