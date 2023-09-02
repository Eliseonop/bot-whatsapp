const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../utils/usuarios')

let intentos = 0

const inicioFlow = addKeyword('tcontur', {
  sensitive: true
})
  .addAnswer(
    [
      '🙌 Sistema de reportes de Errores de Tcontur 🙌',
      '🧐* Verificando numero...*'
    ],
    {
      delay: 2500
    },
    async (ctx, { flowDynamic, state, endFlow }) => {
      console.log(ctx)
      const usuario = verificarNumeroEnArray(+ctx.from)
      if (usuario !== null) {
        console.log('el usuario si tiene permisos ')
        await flowDynamic(`Bienvenido ${usuario.name}`)
      } else {
        await flowDynamic('El Usuario no tiene permisos')
        return endFlow('Adios')
      }
    }
  )
  .addAnswer(
    [
      'Seleccione una opcion escribiendo el numero',
      '*[1] Reportar un error*',
      '*[2] Ver estado de un reporte*'
    ],
    {
      delay: 2500,
      capture: true
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
      switch (ctx.body) {
        case '1':
          console.log('soy la opcion 1')
          break

        case '2':
          console.log(' soy la opcion 2')
          break
        default:
          intentos++

          console.log(intentos)
          await flowDynamic(['Opcion incorrecta , porfavor intente de nuevo'])
          return fallBack()
      }
    }
  )

module.exports = {
  inicioFlow
}
