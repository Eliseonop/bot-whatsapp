function extraerComentario (data) {
  const comentarios = data.comments.values.map(comment => {
    // const comentarioLimpio = extraerComentarioConImagen(comment.body)
    const regexUno = /([^]*?)\s*\n\n![^\n]*!\s*$/
    const regexDos = /^!([\w.-]+)\|width=(\d+),height=(\d+)!$/
    const match = comment.body.match(regexUno)
    const autor = comment.author.displayName
    if (comment.body.match(regexUno)) {
      const comentario = match[1].trim()
      return {
        comentario,
        autor
      }
    } else if (comment.body.match(regexDos)) {
      return {
        autor,
        comentario: null
      }
    } else {
      return { comentario: comment.body, autor }
    }
  })
  return comentarios.filter(a => a.comentario !== null)
}

module.exports = {
  extraerComentario
}
