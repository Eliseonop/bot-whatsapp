const { addKeyword } = require('@bot-whatsapp/bot')

const createReportFlow = addKeyword('%$#entrnado_createflow', {
  sensitive: true
}).addAnswer(
  'Creando Reporte..',
  null,
  async (ctx, { flowDynamic, state, fallBack, gotoFlow }) => {
    const elEstado = state.getMyState()
    console.log('soy el estado final', elEstado)
  }
)

module.exports = {
  createReportFlow
}
