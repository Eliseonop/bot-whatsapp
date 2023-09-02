const { credentials } = require('../utils/credential')
const FormData = require('form-data')
const URLAPI = process.env.APIURL_JIRA

async function uploadImageToJira (imageBuffer, type) {
  console.log('el buffer', imageBuffer)
  console.log('el tipo', type)
  const formData = new FormData()
  const parts = type.split('/')
  console.log('form data 1', formData)

  const extension = parts[1]

  const nombreArchivo = `file${Date.now().toString()}.${extension}`
  // const file = new File([imageBuffer], nombreArchivo, {
  //   type: `image/${extension}`
  // })
  console.log('soy el nomnbre del archivo', nombreArchivo)
  formData.append('file', imageBuffer, {
    filename: nombreArchivo,
    type: `image/${extension}`
  })
  console.log('form data 2', formData)
  try {
    const response = await fetch(
      URLAPI + '/servicedesk/1/attachTemporaryFile',
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + credentials,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'X-Atlassian-Token': 'no-check'
        },
        body: formData
      }
    )

    console.log('soy la resonse 28', response)
    const data = await response.json()

    console.log('soy la data', data)
    const temporaryAttachmentIds = await data.temporaryAttachments.map(
      ({ temporaryAttachmentId }) => temporaryAttachmentId
    )

    console.log('la respuesta', temporaryAttachmentIds)
    return temporaryAttachmentIds
  } catch (error) {
    console.log('⚡☢☣⚡')
    console.log(error)
  }
}

module.exports = { uploadImageToJira }
