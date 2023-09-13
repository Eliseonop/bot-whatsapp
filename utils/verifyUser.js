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
  } else {
    await flowDynamic('🤨 El Usuario no tiene permisos')
    return endFlow('Adios')
  }
}

module.exports = { verifyUser }

// funciones para validar usuario
