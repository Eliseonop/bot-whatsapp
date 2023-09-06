const { credentials } = require('../utils/credential')
const axios = require('axios')
// const { createReadStream } = require('fs')
const FormData = require('form-data')
const URLAPI = process.env.APIURL_JIRA

async function temporalAttachment (array) {
  // const array = []
  const formData = new FormData()

  array.forEach(async element => {
    const parts = element.mimeType.split('/')

    const extension = parts[1]
    const randomName = Math.random().toString(36).substring(2, 12)
    const nombreArchivo = `file${randomName}.${extension}`

    formData.append('file', element.buffer, nombreArchivo)
  })

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
