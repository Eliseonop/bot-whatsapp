const { addKeyword } = require('@bot-whatsapp/bot')

const createReportFlow = addKeyword('%$#entrnado_createflow', {
  sensitive: true
}).addAnswer(
  'Creando Reporte..',
  null,
  async (ctx, { flowDynamic, state, fallBack, gotoFlow, endFlow }) => {
    const elEstado = state.getMyState()
    const titulo = `(${elEstado.usuario?.name}) ${elEstado.title}`

    const idImages = elEstado.idImages ? elEstado.idImages : []

    await flowDynamic([titulo, idImages.join(' '), elEstado.descripcion])

    return endFlow('chao')
  }
)

module.exports = {
  createReportFlow
}
