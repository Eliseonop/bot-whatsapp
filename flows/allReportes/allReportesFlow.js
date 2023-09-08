const { addKeyword } = require('@bot-whatsapp/bot')
require('moment/locale/es')
const { getAllReports } = require('../../services/getAllReports')
const { traducirEstado } = require('../consultaReporte/utils/traducirEstado')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const regexReportes = /^[Rr][Ee][Pp][Oo][Rr][Tt][Ee][Ss]$/

const allReportesFlow = addKeyword(`${regexReportes}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const usuario = verificarNumeroEnArray(+ctx.from)
    if (usuario !== null) {
      console.log('el usuario si tiene permisos ')
      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    } else {
      await flowDynamic('🤨 El Usuario no tiene permisos')
      return endFlow('Adios')
    }
  })
  .addAnswer(
    ['Solicitando Reportes'],
    null,
    async (ctx, { endFlow, fallBack, flowDynamic }) => {
      const data = await getAllReports('ALL_REQUESTS')

      console.log('soy la data', data)
      const dataReportes = await transformDataToReportsArray(data)

      const listaMensajes = listarMensajes(dataReportes)

      console.log('la lista de los mensajes =>', listaMensajes)

      if (listaMensajes.length > 0) {
        listaMensajes.forEach(async a => {
          return await flowDynamic(a)
        })
      } else {
        await flowDynamic('No hay reportes disponibles')
      }
      return endFlow('Gracias por usar nuestros Servicios')
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

module.exports = {
  allReportesFlow, regexReportes
}
