// const { obtenerImagenComoBuffer } = require('../../../services/getStatus')
const { parseAndFormatJiraDate } = require('../../../utils/parseFecha')
const moment = require('moment-timezone')

async function obtenerUltimoComentario (data) {
  // let imagen
  if (data.values.length > 0) {
    const ultimoComentario = data.values[data.values.length - 1]
    console.log('ultimo comentario', ultimoComentario?.attachments?.values)

    const misValues = ultimoComentario?.attachments?.values
    console.log('soy el content', misValues)
    // if (misValues.length > 0) {
    //   const elContent = misValues[0]._links?.content
    //   const mimeType = misValues[0].mimeType
    //   console.log('soy el contnt', elContent)
    //   const laImagen = await obtenerImagenComoBuffer(elContent, mimeType)
    //   const blobUrl = URL.createObjectURL(laImagen)
    //   imagen = blobUrl
    //   console.log('Yo soy la imagen buffer', laImagen)
    // }
    const fechaParseada = moment(
      ultimoComentario.created.jira,
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    )
    fechaParseada.locale('es')
    const formatoDeseado = parseAndFormatJiraDate(ultimoComentario.created.jira)
    return {
      fecha: formatoDeseado,
      comment: ultimoComentario.body,
      user: ultimoComentario.author.displayName
      // imagen
    }
  } else {
    return null // Retorna null si no hay comentarios
  }
}

module.exports = {
  obtenerUltimoComentario
}
