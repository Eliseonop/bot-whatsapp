// const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
// const { downloadMediaMessage } = require('@whiskeysockets/baileys')
// const { temporalAttachment } = require('../services/tempAttachment')
// const { createReportFlow } = require('./createReportFlow')

// const flujoImagen = addKeyword(EVENTS.MEDIA).addAnswer(
//   [
//     'Envíame una captura, imagen o foto, por favor.',
//     'Para salir del paso de subir imagen y crear el reporte',
//     'Escribe *[Fin]*'
//   ],
//   {
//     capture: true
//   },
//   async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
//     const respuesta = ctx?.body.toLowerCase().replace(/\s+/g, '')
//     if (ctx.message.imageMessage) {
//       const buffer = await downloadMediaMessage(ctx, 'buffer')
//       const mimeType = ctx.message.imageMessage?.mimetype
//       const estado = state.getMyState()

//       console.log('soy el estado', estado)
//       state.update({
//         images: [{ buffer, mimeType }]
//       })
//       const respustaImagenJira = await temporalAttachment(buffer, mimeType)
//       console.log('respuesta jira')
//       if (respustaImagenJira.temporaryAttachments) {
//         const temporaryAttachmentIds =
//           await respustaImagenJira.temporaryAttachments.map(
//             ({ temporaryAttachmentId }) => temporaryAttachmentId
//           )
//         const estado = state.getMyState()
//         if (estado.idImages && estado.idImages.length > 0) {
//           state.update({
//             idImages: [...estado.idImages, ...temporaryAttachmentIds]
//           })
//           console.log(
//             'la respuesta temporaryAttachmentIds',
//             temporaryAttachmentIds
//           )
//         } else {
//           state.update({
//             idImages: temporaryAttachmentIds
//           })
//         }

//         await fallBack()
//       }
//       console.log(respustaImagenJira)
//     } else if (respuesta === 'fin') {
//       const estado = state.getMyState()
//       if (estado.idImages && estado.idImages.length > 0) {
//         await flowDynamic('Guardando Imagenes')
//       }
//       return gotoFlow(createReportFlow)
//     } else {
//       await flowDynamic([
//         'No es una imagen',
//         'Escribe *[Fin]* si ya no quieres subir una imagen'
//       ])
//       await fallBack('Te lo volvere a preguntar')
//     }
//   },
//   [createReportFlow]
// )

// module.exports = {
//   flujoImagen
// }
