const requestMarc = jest.fn()
const hasMarc = jest.fn()
const getMarc = jest.fn()
const listGroups = jest.fn()
const buildAndSendSqsMessage = jest.fn()
const detectLanguage = jest.fn()

module.exports = {
  requestMarc,
  hasMarc,
  getMarc,
  listGroups,
  buildAndSendSqsMessage,
  detectLanguage,
}
