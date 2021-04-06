const { assert } = require('chai');
const Web3 = require('web3')

const EventToken = artifacts.require('./EventToken.sol');

require('chai').use(require('chai-as-promised')).should()

contract("EventToken", (accounts) => {
  const owner = accounts[0]
  const visitor1 = accounts[1]
  let contract

  describe("Deployments", async () => {
    it('Deploys successfully', async () => {
      contract = await EventToken.deployed()
      const address = await contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('Has symbol "TICKET"', async () => {
      const ticket = await contract.symbol()
      assert.equal(ticket, 'TICKET')
    })

    it('Has name "Event Ticket"', async () => {
      const name = await contract.name()
      assert.equal(name, 'Event Ticket')
    })

    it('Has owner ' + owner, async () => {
      assert.equal(await contract.owner(), owner)
    })
  })

  describe('Events', async () => {
    const eventName = 'Test Event!'

    it('Owner can create events', async () => {
      await contract.addEvent(eventName)
      const newEvent = await contract.eventsList(0)
      assert.equal(eventName, newEvent.name, `New event name correct`)
    })

    it('Not owner can`t create event', async () => {
      try {
        await contract.addEvent(eventName, {
          from: visitor1
        })
      } catch (e) {
        assert.equal(e.reason, 'Owner only.')
      }
    })

    it('is visible', async () => {
      const event = await contract.eventsList(0, {
        from: visitor1
      })
      assert.equal(eventName, event.name, `Event name visible for the people.`)
    })
  })

  describe('Token price', async () => {
    it('Token has price', async () => {
      const price = await contract.tokenPrice({from: visitor1})
      assert.equal('1', Web3.utils.fromWei(price, 'ether'))
    })

    it('Owner can change token price', async () => {
      await contract.setTokenPrice(Web3.utils.toWei('1', 'finney'))
      let price = await contract.tokenPrice()
      assert.equal('1', Web3.utils.fromWei(price, 'finney'))
      await contract.setTokenPrice(Web3.utils.toWei('1', 'ether'))
      price = await contract.tokenPrice()
      assert.equal('1', Web3.utils.fromWei(price, 'ether'))
    })

    it('Not owner can`t change price', async () => {
      try {
        await contract.setTokenPrice(Web3.utils.toWei('1', 'finney'), {
          from: visitor1
        })
      } catch (e) {
        assert.equal(e.reason, 'Owner only.')
      }
    })
  })

  describe('Minting tokens', async () => {
    it('Can mint new token for 1 ether', async () => {
      await contract.mint(0, {
        from: visitor1,
        value: Web3.utils.toWei('1', 'ether')
      })
      const balance = await contract.balanceOf(visitor1)
      assert.equal(parseInt(balance), 1)
    })

    it('Buyer need to have enough ether to buy ticker', async () => {
      try {
        await contract.mint(0, {
          from: visitor1,
          value: Web3.utils.toWei('1', 'finney')
        })
      } catch (e) {
        assert.equal(e.reason, "Wrong value.")
      }
    })
  })

})
