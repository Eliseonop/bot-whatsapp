const { credentials } = require('../utils/credential')
const axios = require('axios')
// const { createReadStream } = require('fs')
const FormData = require('form-data')
const URLAPI = process.env.APIURL_JIRA

async function temporalAttachment (imageBuffer, type) {
  const formData = new FormData()
  const parts = type.split('/')

  const extension = parts[1]

  const nombreArchivo = `file${Date.now().toString()}.${extension}`

  formData.append('file', imageBuffer, nombreArchivo)

  const headers = formData.getHeaders()

  try {
    const response = await axios.post(
      URLAPI + '/servicedesk/1/attachTemporaryFile',
      formData,
      {
        headers: {
          // method: 'POST',
          // headers: {
          Authorization: 'Basic ' + credentials,
          'X-Atlassian-Token': 'no-check',
          ...headers
          // }
        }
      }
    )

    const data = await response.data

    return data
  } catch (error) {
    console.log('⚡☢☣⚡')
    console.log(error)
    return error
  }
}

module.exports = { temporalAttachment }
