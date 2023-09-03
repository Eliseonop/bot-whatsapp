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
  .addAnswer(
    ['Desea subir una imagen?', '[Si] O [No]', 'Escribe tu respuesta'],
    { capture: true },
    async (ctx, { endFlow, flowDynamic, fallBack }) => {
      const respuesta = ctx?.body.toLowerCase().replace(/\s+/g, '')

      switch (respuesta) {
        case 'si':
          await flowDynamic('Elegiste subir imagen')
          break
        case 'no':
          await flowDynamic('Elegiste No subir imagen imagen')

          break

        default:
          return fallBack('No es una respuesta valida')
      }
    }
  )

module.exports = {
  reporteFlow
}
