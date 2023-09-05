const url = process.env.APIURL_JIRA
const { default: axios } = require('axios')
const { credentials } = require('../utils/credential')

async function createReport (descripcion, titulo, attachmentArray) {
  const data = {
    serviceDeskId: '1',
    requestTypeId: '1',
    requestFieldValues: {
      summary: titulo,
      description: descripcion
    },
    requestParticipants: ['62028815f5d29a0068fb1dd0']
  }
  if (attachmentArray.length > 0) {
    data.requestFieldValues.attachment = attachmentArray
  }
  console.log('esta es la data que se envia', data)

  try {
    const response = await axios.post(url + '/request', data, {
      headers: {
        Authorization: 'Basic ' + credentials,
        Accept: 'application/json'
      }
    })

    console.log('request', response.data)
    return response.data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

module.exports = { createReport }
