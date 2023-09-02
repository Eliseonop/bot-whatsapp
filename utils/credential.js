const usuario = process.env.EMAIL_USER
const apikey = process.env.APIKEY_JIRA

const credential = Buffer.from(usuario + ':' + apikey).toString('base64')

module.exports = {
  credential
}
