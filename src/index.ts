import {upload} from './addons-server-api.js';
import * as core from '@actions/core';
import {PathLike, readFileSync} from 'fs';

function fetchManifest(file: PathLike) {
  return JSON.parse(readFileSync(file, {encoding: 'utf-8'}))
}

const addonId = core.getInput('addonId')
const addonFile = core.getInput('addonFile')
const sourceFile = core.getInput('sourceFile')
const manifestFile = core.getInput('manifestFile')

upload(addonId, addonFile, sourceFile).then(it => core.debug(JSON.stringify(it)))
