import {create, upload, uploadDetail, UploadResponse} from './addons-server-api.js';
import * as core from '@actions/core';
import {createReadStream, statSync} from 'fs';
import {HTTPError} from 'got';

const addonId = core.getInput('addonId')
const addonFile = core.getInput('addonFile')
const sourceFile = core.getInput('sourceFile')
const channel = core.getInput('channel')

const addonStats = statSync(addonFile)
const sourceStats = statSync(sourceFile)

core.debug(`Addon file stats:
  Path: ${addonFile}
  isFile: ${addonStats.isFile()}
  Size: ${addonStats.size}`)

if (sourceFile?.length) {
  core.debug(`Source file stats:
  Path: ${sourceFile}
  isFile: ${sourceStats.isFile()}
  Size: ${sourceStats.size}`)
}

try {
  const uploadResponse = await upload(createReadStream(addonFile), channel).json<UploadResponse>()

  core.debug(
    `Upload Response:
  ${JSON.stringify(uploadResponse, undefined)}`
  )

  await new Promise((resolve, reject) => {
    const task = setInterval(async () => {
      const detail = await uploadDetail(uploadResponse.uuid)
      if (detail.valid) {
        resolve(detail)
        clearInterval(task)
      } else if (detail.validation) {
        reject(detail.validation)
      }
    }, 500)
  }).catch(validation => core.error(`Upload is valid: ${JSON.stringify(validation)}`))

  const createResponse = await create(addonId, uploadResponse.uuid, sourceFile?.length ? createReadStream(sourceFile) : undefined)
  core.debug(`Create response: ${JSON.stringify(createResponse)}`)
} catch (it) {
  const e = it as HTTPError
  core.error(`Url: ${e.request.requestUrl}`)
  core.error(`Response: ${JSON.stringify(e.response.body, undefined, '  ')}`)
  core.error(e)
}
