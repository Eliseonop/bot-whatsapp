function traducirEstado (estado) {
  const palabras = estado.split(' ')
  const primeraPalabra = palabras[0].toLowerCase()

  const estadoTraducido = {
    pending: 'Pendiente',
    waiting: 'Esperando Soporte'
  }

  return estadoTraducido[primeraPalabra] || estado
}

module.exports = {
  traducirEstado
}
