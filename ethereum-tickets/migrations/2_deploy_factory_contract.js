// eslint-disable-next-line no-undef
const Factory = artifacts.require('TicketFactory')

module.exports = function (deployer) {
  deployer.deploy(Factory)
}
