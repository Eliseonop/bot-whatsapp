const { addKeyword } = require('@bot-whatsapp/bot')
require('moment/locale/es')
const { getAllReports } = require('../../services/getAllReports')
// const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { verifyUser } = require('../../utils/verifyUser')
const { traducirEstado } = require('../consultaReporte/utils/traducirEstado')
const { transformDataToReportsArray } = require('./utils/transFormData')

const regexCerrados = /^[Cc][Ee][Rr][Rr][Aa][Dd][Oo][Ss]$/

const allCerradosFlow = addKeyword(`${regexCerrados}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic)
  })

  .addAnswer(
    ['Solicitando Reportes Cerrados'],
    null,
    async (ctx, { endFlow, fallBack, flowDynamic }) => {
      try {
        const data = await getAllReports('CLOSED_REQUESTS', 5)
        await flowDynamic('Los ultimos 5 cerrados fueron')

        console.log('soy la data', data)
        const dataReportes = await transformDataToReportsArray(data)

        const listaMensajes = listarMensajes(dataReportes)

        // console.log('la lista de los mensajes =>', listaMensajes)

        if (listaMensajes.length > 0) {
          listaMensajes.forEach(async a => {
            return await flowDynamic(a)
          })
        } else {
          await flowDynamic('No hay reportes disponibles')
        }
      } catch (error) {
        console.log('Error en el flow de Cerrados: reportes')
        console.log('MEnsaje', error)
      }

      // return await endFlow('Gracias por usar nuestros Servicios')
    }
  )

function listarMensajes (datos) {
  const lista = []
  datos.forEach(async a => {
    const estadoFinal = traducirEstado(a.currentStatus)
    // console.log('soy el curren status', a.currentStatus.statusDate)
    const mensaje =
      `Reporte *${a.issueKey}*  ` +
      '\n' +
      `Creado:  *${a.createdDate}*  ` +
      '\n' +
      `Titulo:  *${a.summary}*   ` +
      '\n' +
      `Estado:  *${estadoFinal}* el ${a.createdDate}`

    lista.push(mensaje)
  })
  return lista
}

module.exports = {
  allCerradosFlow, regexCerrados
}
