const { credentials } = require('../utils/credential')
const axios = require('axios')
const URLAPI = process.env.APIURL_JIRA

async function postComment (coment, etiqueta) {
  const envio =
    {
      body: coment,
      public: true
    }

  try {
    const response = await axios.post(
      URLAPI + `/request/AAC-${etiqueta}/comment`,
      envio,
      {
        headers: {
          // method: 'POST',
          // headers: {
          Authorization: 'Basic ' + credentials,
          'X-Atlassian-Token': 'no-check',
          'Content-Type': 'application/json'
          // }
        }
      }
    )

    const data = await response.data

    return data
  } catch (error) {
    console.log(error)
    return error.response.data
  }
}

module.exports = { postComment }
