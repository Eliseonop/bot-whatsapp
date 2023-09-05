const moment = require('moment')

function parseAndFormatJiraDate (jiraDate) {
  const fechaParseada = moment(jiraDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  fechaParseada.locale('es')
  const formatoDeseado = fechaParseada.format(
    'DD [de] MMMM [de] YYYY, HH:mm:ss'
  )
  return formatoDeseado
}

module.exports = { parseAndFormatJiraDate }
