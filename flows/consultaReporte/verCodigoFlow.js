const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { procesarConComentario } = require('./utils/procesarConComentario')
async function handleResponse (ctx, flowDynamic, endFlow, state) {
  const elEstado = state.getMyState()
  if (elEstado.codigo) {
    const respuesta = await getReporteByCode(elEstado.codigo)

    // console.log('data procesada', procesarConComentario(respuesta))

    if (respuesta.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }

    const dataProcesada = procesarConComentario(respuesta)

    // await flowDynamic('🧐 Buscando ultimo comentario...')

    if (dataProcesada) {
      await flowDynamic(`${dataProcesada}`)

      return endFlow('Gracias por usar nuestros servicios')
    } else {
      await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
    }
  }
}

const patron = /^[Vv][Ee][Rr] (\d+)/
const verCodigoFlow = addKeyword(`${patron}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')
    console.log(arrayDePalabras[1])
    state.update({
      codigo: arrayDePalabras[1]
    })

    const usuario = verificarNumeroEnArray(+ctx.from)
    if (usuario !== null) {
      console.log('el usuario si tiene permisos ')
      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    } else {
      await flowDynamic('🤨 El Usuario no tiene permisos')
      return endFlow('Adios')
    }
  })
  .addAnswer(
    '🔎 Buscando reporte...',
    null,
    async (ctx, { state, flowDynamic, endFlow }) => {
      await handleResponse(ctx, flowDynamic, endFlow, state)
    }
  )

module.exports = { verCodigoFlow }
