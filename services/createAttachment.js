// const { credentials } = require('../utils/credential')
// const axios = require('axios')
// const URLAPI = process.env.APIURL_JIRA

// async function createAttachment (datos, etiqueta) {
//   console.log('soy los datos', datos)
//   console.log('soy la etiqueta', etiqueta)
//   try {
//     const response = await axios.post(
//       URLAPI + `/request/${etiqueta}/attachment`,
//       datos,
//       {
//         headers: {
//           Authorization: 'Basic ' + credentials,
//           'X-Atlassian-Token': 'no-check'
//         }
//       }
//     )

//     const data = await response.data

//     return data
//   } catch (error) {
//     console.log('⚡☢☣⚡')
//     console.log(error)
//     return error
//   }
// }

// module.exports = { createAttachment }
