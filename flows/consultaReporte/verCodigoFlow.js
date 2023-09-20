const { addKeyword } = require('@bot-whatsapp/bot')
// const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { procesarConComentario } = require('./utils/procesarConComentario')
const { verifyUser } = require('../../utils/verifyUser')
async function handleResponse (ctx, flowDynamic, endFlow, state) {
  try {
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
  } catch (error) {
    console.log('Error ver codigo flow')
    console.log('Error', error)
  }
}

const regexVerCodigo = /^[Vv][Ee][Rr] (\d+)/
const verCodigoFlow = addKeyword(`${regexVerCodigo}`, {
  regex: true
})
  .addAction(async (ctx, { flowDynamic, state, endFlow }) => {
    await verifyUser(ctx, endFlow, flowDynamic)
  })
  .addAnswer(
    '🔎 Buscando reporte...',
    null,
    async (ctx, { state, flowDynamic, endFlow }) => {
      try {
        const texto = ctx.body
        const arrayDePalabras = texto.split(' ')
        state.update({
          codigo: arrayDePalabras[1]
        })

        // const myState = state.getMyState()
        // console.log('soy el my state', myState)
        await handleResponse(ctx, flowDynamic, endFlow, state)
      } catch (error) {
        console.log('Error ver codigo flow 58')
        console.log('Error', error)
      }
    }
  )

module.exports = { verCodigoFlow }
