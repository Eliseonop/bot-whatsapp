const { addKeyword } = require('@bot-whatsapp/bot')
const { createReportFlow } = require('./createReportFlow')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
// const { temporalAttachment } = require('../services/tempAttachment')
const { verificarNumeroEnArray } = require('../utils/usuarios')

const adwImagen1 =
  'Envíame imagenes *una por una*, por favor.' +
  '\n' +
  'Para terminar escribe *[Fin]*'

const reporteFlow = addKeyword('REPORTAR', {
  sensitive: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const estado = state.getMyState()

    if (estado === undefined) {
      const usuario = verificarNumeroEnArray(+ctx.from)
      if (usuario !== null) {
        console.log('el usuario si tiene permisos ')
        state.update({
          usuario
        })

        await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
      } else {
        await flowDynamic('🤨 El Usuario no tiene permisos')
        return endFlow('Adios')
      }
    }

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
    async (ctx, { flowDynamic, state, endFlow }) => {
      if (ctx.body === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
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
      if (ctx.body === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }

      state.update({
        descripcion: ctx.body
      })

      const myState = state.getMyState()

      console.log(myState)
    }
  )
  .addAnswer(
    adwImagen1,
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      console.log('Soy el ctx', ctx)
      if (ctx.body === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      const respuesta = ctx?.body.toLowerCase().replace(/\s+/g, '')
      if (ctx.message.imageMessage) {
        const buffer = await downloadMediaMessage(ctx, 'buffer')
        // console.log('si hay imagen', buffer)
        const mimeType = ctx.message.imageMessage?.mimetype
        const estado = state.getMyState()

        console.log('soy el estado', estado)
        if (estado?.imagenes && estado?.imagenes.length > 0) {
          // console.log('entrando a images')
          // console.log('el estado . images', estado.imagenes)

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
        await fallBack('Siguiente imagen Porfavor')

        // const respustaImagenJira = await temporalAttachment(buffer, mimeType)

        //   if (respustaImagenJira.temporaryAttachments) {
        //     // // await flowDynamic('Guardando Imagen')
        //     // const temporaryAttachmentIds =
        //     //   await respustaImagenJira.temporaryAttachments.map(
        //     //     ({ temporaryAttachmentId }) => temporaryAttachmentId
        //     //   )
        //     // const estado = state.getMyState()
        //     // if (estado.idImages && estado.idImages.length > 0) {
        //     //   state.update({
        //     //     idImages: [...estado.idImages, ...temporaryAttachmentIds]
        //     //   })
        //     //   // console.log('la respuesta', temporaryAttachmentIds)
        //     //   // console.log('soy la respuesta')
        //     // } else {
        //     //   state.update({
        //     //     idImages: temporaryAttachmentIds
        //     //   })
        //     // }

        //     console.log('soy el staet 44', state.getMyState())
        //     // await flowDynamic('Imagen guardada')
        //     await fallBack('Siguiente imagen Porfavor')

        //     //  // TODO: al parecer luego del flow la logica del primer flow sigue,
        //     // await gotoFlow(createReportFlow)
        //   }
        //   console.log(respustaImagenJira)
      } else if (respuesta === 'fin') {
        const estado = state.getMyState()
        if (estado.imagenes && estado.imagenes.length > 0) {
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
