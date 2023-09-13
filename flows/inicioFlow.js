const { addKeyword } = require('@bot-whatsapp/bot')
// const { verificarNumeroEnArray } = require('../utils/usuarios')
const { reporteFlow } = require('./createReport/reporteFlow')
const { estadoFlow } = require('./consultaReporte/estatoFlow')
const { allReportesFlow } = require('./allReportes/allReportesFlow')
const { verifyUser } = require('../utils/verifyUser')
const { allAbiertosFlow } = require('./allReportes/allAbiertosFlow')
const { allCerradosFlow } = require('./allReportes/allCerradosFlow')
// const { comentarFlow } = require('./comentar/comentarFlow')

let intentos = 3
const regexMenu = /^[Mm][Ee][nN][Uu]$/
const inicioFlow = addKeyword(`${regexMenu}`, {
  regex: true
})
  .addAction(

    async (ctx, { flowDynamic, state, endFlow }) => {
      await flowDynamic(['🙌 Sistema de Reporte de Errores', '🧐 *Verificando numero...*'])
      await verifyUser(ctx, endFlow, flowDynamic, state, true)
    }
  )
  .addAnswer(
    [
      'Seleccione una opcion escribiendo el numero',
      '*[1] Reportar un error* 📄',
      '*[2] Ver estado de un reporte* 🔎',
      '*[3] Ver todos los Reportes* 📚 ',
      '*[4] Ver Reportes Abiertos* 📚 ',
      '*[5] Ver Reportes Cerrados* 📚 ',
      // '*[6] Comentar un reporte* 📚 ',
      '*[AYUDA] lista de comandos* 📚 ',
      '*[CANCELAR]* para salir'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      if (ctx.body === 'CANCELAR') {
        return endFlow('Te espero pronto')
      }
      switch (ctx.body) {
        case '1':
          await gotoFlow(reporteFlow)

          break

        case '2':
          await gotoFlow(estadoFlow)

          break
        case '3':
          await gotoFlow(allReportesFlow)
          break
        case '4':
          await gotoFlow(allAbiertosFlow)
          break
        case '5':
          await gotoFlow(allCerradosFlow)
          break
          // case '6':

          //   await gotoFlow(comentarFlow)
          // break
        case 'FIN':
          return endFlow('Adios')
        default:
          intentos--
          await flowDynamic(['Opcion incorrecta , porfavor intente de nuevo'])
          if (intentos === 0) {
            await flowDynamic('Intentos saturados')
            return endFlow('Gracias por usar nuestros servicios')
          } else {
            return fallBack()
          }
      }
    }
  )

module.exports = {
  inicioFlow,
  regexMenu
}
// const estado = state.getMyState()

// console.log('estado:', estado)
