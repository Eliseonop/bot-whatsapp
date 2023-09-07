const { addKeyword } = require('@bot-whatsapp/bot')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { procesarConComentario } = require('./utils/procesarConComentario')
require('moment/locale/es')

// Función común para manejar la respuesta
async function handleResponse (ctx, flowDynamic, endFlow, fallBack, intentos) {
  if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
    await flowDynamic('*Cancelando peticion..')
    return endFlow(' *Adios*')
  }

  if (expresionRegular.test(ctx.body)) {
    const respuesta = await getReporteByCode(ctx.body)
    if (respuesta?.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }
    const dataProcesada = procesarConComentario(respuesta)

    await flowDynamic('🧐 Buscando ultimo comentario...')

    if (dataProcesada) {
      await flowDynamic(`${dataProcesada}`)

      return endFlow('Gracias por usar nuestros servicios')
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

const expresionRegular = /^(\d+)/
const regVer = /^[Vv][Ee][Rr]$/
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
