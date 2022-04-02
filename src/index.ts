import {create, upload, UploadResponse} from './addons-server-api.js';
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
const channel = core.getInput('channel')

const addonStats = statSync(addonFile)
const sourceStats = statSync(sourceFile)

core.info(`Addon file stats:`)
core.info(`
  Path: ${addonFile}
  isFile: ${addonStats.isFile()}
  Size: ${addonStats.size}`)

if (sourceFile?.length) {
  core.info(`Source file stats:`)
  core.info(`
  Path: ${sourceFile}
  isFile: ${sourceStats.isFile()}
  Size: ${sourceStats.size}`)
}

try {
  const uploadResponse = await upload(createReadStream(addonFile), channel).json<UploadResponse>()

  core.debug(
    `Upload Response:
  ${JSON.stringify(uploadResponse, undefined, 2)}`
  )

  const createResponse = await create(addonId, uploadResponse.uuid, sourceFile?.length ? createReadStream(sourceFile) : undefined)
  core.debug(JSON.stringify(createResponse.body))
} catch (it) {
  const e = it as HTTPError
  core.error(`Url: ${e.request.requestUrl}`)
  core.error(`Response: ${JSON.stringify(e.response.body, undefined, 2)}`)
  core.error(e)
}
