const { addKeyword } = require('@bot-whatsapp/bot')
// const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { procesarConComentario } = require('../consultaReporte/utils/procesarConComentario')
const { verifyUser } = require('../../utils/verifyUser')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const { createComentFinal } = require('./createComentFlow')

const regexComentar = /^[Cc][Oo][Mm][Ee][Nn][Tt][Aa][Rr] (\d+)/
// const regexNumero = /^\d+$/
const comentarFlow = addKeyword(`${regexComentar}`, {
  regex: true
})
  . addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic, state, true)
  })
  . addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    // console.log('soy el ctx', ctx)

    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')
    const miState = state.getMyState()

    state.update({
      ...miState,
      etiqueta: arrayDePalabras[1],
      comentario: ''
    })

    // const miState2 = state.getMyState()
    // console.log('soy el miState2', miState2)

    const respuesta = await getReporteByCode(arrayDePalabras[1])

    if (respuesta.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }

    const dataProcesada = procesarConComentario(respuesta)

    if (dataProcesada) {
      await flowDynamic('🧐 Este es el *Reporte* al cual agregarás un *comentario*...')
      await flowDynamic(`${dataProcesada}`)
    } else {
      await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
    }
  }).addAnswer(['❌ Escribe *CANCELAR* para *salir*.',
    '📝 Escribe *ENVIAR* para enviar',
    '✍ Dime tu comentario, Por favor'], { capture: true }, async (ctx, { flowDynamic, endFlow, state, fallBack, gotoFlow }) => {
    const estado = state.getMyState()
    const respuesta = ctx?.message?.conversation.toUpperCase().trim()
    // console.log('etiqueta', etiqueta, usuario)
    if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
      return endFlow('😀 Vuelve pronto.')
    }
    if (respuesta === 'ENVIAR') {
      return gotoFlow(createComentFinal)
    }
    if (regexComentar.test(ctx.body)) {
      return fallBack('🤔 No me envies el comando, intentalo de nuevo.')
    }

    if (ctx.message?.conversation) {
      state.update({
        comentario: `${estado.comentario}${estado.comentario.length > 0 ? '\n' : ''}` + ctx.message?.conversation
      })
    }
    if (ctx.message?.imageMessage) {
      const buffer = await downloadMediaMessage(ctx, 'buffer')
      // console.log('si hay imagen', buffer)
      const mimeType = ctx.message.imageMessage?.mimetype

      if (estado?.imagenesComent && estado?.imagenesComent.length > 0) {
        state.update({
          ...state.getMyState(),
          imagenesComent: [...estado.imagenesComent, { buffer, mimeType }]
        })
      } else {
        // console.log('soy una imagen', ctx)
        state.update({
          ...state.getMyState(),
          imagenesComent: [{ buffer, mimeType }]
        })
      }
      if (ctx.message?.imageMessage?.caption) {
        state.update({
          ...state.getMyState(),
          comentario: `${estado.comentario}${estado.comentario.length > 0 ? '\n' : ''}` + ctx.message?.imageMessage?.caption
        })
      }
    }
    console.log('soy el 89 898 89 89 8 9 89 8 ', state.getMyState())
    return await fallBack('Anotado, ¿Algo más?')
  })

module.exports = { comentarFlow, regexComentar, createComentFinal }
