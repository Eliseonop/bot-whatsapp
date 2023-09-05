const { addKeyword } = require('@bot-whatsapp/bot')
const { getStatus } = require('../../services/getStatus')
const { obtenerUltimoComentario } = require('./utils/ultimoComentario')
require('moment/locale/es')

const expresionRegular = /^AAC-/
let intentos = 2
const estadoFlow = addKeyword('ENTRANDO_REPORTES').addAnswer(
  ['Por favor, proporciona el 🔎 *IDENTIFICADOR* del reporte.'],
  {
    capture: true
  },

  async (ctx, { endFlow, fallBack, flowDynamic }) => {
    if (ctx.body === 'CANCELAR') {
      await flowDynamic('*Cancelando peticion..')
      return endFlow(' *Adios*')
    }

    if (expresionRegular.test(ctx.body)) {
      await flowDynamic('🧐 Buscando ultimo comentario...')

      const respuesta = await getStatus(ctx.body)

      const cmt = obtenerUltimoComentario(respuesta)

      if (cmt) {
        console.log(cmt)
        await flowDynamic([
          `*${cmt.user} ${cmt.fecha}*`,
          `comentario: *${cmt.comment}* `
        ])
      } else {
        await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
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

module.exports = {
  estadoFlow
}
