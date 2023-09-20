const { addKeyword } = require('@bot-whatsapp/bot')
require('moment/locale/es')
const { getAllReports } = require('../../services/getAllReports')
// const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { verifyUser } = require('../../utils/verifyUser')
const { traducirEstado } = require('../consultaReporte/utils/traducirEstado')
const { transformDataToReportsArray } = require('./utils/transFormData')

const regexAbiertos = /^[Aa][Bb][Ii][Ee][Rr][Tt][Oo][Ss]$/

const allAbiertosFlow = addKeyword(`${regexAbiertos}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic)
  })

  .addAnswer(
    ['Solicitando Reportes Abiertos'],
    null,
    async (ctx, { endFlow, fallBack, flowDynamic }) => {
      console.log('Estas en el Flow de All Abiertos\n Solicitando reporters')
      try {
        const data = await getAllReports('OPEN_REQUESTS')
        await flowDynamic('Los ultimos 5 con activadad fueron')

        // console.log('soy la data', data)
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
      } catch (error) {
        console.log('Error en el flow de reportes abiertos: reportes')
        console.log('Mensaje', error)
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

module.exports = { allAbiertosFlow, regexAbiertos }
