const { parseAndFormatJiraDate } = require('../../../utils/parseFecha')
const moment = require('moment-timezone')

function obtenerUltimoComentario (data) {
  if (data.values.length > 0) {
    const ultimoComentario = data.values[data.values.length - 1]

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
    }
  } else {
    return null // Retorna null si no hay comentarios
  }
}

module.exports = {
  obtenerUltimoComentario
}
