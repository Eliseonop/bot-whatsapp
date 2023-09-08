const { addKeyword } = require('@bot-whatsapp/bot')
const { createReportFlow } = require('./createReportFlow')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
// const { temporalAttachment } = require('../services/tempAttachment')
// const { verificarNumeroEnArray } = require('../utils/usuarios')
const { verifyUser } = require('../utils/verifyUser')
const { coincideConRegexArray } = require('../utils/verifyComands')

const adwImagen1 =
  'Envíame imagenes *una por una*, por favor.' +
  '\n' +
  'Escriba *FIN* si desea concluir el proceso de carga de una imagen y proceder a la creación del Reporte.'
const regexReportar = /^[Rr][Ee][Pp][Oo][Rr][Tt][Aa][rR]$/

const reporteFlow = addKeyword(`${regexReportar}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    // const estado = state.getMyState()

    await verifyUser(ctx, endFlow, flowDynamic, state)

    return await flowDynamic(
      'Para cancelar la solicitud en cualquier momento escriba *CANCELAR*'
    )
  })
  .addAnswer(
    [
      '¿Proporcióname un título breve, por favor?',
      'Ejemplo: *Pantalla sin imagen*'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, endFlow, fallBack }) => {
      if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      if (coincideConRegexArray(ctx.body)) {
        return fallBack('🤔 No me envies el comando, intentalo de nuevo.')
      }

      state.update({
        title: ctx.body
      })
    }
  )
  .addAnswer(
    ['Ahora una descripción detallada de tu error *en una sola línea*'],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, endFlow }) => {
      if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      if (regexReportar.test(ctx.body)) {
        return fallBack('🤔 No me envies el comando, intentalo de nuevo.')
      }

      state.update({
        descripcion: ctx.body
      })
    }
  )
  .addAnswer(
    adwImagen1,
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      const respuesta = ctx?.body.toUpperCase().trim()
      if (ctx.message.imageMessage) {
        const buffer = await downloadMediaMessage(ctx, 'buffer')
        // console.log('si hay imagen', buffer)
        const mimeType = ctx.message.imageMessage?.mimetype
        const estado = state.getMyState()

        console.log('soy el estado', estado)
        if (estado?.imagenes && estado?.imagenes.length > 0) {
          state.update({
            imagenes: [...estado.imagenes, { buffer, mimeType }]
          })
        } else {
          console.log('estoy en el else')
          state.update({
            imagenes: [{ buffer, mimeType }]
          })
        }

        const newstate = state.getMyState()
        console.log('soy el estado 3', newstate)
        await fallBack('Siguiente imagen, Por favor')
      } else if (respuesta === 'FIN') {
        const estado = state.getMyState()
        if (estado.imagenes && estado.imagenes.length > 0) {
          await flowDynamic('Guardando Imagenes...')
        }
        await gotoFlow(createReportFlow)
      } else {
        // console.log('No es una imagen')
        await flowDynamic([
          '🤔 No es una imagen ',
          'Por favor, escriba *FIN* si desea concluir el proceso de carga de una imagen y proceder a la creación del Reporte.'
        ])
        await fallBack('Te lo volvere a preguntar')
      }
    },
    [createReportFlow]
  )
// .addAnswer(
//   ['Desea subir una imagen?', '[Si] O [No]', 'Escribe tu respuesta'],
//   { capture: true },
//   async (ctx, { endFlow, flowDynamic, fallBack, gotoFlow }) => {
//     const respuesta = ctx?.body.toLowerCase().replace(/\s+/g, '')

//     switch (respuesta) {
//       case 'si':
//         await flowDynamic('Elegiste subir imagen')
//         await gotoFlow(flujoImagen)
//         console.log('sali sel flujo imagen')

//         break
//       case 'no':
//         await flowDynamic('Elegiste No subir imagen imagen')
//         await gotoFlow(createReportFlow)
//         break
//       default:
//         return fallBack('No es una respuesta valida')
//     }
//   },
//   [flujoImagen, createReportFlow]
// )

module.exports = {
  reporteFlow,
  regexReportar
}

// TODO: CRAER REPORTE EN FLUJO PRINCIPAL
// TODO: LA IMAGEN ENVIADA SE ENVIA EN URL Y NO LA IMAGEN EN SI
