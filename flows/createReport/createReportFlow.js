const { addKeyword } = require('@bot-whatsapp/bot')
const { createReport } = require('../../services/createReport')
const { temporalAttachment } = require('../../services/tempAttachment')

const createReportFlow = addKeyword('%$#entrnado_createflow', {
  sensitive: true
})
  .addAction(async (ctx, { state, endFlow }) => {
    try {
      const elEstado = state.getMyState()

      // console.log('aqui en el estaod de ', elEstado)

      if (elEstado.imagenes && elEstado.imagenes.length > 0) {
        const respustaImagenJira = await temporalAttachment(elEstado.imagenes)

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
    } catch (error) {
      console.log('Error create Report')
      console.log('Error', error)
    }
  })

  .addAnswer(
    ['⚒ Creando Reporte...'],
    null,
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      // if (ctx.body === 'CANCELAR') {
      //   return endFlow('Solicitud Cancelada')
      // } else if (ctx.body === 'LISTO') {
      // await flowDynamic('Creando Reporte...')

      const elEstado = state.getMyState()

      const titulo = `(${elEstado.usuario?.name}) ${elEstado.title}`

      const idImages = elEstado.idImages ? elEstado.idImages : []

      // console.log('el estado', elEstado)

      const reporteCreado = await createReport(
        elEstado.descripcion,
        titulo,
        idImages
      )

      // console.log('titulo', titulo)
      // console.log('idimages', idImages)
      const partes = extractFields(reporteCreado)

      const mensaje =
        '🎉Usted acaba de crear un nuevo reporte✨' +
        '\n' +
        `🔎IDENTIFICADOR: *${partes.issueKey}*` +
        '\n' +
        `📌ENCABEZADO: *${partes.summary}*`
      await flowDynamic(mensaje)

      return endFlow('😃 Gracias por usar nuestros servicios.')
      // } else {
      //   return fallBack('Necesito una respuesta Valida')
      // }
    }
  )

function extractFields (data) {
  const { issueKey, createdDate, requestFieldValues } = data
  let summary = ''

  // Buscar el valor del campo 'summary' en requestFieldValues
  if (requestFieldValues && requestFieldValues.length > 0) {
    const summaryField = requestFieldValues.find(
      field => field.fieldId === 'summary'
    )

    if (summaryField) {
      summary = summaryField.value
    }
  }

  const result = {
    issueKey,
    createdDate: createdDate.jira, // Usar la fecha de Jira
    summary
  }

  return result
}

module.exports = {
  createReportFlow
}
