const url = process.env.APIURL_JIRA
const { credentials } = require('../utils/credential')

async function getStatus (etiqueta) {
  const resultado = await fetch(url + `/request/${etiqueta}/comment`, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + credentials,
      Accept: 'application/json'
    }
  })

  const data = await resultado.json()

  return data
}

module.exports = { getStatus }
