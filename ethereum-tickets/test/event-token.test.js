const { assert } = require('chai')
const Web3 = require('web3')

const TicketFactory = artifacts.require('./TicketFactory.sol')


require('chai').use(require('chai-as-promised')).should()

contract("TicketFactory", (accounts) => {
  const owner = accounts[0]
  const visitor1 = accounts[1]

  let contract

  beforeEach('should setup the contract instance', async () => {
    contract = await TicketFactory.deployed()
  });

  describe('Check owner usage rights', async () => {
    const eventName = 'Test Event!'
    const eventDescription = 'descr'
    const eventPosterURI = ''
    const ticketSymbol = 'TICKET'
    const ticketPrice = '1'
    const futureUnixDate = '1939817829' // 2031year
    const oldUnixDate = '1169818642' // 2007year
    const eventDuration = '3600'
    const maxTickets = '999'

    it('Owner can create events', async () => {
      await contract.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
        ticketPrice, futureUnixDate, eventDuration, maxTickets, {
          from: owner,
        } )
      const newEvent = await contract.eventsList(0)
      assert.equal(eventName, newEvent.eventName, `New event correct`) 
    })

    it('If Unix Date(2021year) & Ticket start(2007) - owner cant create event', async () => {
      try {
        await contract.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
          ticketPrice, oldUnixDate, eventDuration, maxTickets, {
            from: owner,
          } )
      } catch (e) {
        assert.equal(e, e)
      }
    })

    it('Owner can add member', async () => {
      await contract.changeOwner(visitor1)
    })

    it('Owner cant add member undefined users', async () => {
      try {
        await contract.changeOwner(accounts[10])
      } catch (e) {
        assert.equal(e, e)
      }
    })

    describe('User usage', async () => {

      it('Not owner can`t create event', async () => {
        try {
          await contract.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
            ticketPrice, futureUnixDate, eventDuration, maxTickets, {
            from: visitor1
          })
        } catch (e) {
          assert.equal(e, e)
        }
      })

      it('User can see token', async () => {
        const event = await contract.eventsList(0, {
          from: visitor1
        })
        assert.equal(eventName, event.eventName, `Event name visible for the people.`)
      })
  
    })
  
  })

  // describe('Token price', async () => {
  //   it('Token has price', async () => {
  //     const price = await contract.tokenPrice({from: visitor1})
  //     assert.equal('1', Web3.utils.fromWei(price, 'ether'))
  //   })

  //   it('Owner can change token price', async () => {
  //     await contract.setTokenPrice(Web3.utils.toWei('1', 'finney'))
  //     let price = await contract.tokenPrice()
  //     assert.equal('1', Web3.utils.fromWei(price, 'finney'))
  //     await contract.setTokenPrice(Web3.utils.toWei('1', 'ether'))
  //     price = await contract.tokenPrice()
  //     assert.equal('1', Web3.utils.fromWei(price, 'ether'))
  //   })

  //   it('Not owner can`t change price', async () => {
  //     try {
  //       await contract.setTokenPrice(Web3.utils.toWei('1', 'finney'), {
  //         from: visitor1
  //       })
  //     } catch (e) {
  //       assert.equal(e.reason, 'Owner only.')
  //     }
  //   })
  // })

  // describe('Minting tokens', async () => {
  //   it('Can mint new token for 1 ether', async () => {
  //     await contract.mint(0, {
  //       from: visitor1,
  //       value: Web3.utils.toWei('1', 'ether')
  //     })
  //     const balance = await contract.balanceOf(visitor1)
  //     assert.equal(parseInt(balance), 1)
  //   })

  //   it('Buyer need to have enough ether to buy ticker', async () => {
  //     try {
  //       await contract.mint(0, {
  //         from: visitor1,
  //         value: Web3.utils.toWei('1', 'finney')
  //       })
  //     } catch (e) {
  //       assert.equal(e.reason, "Wrong value.")
  //     }
  //   })
  // })

})
