const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')
const { reporteFlow } = require('./reporteFlow')
const { estadoFlow } = require('./estatoFlow')
const { allReportesFlow } = require('./allReportesFlow')

let intentos = 3

// const flowFin = addKeyword(['FIN'], {
//   sensitive: true
// }).addAnswer(['Adios'], null, (_, { endFlow }) => {
//   return endFlow('Adios')
// })

const inicioFlow = addKeyword('tcontur', {
  sensitive: true
})
  .addAnswer(
    ['🙌 Sistema de Reporte de Errores 🙌', '🧐 *Verificando numero...*'],
    null,
    async (ctx, { flowDynamic, state, endFlow }) => {
      console.log(ctx)
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
      '*[3] Ver todos los Reportes* 📚 '
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
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
