const url = process.env.APIURL_JIRA
const { default: axios } = require('axios')
const { credentials } = require('../utils/credential')
// const { readFileSync } = require('fs')
async function getReporteByCode (etiqueta) {
  try {
    const response = await axios.get(
      `${url}/request/${etiqueta}?expand=comment`,
      {
        headers: {
          Authorization: 'Basic ' + credentials,
          Accept: 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('Error al obtener el estado:', error.response.data)
    return error.response.data
  }
}
// async function obtenerImagenComoBuffer (url, mimeType) {
//   try {
//     // Realizar una solicitud HTTP para obtener la imagen
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: 'Basic ' + credentials,
//         Accept: 'application/json',
//         responseType: 'buffer'
//       }
//     })

//     if (response.status !== 200) {
//       throw new Error(
//         `No se pudo obtener la imagen. Código de estado: ${response.status}`
//       )
//     }
//     // const imagePath = 'image.jpg'
//     // const writer = readFileSync(imagePath)

//     // console.log('siendo el writer', writer)
//     const imagenBlob = new Blob([response.data], {
//       type: 'image/png'
//     })

//     return imagenBlob
//   } catch (error) {
//     console.error('Error al obtener la imagen:', error)
//     throw error
//   }
// }
module.exports = { getReporteByCode }
