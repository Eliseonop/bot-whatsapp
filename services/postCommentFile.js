const { credentials } = require('../utils/credential')
const axios = require('axios')
const URLAPI = process.env.APIURL_JIRA

async function postCommentFile (coment, etiqueta, Ids = []) {
  console.log('coment', coment)
  console.log('etiqueta', etiqueta)
  console.log('idfs', Ids)
  const envio =
    {
      additionalComment: {
        body: coment
      },
      public: true
    }
  if (Ids.length > 0) {
    envio.temporaryAttachmentIds = Ids
  }

  try {
    const response = await axios.post(
      URLAPI + `/request/AAC-${etiqueta}/attachment`,
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

module.exports = { postCommentFile }
