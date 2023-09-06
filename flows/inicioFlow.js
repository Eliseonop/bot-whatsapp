const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')
const { reporteFlow } = require('./reporteFlow')
const { estadoFlow } = require('./consultaReporte/estatoFlow')
const { allReportesFlow } = require('./allReportesFlow')

let intentos = 3

const inicioFlow = addKeyword('TCONTUR', {
  sensitive: true
})
  .addAnswer(
    ['🙌 Sistema de Reporte de Errores', '🧐 *Verificando numero...*'],
    null,
    async (ctx, { flowDynamic, state, endFlow }) => {
      const usuario = verificarNumeroEnArray(+ctx.from)
      if (usuario !== null) {
        console.log('el usuario si tiene permisos ')
        state.update({
          usuario
        })

        await flowDynamic(`👋Bienvenido *${usuario.name}*👋`)
      } else {
        await flowDynamic('🤨 El Usuario no tiene permisos')
        return endFlow('Adios')
      }
    }
  )
  .addAnswer(
    [
      'Seleccione una opcion escribiendo el numero',
      '*[1] Reportar un error* 📄',
      '*[2] Ver estado de un reporte* 🔎',
      '*[3] Ver todos los Reportes* 📚 ',
      '*[CANCELAR]* para salir'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
      console.log(ctx)
      if (ctx.body === 'CANCELAR') {
        return endFlow('Te espero pronto')
      }
      switch (ctx.body) {
        case '1':
          console.log('soy la opcion 1')
          await gotoFlow(reporteFlow)

          break

        case '2':
          console.log(' soy la opcion 2')
          await gotoFlow(estadoFlow)

          break
        case '3':
          console.log(' soy la opcion 3')
          await gotoFlow(allReportesFlow)

          break
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
  inicioFlow
}
// const estado = state.getMyState()

// console.log('estado:', estado)
