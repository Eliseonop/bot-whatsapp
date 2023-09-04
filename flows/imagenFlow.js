const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const { temporalAttachment } = require('../services/tempAttachment')
const { createReportFlow } = require('./createReportFlow')

const flujoImagen = addKeyword(EVENTS.MEDIA).addAnswer(
  ['Envíame una captura, imagen o foto, por favor.'],
  {
    capture: true
  },
  async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
    console.log('sou el ctx', ctx)
    if (ctx.message.imageMessage) {
      const buffer = await downloadMediaMessage(ctx, 'buffer')
      console.log('si hay imagen', buffer)
      const mimeType = ctx.message.imageMessage?.mimetype

      const respustaImagenJira = await temporalAttachment(buffer, mimeType)

      if (respustaImagenJira.temporaryAttachments) {
        await flowDynamic('Guardando Imagen')
        const temporaryAttachmentIds =
          await respustaImagenJira.temporaryAttachments.map(
            ({ temporaryAttachmentId }) => temporaryAttachmentId
          )
        state.update({
          idImages: temporaryAttachmentIds
        })
        console.log('la respuesta', temporaryAttachmentIds)
        console.log('soy la respuesta')

        await gotoFlow(createReportFlow)
        // TODO: al parecer luego del flow la logica del primer flow sigue,
      }
      console.log(respustaImagenJira)
    } else {
      console.log('No es una imagen')
      await flowDynamic('No es una imagen')
      return fallBack('Te lo volvere a preguntar')
    }
  },
  [createReportFlow]
)

module.exports = {
  flujoImagen
}
