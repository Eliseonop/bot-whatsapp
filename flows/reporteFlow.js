const { addKeyword } = require('@bot-whatsapp/bot')

const reporteFlow = addKeyword('AQUIENTRA_SI_PONE_1')
  .addAnswer(
    ['Describe tu error '],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state }) => {
      state.update({
        descripcion: ctx.body
      })
    }
  )
  .addAnswer(
    [
      'Que etiqueta o titulo le pondrias',
      'Ejemplo: Error al obtener periodos...'
    ],
    {
      capture: true
    },
    async (ctx, { flowDynamic, state }) => {
      state.update({
        title: ctx.body
      })

      const myState = state.getMyState()

      console.log(myState)
    }
  )

module.exports = {
  reporteFlow
}
