const url = process.env.APIURL_JIRA
const { credentials } = require('../utils/credential')

async function createReport (descripcion, titulo) {
  const data = {
    serviceDeskId: '1',
    requestTypeId: '1',
    requestFieldValues: {
      summary: titulo,
      description: descripcion
    },
    requestParticipants: ['62028815f5d29a0068fb1dd0']
  }

  const resultado = await fetch(url + '/request', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + credentials,
      Accept: 'application/json'
    },
    body: data
  })

  const respuesta = await resultado.json()

  return respuesta
}

module.exports = { createReport }
