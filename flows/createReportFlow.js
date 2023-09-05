const { addKeyword } = require('@bot-whatsapp/bot')
const { createReport } = require('../services/createReport')

const createReportFlow = addKeyword('%$#entrnado_createflow', {
  sensitive: true
})
  .addAction(async (ctx, { state }) => {
    const elEstado = state.getMyState()
    if (elEstado.imagenes && elEstado.imagenes.length > 0) {
      console.log('si hay ', elEstado.imagenes)
    }
    console.log('Enviar un mail con el con el numero de la persona:', elEstado)
  })

  .addAnswer(
    [
      'Para cancelar Reporte escribe *CANCELAR*',
      'Para crear Reporte escribe *LISTO* '
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      if (ctx.body === 'CANCELAR') {
        return endFlow('Solicitud Cancelada')
      }
      await flowDynamic('Creando Reporte...')

      const elEstado = state.getMyState()

      const titulo = `(${elEstado.usuario?.name}) ${elEstado.title}`

      const idImages = elEstado.idImages ? elEstado.idImages : []

      const reporteCreado = await createReport(
        elEstado.descripcion,
        titulo,
        idImages
      )
      const partes = extractFields(reporteCreado)

      const mensaje =
        '🎉Usted acaba de crear un nuevo reporte✨' +
        '\n' +
        `🔎IDENTIFICADOR: *${partes.issueKey}` +
        '\n' +
        `📌ENCABEZADO: ${partes.summary}`
      await flowDynamic(mensaje)

      return endFlow('😃 Gracias por usar nuestros servicios.')
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

  // TODO: guardar imagens en un array y al ultimo crear el tempral
  // Crear el objeto resultante
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
