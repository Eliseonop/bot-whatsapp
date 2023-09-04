const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const { temporalAttachment } = require('../services/tempAttachment')
const { createReportFlow } = require('./createReportFlow')

const flujoImagen = addKeyword(EVENTS.MEDIA).addAnswer(
  [
    'Envíame una captura, imagen o foto, por favor.',
    'Para salir del paso de subir imagen',
    'Escribe *[Fin]*'
  ],
  {
    capture: true
  },
  async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
    console.log('sou el ctx', ctx)
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
        await fallBack()

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

module.exports = {
  flujoImagen
}

// TODO: SUBIR VARIAS IMAGENES
