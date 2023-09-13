const { addKeyword } = require('@bot-whatsapp/bot')
const { temporalAttachment } = require('../../services/tempAttachment')
const { postCommentFile } = require('../../services/postCommentFile')
const { postComment } = require('../../services/postComment')
const createComentFinal =
  addKeyword('#siuuuuuuuedsfd#', { sensitive: true })

    .addAction(async (ctx, { state, endFlow }) => {
      const elEstado = state.getMyState()

      if (elEstado.imagenesComent && elEstado.imagenesComent.length > 0) {
        const respustaImagenJira = await temporalAttachment(elEstado.imagenesComent)

        if (respustaImagenJira.errorMessage) {
          return endFlow('🙄 El Reporte no ha sido encontrado.')
        }

        if (respustaImagenJira.temporaryAttachments) {
          const temporaryAttachmentIds =
            await respustaImagenJira.temporaryAttachments.map(
              ({ temporaryAttachmentId }) => temporaryAttachmentId
            )

          state.update({
            idImages: temporaryAttachmentIds
          })
        }
      }
      console.log(state.getMyState())
    })

    .addAnswer('Agregando comentario..', null, async (ctx, { state, endFlow, flowDynamic }) => {
      const { etiqueta, usuario, comentario, idImages } = state.getMyState()
      console.log(state.getMyState())
      const finalComment = `(${usuario.name}) - ${comentario}`
      let crearComentario
      if (idImages && idImages.length > 0) {
        crearComentario = await postCommentFile(finalComment, etiqueta, idImages)
      } else {
        crearComentario = await postComment(finalComment, etiqueta)
      }
      if (crearComentario?.errorMessage) {
        return endFlow('😱 Error, El Reporte no ha sido encontrado.')
      }
      // console.log('respuesta', crearComentario)
      if (crearComentario.id) {
        await flowDynamic(['✔ Comentario agregado correctamente', `Escribe *VER ${etiqueta}* para ver los comentarios`])
      }
      state.clear()
      return endFlow('Gracias por usar nuestros servicios.')
    })

module.exports = { createComentFinal }
