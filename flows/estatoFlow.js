const { addKeyword } = require('@bot-whatsapp/bot')
const moment = require('moment-timezone')
const { getStatus } = require('../services/getStatus')
require('moment/locale/es')

const expresionRegular = /^AAC-/
let intentos = 2
const estadoFlow = addKeyword('ENTRANDO_REPORTES').addAnswer(
  ['Dime el *IDENTIFICADOR* del reporte'],
  {
    capture: true
  },

  async (ctx, { endFlow, fallBack, flowDynamic }) => {
    if (ctx.body === 'FIN') {
      return endFlow(' *Canlelando..*Adios')
    }

    if (expresionRegular.test(ctx.body)) {
      await flowDynamic('Buscando ultimo comentario...')

      const respuesta = await getStatus(ctx.body)

      const cmt = obtenerUltimoComentario(respuesta)

      if (cmt) {
        console.log(cmt)
        await flowDynamic([
          `*${cmt.user} ${cmt.fecha}*`,
          `comentario: *${cmt.comment}* `
        ])
      } else {
        await flowDynamic('No hay comentarios disponibles')
      }

      console.log(respuesta)
    } else {
      await flowDynamic('‼️ Error Identificador no valido ‼️')
      intentos--

      if (intentos === 0) {
        await flowDynamic('Intentos saturados')
        return endFlow('Gracias por usar nuestros servicios')
      } else {
        return fallBack()
      }
    }
  }
)

function obtenerUltimoComentario (data) {
  if (data.values.length > 0) {
    const ultimoComentario = data.values[data.values.length - 1]

    const fechaParseada = moment(
      ultimoComentario.created.jira,
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    )
    fechaParseada.locale('es')
    const formatoDeseado = fechaParseada.format(
      ' DD [de] MMMM [de] YYYY, HH:mm:ss'
    )
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
  estadoFlow
}
