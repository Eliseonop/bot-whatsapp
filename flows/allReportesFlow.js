const { addKeyword } = require('@bot-whatsapp/bot')
require('moment/locale/es')
const { getAllReports } = require('../services/getAllReports')

const allReportesFlow = addKeyword('ALL_REPORTES').addAnswer(
  ['Solicitando Reportes'],
  null,
  async (ctx, { endFlow, fallBack, flowDynamic }) => {
    const data = await getAllReports()

    console.log('soy la data', data)
    const dataReportes = await transformDataToReportsArray(data)

    const listaMensajes = listarMensajes(dataReportes)

    console.log('la lista de los mensajes =>', listaMensajes)

    listaMensajes.forEach(async a => {
      return await flowDynamic(a)
    })
    console.log('los reportes ', dataReportes)
  }
)

function listarMensajes (datos) {
  const lista = []
  datos.forEach(async a => {
    const estadoFinal = traducirEstado(a.currentStatus)
    const mensaje =
      `Reporte *${a.issueKey}*  ` +
      '\n' +
      `Creado:  *${a.createdDate}*  ` +
      '\n' +
      `Titulo:  *${a.summary}*   ` +
      '\n' +
      `Estado:  *${estadoFinal}*`

    lista.push(mensaje)
  })
  return lista
}

function transformDataToReportsArray (data) {
  const reportsToShow = []

  data.values.forEach(report => {
    const reportToShow = {
      issueKey: report.issueKey,
      summary: report.requestFieldValues.find(
        field => field.fieldId === 'summary'
      ).value,
      createdDate: report.createdDate.friendly,
      currentStatus: report.currentStatus.status
    }

    if (
      report.requestFieldValues.find(field => field.fieldId === 'attachment')
        .value.length > 0
    ) {
      reportToShow.attachmentsCount = report.requestFieldValues.find(
        field => field.fieldId === 'attachment'
      ).value.length
    }

    reportsToShow.push(reportToShow)
  })

  return reportsToShow
}

function traducirEstado (estado) {
  const palabras = estado.split(' ')
  const primeraPalabra = palabras[0].toLowerCase()

  const estadoTraducido = {
    pending: 'Pendiente',
    waiting: 'Esperando Soporte'
  }

  return estadoTraducido[primeraPalabra] || estado
}
module.exports = {
  allReportesFlow
}
