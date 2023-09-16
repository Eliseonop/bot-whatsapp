const { verificarNumeroEnArray } = require('./usuarios')

async function verifyUser (ctx, endFlow, flowDynamic, state, welcom) {
  const usuario = verificarNumeroEnArray(+ctx.from)
  if (usuario !== null) {
    console.log('el usuario si tiene permisos ')
    if (welcom) {
      await flowDynamic([`👋Bienvenido *${usuario.name}*👋`])
    }
    if (state) {
      // console.log('en el state')
      state.update({
        usuario
      })
    }
    console.log(`Si tiene permisos \n Nombre: ${usuario.name}\n Numero : ${ctx.from}\n Mensaje: ${ctx.body} `)
  } else {
    console.log(`No tiene permisos \n Nombre: ${ctx?.verifiedBizName}\n Numero : ${ctx.from}\n Mensaje: ${ctx.body} `)

    await flowDynamic('🤨 El Usuario no tiene permisos')
    return endFlow('Adios')
  }
}

module.exports = { verifyUser }

// funciones para validar usuario
