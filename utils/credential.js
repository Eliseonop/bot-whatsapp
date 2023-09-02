const usuario = process.env.EMAIL_USER
const password = process.env.APIKEY_JIRA
const credentials = Buffer.from(`${usuario}:${password}`).toString('base64')

module.exports = {
  credentials
}
