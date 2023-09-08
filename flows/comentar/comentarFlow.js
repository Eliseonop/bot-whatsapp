const { addKeyword } = require('@bot-whatsapp/bot')
const { verificarNumeroEnArray } = require('../../utils/usuarios')
const { getReporteByCode } = require('../../services/getReporteByCode')
const { procesarConComentario } = require('../consultaReporte/utils/procesarConComentario')
const { postComment } = require('../../services/postComment')

const regexComentar = /^[Cc][Oo][Mm][Ee][Nn][Tt][Aa][Rr] (\d+)/
const comentarFlow = addKeyword(`${regexComentar}`, {
  regex: true
}).addAction(async (ctx, { flowDynamic, state, endFlow }) => {
  const usuario = verificarNumeroEnArray(+ctx.from)
  if (usuario !== null) {
    console.log('el usuario si tiene permisos ')
    await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    const texto = ctx.body
    const arrayDePalabras = texto.split(' ')

    state.update({
      etiqueta: arrayDePalabras[1],
      usuario: usuario.name
    })
    const respuesta = await getReporteByCode(arrayDePalabras[1])

    // console.log('data procesada', procesarConComentario(respuesta))

    if (respuesta.errorMessage) {
      return endFlow('🙄 El Reporte no ha sido encontrado.')
    }

    const dataProcesada = procesarConComentario(respuesta)

    if (dataProcesada) {
      await flowDynamic('🧐 Este es el *Reporte* al cual agregarás un *comentario*...')
      await flowDynamic(`${dataProcesada}`)

    //   return endFlow('Gracias por usar nuestros servicios')
    } else {
      await flowDynamic('🤷‍♂️ No hay comentarios disponibles')
    }
  } else {
    await flowDynamic('🤨 El Usuario no tiene permisos')
    return endFlow('Adios')
  }
}).addAnswer(['❌ Escribe *CANCELAR* para *salir*.', '✍ Dime tu comentario, Por favor'], { capture: true }, async (ctx, { flowDynamic, endFlow, state, fallBack }) => {
  const { etiqueta, usuario } = state.getMyState()

  console.log('etiqueta', etiqueta)
  if (ctx.body.toUpperCase().trim() === 'CANCELAR') {
    return endFlow('😀 Vuelve pronto.')
  }
  if (regexComentar.test(ctx.body)) {
    return fallBack('🤔 No me envies el comando, intentalo de nuevo.')
  }
  //   console.log('comentario', ctx.body)
  const comentario = `(${usuario}) - ${ctx.body}`
  const crearComentario = await postComment(comentario, etiqueta)
  if (crearComentario?.errorMessage) {
    return endFlow('😱 Error, El Reporte no ha sido encontrado.')
  }
  console.log('respuesta', crearComentario)
  if (crearComentario.id) {
    await flowDynamic(['✔ Comentario agregado correctamente', `Escribe *VER ${etiqueta} para ver los comentarios`])
  }

  return endFlow('Gracias por usar nuestros servicios.')
})

module.exports = { comentarFlow }
