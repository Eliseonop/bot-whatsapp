const { addKeyword } = require('@bot-whatsapp/bot')
const { createReportFlow } = require('./createReportFlow')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const { temporalAttachment } = require('../services/tempAttachment')
const { verificarNumeroEnArray } = require('../utils/usuarios')

const reporteFlow = addKeyword('REPORTE', {
  sensitive: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const estado = state.getMyState()
    console.log('estado', estado)
    console.log('ctx', ctx)
    console.log('vamos a ver la validacions', estado?.usuario === 'undefined')
    if (estado === undefined) {
      const usuario = verificarNumeroEnArray(+ctx.from)
      if (usuario !== null) {
        console.log('el usuario si tiene permisos ')
        state.update({
          usuario
        })

        return await flowDynamic(`👋Bienvenido *${usuario.name}*👋`)
      } else {
        await flowDynamic('🤨 El Usuario no tiene permisos')
        return endFlow('Adios')
      }
    }
  })
  .addAnswer(
    [
      'Por favor, proporcióname una descripción detallada de tu error en *en una sola línea*'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, endFlow }) => {
      state.update({
        descripcion: ctx.body
      })
    }
  )
  .addAnswer(
    ['¿Un título breve, por favor?', 'Ejemplo: * Pantalla sin imagen *'],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state }) => {
      state.update({
        title: ctx.body
      })

      const myState = state.getMyState()

      console.log(myState)
    }
  )
  .addAnswer(
    [
      'Envíame una captura, imagen o foto, por favor.',
      'Para salir del paso de subir imagen',
      'Escribe *[Fin]*'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      const respuesta = ctx?.body.toLowerCase().replace(/\s+/g, '')
      if (ctx.message.imageMessage) {
        const buffer = await downloadMediaMessage(ctx, 'buffer')
        console.log('si hay imagen', buffer)
        const mimeType = ctx.message.imageMessage?.mimetype

        const respustaImagenJira = await temporalAttachment(buffer, mimeType)

        if (respustaImagenJira.temporaryAttachments) {
          // await flowDynamic('Guardando Imagen')
          const temporaryAttachmentIds =
            await respustaImagenJira.temporaryAttachments.map(
              ({ temporaryAttachmentId }) => temporaryAttachmentId
            )
          const estado = state.getMyState()
          if (estado.idImages && estado.idImages.length > 0) {
            state.update({
              idImages: [...estado.idImages, ...temporaryAttachmentIds]
            })
            console.log('la respuesta', temporaryAttachmentIds)
            console.log('soy la respuesta')
          } else {
            state.update({
              idImages: temporaryAttachmentIds
            })
          }

          console.log('soy el staet 44', state.getMyState())
          // await flowDynamic('Imagen guardada')
          await fallBack('Siguiente imagen Porfavor')

          //  // TODO: al parecer luego del flow la logica del primer flow sigue,
          // await gotoFlow(createReportFlow)
        }
        console.log(respustaImagenJira)
      } else if (respuesta === 'fin') {
        const estado = state.getMyState()
        if (estado.idImages && estado.idImages.length > 0) {
          await flowDynamic('Guardando Imagenes')
        }
        await gotoFlow(createReportFlow)
      } else {
        console.log('No es una imagen')
        await flowDynamic([
          'No es una imagen',
          'Escribe *[Fin]* si ya no quieres subir una imagen'
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
  reporteFlow
}

// TODO: CRAER REPORTE EN FLUJO PRINCIPAL
// TODO: LA IMAGEN ENVIADA SE ENVIA EN URL Y NO LA IMAGEN EN SI
