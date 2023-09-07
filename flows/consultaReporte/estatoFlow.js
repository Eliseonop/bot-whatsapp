const { addKeyword } = require('@bot-whatsapp/bot')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { obtenerUltimoComentario } = require('./utils/ultimoComentario')
const { extraerComentarioConImagen } = require('./utils/comentarioImagen')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
require('moment/locale/es')

// Función común para manejar la respuesta
async function handleResponse (ctx, flowDynamic, endFlow, fallBack, intentos) {
  if (ctx.body === 'CANCELAR') {
    await flowDynamic('*Cancelando peticion..')
    return endFlow(' *Adios*')
  }

  if (expresionRegular.test(ctx.body)) {
    const respuesta = await getReporteByCode(ctx.body)
    if (respuesta?.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }
    await flowDynamic('🧐 Buscando ultimo comentario...')

    const cmt = await obtenerUltimoComentario(respuesta)

    const comentarioExtraido = extraerComentarioConImagen(cmt.comment)

    console.log('comentario extraido', comentarioExtraido)
    if (cmt) {
      const regex = /^![^\n]*\|width=\d+,height=\d+!$/

      if (regex.test(comentarioExtraido)) {
        return await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
      }
      await flowDynamic(
        `*${cmt.user}* ${cmt.fecha} \n` + `comentario: *${comentarioExtraido}* `
      )
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

const expresionRegular = /^AAC-/
const regVer = /^#VER$/
const intentos = 2

const estadoFlow = addKeyword(`${regVer}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const usuario = verificarNumeroEnArray(+ctx.from)
    if (usuario !== null) {
      console.log('el usuario si tiene permisos ')
      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    } else {
      await flowDynamic('🤨 El Usuario no tiene permisos')
      return endFlow('Adios')
    }
  })
  .addAnswer(
    ['Por favor, proporciona el 🔎 *IDENTIFICADOR* del reporte.'],
    {
      capture: true
    },
    async (ctx, { endFlow, fallBack, flowDynamic }) => {
      await handleResponse(ctx, flowDynamic, endFlow, fallBack, intentos)
    }
  )

module.exports = {
  estadoFlow
}
