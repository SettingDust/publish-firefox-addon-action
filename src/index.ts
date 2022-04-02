import {upload} from './addons-server-api.js';
import * as core from '@actions/core';
import {createReadStream, PathLike, readFileSync, statSync} from 'fs';
import {HTTPError} from 'got';

function fetchManifest(file: PathLike) {
  return JSON.parse(readFileSync(file, {encoding: 'utf-8'}))
}

const addonId = core.getInput('addonId')
const addonFile = core.getInput('addonFile')
const sourceFile = core.getInput('sourceFile')
const manifestFile = core.getInput('manifestFile')

const addonStats = statSync(addonFile)
const sourceStats = statSync(sourceFile)

core.info(`Addon file stats:`)
core.info(
  `  Path: ${addonFile}
  isFile: ${addonStats.isFile()}
  Size: ${addonStats.size}
`)

if (sourceFile?.length) {
  core.info(`Source file stats:`)
  core.info(
    `  Path: ${sourceFile}
  isFile: ${sourceStats.isFile()}
  Size: ${sourceStats.size}
`)
}

upload(addonId, createReadStream(addonFile), sourceFile?.length ? createReadStream(sourceFile) : undefined)
  .then(it => core.debug(JSON.stringify(it.body)))
  .catch((it: HTTPError) => {
    core.error(`Url: ${it.request.requestUrl}`)
    core.error(it)
    core.error(JSON.stringify(it.response.body))
  })
