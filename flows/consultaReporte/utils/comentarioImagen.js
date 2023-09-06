function extraerComentarioConImagen (texto) {
  const regex = /([^]*?)\s*\n\n![^\n]*!\s*$/
  const match = texto.match(regex)

  if (match) {
    const comentario = match[1].trim()
    return comentario
  } else {
    return texto
  }
}

module.exports = {
  extraerComentarioConImagen
}
