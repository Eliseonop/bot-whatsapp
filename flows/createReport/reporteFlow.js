const { addKeyword } = require('@bot-whatsapp/bot')
const { createReportFlow } = require('./createReportFlow')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')

const { verifyUser } = require('../../utils/verifyUser')

const regexReportar = /^[Rr][Ee][Pp][Oo][Rr][Tt][Aa][rR]$/

const reporteFlow = addKeyword(`${regexReportar}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    // state.clear()
    await verifyUser(ctx, endFlow, flowDynamic, state)

    return await flowDynamic(
      'Para cancelar la solicitud en cualquier momento escriba *CANCELAR*'
    )
  })
  .addAnswer(
    [
      '📝 Proporcióname un título breve, por favor',
      'Ejemplo: *Pantalla sin imagen*'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, endFlow, fallBack }) => {
      if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      if (regexReportar.test(ctx.body)) {
        return fallBack(['🤔 No me envies el comando, intentalo de nuevo.', 'O Para cancelar escribe *CANCELAR*'])
      }

      state.update({
        title: ctx.body
      })
    }
  )
  .addAnswer(
    [
      '🚀 Para proceder a *crear* el *Reporte*, escriba *ENVIAR*\n',
      '📝 Por favor, bríndanos una *descripción detallada* y, si es posible, *adjunta imágenes* 📷 que pueda ayudarnos'],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      // console.log(ctx.message)
      if (regexReportar.test(ctx.message?.conversation)) {
        return fallBack(['🤔 No me envies el comando, intentalo de nuevo.', 'O Para cancelar escribe *CANCELAR*'])
      }
      if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      const estado = state.getMyState()
      const respuesta = ctx?.message?.conversation.toUpperCase().trim()
      if (respuesta === 'ENVIAR') {
        if (estado?.descripcion) {
          // console.log('clg descip', estado.descripcion)
          await gotoFlow(createReportFlow)
          return
        } else {
          return await fallBack('🤔 Agrega una descripcion, por favor')
        }
      }
      if (ctx.message?.conversation) {
        if (estado?.descripcion) {
          state.update({
            descripcion: estado.descripcion + '\n' + ctx.message?.conversation
          })
        } else {
          state.update({
            descripcion: ctx.message?.conversation
          })
        }
      }
      // const estado = state.getMyState()
      if (ctx.message?.imageMessage) {
        const buffer = await downloadMediaMessage(ctx, 'buffer')
        // console.log('si hay imagen', buffer)
        const mimeType = ctx.message.imageMessage?.mimetype

        if (estado?.imagenes && estado?.imagenes.length > 0) {
          state.update({
            imagenes: [...estado.imagenes, { buffer, mimeType }]
          })
        } else {
          // console.log('soy una imagen', ctx)
          state.update({
            imagenes: [{ buffer, mimeType }]
          })
        }
        if (ctx.message?.imageMessage?.caption) {
          // console.log('mensaje de la imagen', ctx.message?.imageMessage?.caption)
          if (estado.descripcion) {
            state.update({
              descripcion:
                estado.descripcion + '\n' + ctx.message.imageMessage.caption
            })
          } else {
            // console.log('estoy en el else')

            state.update({
              descripcion: ctx.message?.imageMessage?.caption
            })
          }
        }
        // console.log(state.getMyState())
        // await fallBack('')
      }

      await fallBack('Anotado, ¿Algo más?')
    }
  )

module.exports = {
  reporteFlow,
  regexReportar
}
