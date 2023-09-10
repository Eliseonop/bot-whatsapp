const { addKeyword } = require('@bot-whatsapp/bot')
require('moment/locale/es')
const { getAllReports } = require('../../services/getAllReports')
const { traducirEstado } = require('../consultaReporte/utils/traducirEstado')
const { transformDataToReportsArray } = require('./utils/transFormData')
const { verifyUser } = require('../../utils/verifyUser')
const regexReportes = /^[Rr][Ee][Pp][Oo][Rr][Tt][Ee][Ss]$/

const allReportesFlow = addKeyword(`${regexReportes}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic)
  })
  .addAnswer(
    ['Solicitando Reportes'],
    null,
    async (ctx, { endFlow, fallBack, flowDynamic }) => {
      const data = await getAllReports('ALL_REQUESTS')
      await flowDynamic('Los ultimos 5 con activadad fueron')
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
      // return await endFlow('Gracias por usar nuestros Servicios')
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

module.exports = {
  allReportesFlow, regexReportes
}
