function extraerComentario (data) {
  const patronImagen = /!.*?\.(jpg|jpeg|png|gif)\|[^!]*!/g
  const comentarios = data.comments.values.map(comment => {
    const autor = comment.author.displayName
    const create = comment.created.friendly
    const comentario = comment.body
      .replace(patronImagen, '')
      .split('\n\n')[0]
      .trim()

    return { comentario, autor, create }
  })
  return comentarios.filter(a => a.comentario !== '')
}

module.exports = {
  extraerComentario
}
