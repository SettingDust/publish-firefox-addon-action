import {upload} from './addons-server-api.js';
import * as core from '@actions/core';
import {PathLike, readFileSync} from 'fs';
import {HTTPError} from 'got';

function fetchManifest(file: PathLike) {
  return JSON.parse(readFileSync(file, {encoding: 'utf-8'}))
}

const addonId = core.getInput('addonId')
const addonFile = core.getInput('addonFile')
const sourceFile = core.getInput('sourceFile')
const manifestFile = core.getInput('manifestFile')

upload(addonId, addonFile, sourceFile).then(it => core.debug(JSON.stringify(it.body))).catch((it: HTTPError) => {
  core.error(`Url: ${it.request.requestUrl}`)
  core.error(it)
  core.error(JSON.stringify(it.response.body))
})
