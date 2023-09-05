const { addKeyword } = require('@bot-whatsapp/bot')
const { createReport } = require('../services/createReport')

const createReportFlow = addKeyword('%$#entrnado_createflow', {
  sensitive: true
}).addAnswer(
  'Creando Reporte..',
  null,
  async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
    const elEstado = state.getMyState()
    const titulo = `(${elEstado.usuario?.name}) ${elEstado.title}`

    const idImages = elEstado.idImages ? elEstado.idImages : []

    const reporteCreado = await createReport(
      elEstado.descripcion,
      titulo,
      idImages
    )
    const partes = extractFields(reporteCreado)

    console.log('soy el objeto extraido', partes)

    console.log('respuesta del reporte creado', reporteCreado)

    await flowDynamic([
      '🎉Usted acaba de crear un nuevo reporte✨',
      `🔎IDENTIFICADOR: *${partes.issueKey}`,
      `📌TITULO: ${partes.summary}`
    ])

    return endFlow('Gracias por usar nuestros servicios')
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
