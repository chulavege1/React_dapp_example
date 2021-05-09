const { assert } = require('chai')
const Web3 = require('web3')

const Ganache = require('./helpers/ganache');
const { expectEvent, expectRevert, constants } = require("@openzeppelin/test-helpers");

const TicketFactory = artifacts.require('./TicketFactory.sol');
const TicketOffice = artifacts.require('./TicketOffice');

require('chai').use(require('chai-as-promised')).should()

contract("TicketFactory", (accounts) => {
  const ganache = new Ganache(web3);
  afterEach('revert', ganache.revert);

  const owner = accounts[0]
  const visitor1 = accounts[1]

  let Factory
  let Office

  beforeEach('should setup the Factory instance', async () => {
    Factory = await TicketFactory.deployed(),
    Office = await TicketOffice.new(owner, owner, 'name', 'symnbol', '5', '999', '0')
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
      await Factory.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
        ticketPrice, futureUnixDate, eventDuration, maxTickets, {
          from: owner,
        } )
      const newEvent = await Factory.eventsList(0)
      assert.equal(eventName, newEvent.eventName, `New event correct`) 
    })

    it('If Unix Date(2021year) & Ticket start(2007) - owner cant create event', async () => {
      await expectRevert(
        Factory.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
          ticketPrice, oldUnixDate, eventDuration, maxTickets, {
            from: owner,
          }),
          'Must EventDuration < 0 && StartAt > unixData'
      )
    })

    it('Owner can add member', async () => {
      await Factory.changeOwner(visitor1)
    })

    it('Owner cant add member undefined users', async () => {
      await expectRevert (
        Factory.changeOwner(accounts[10]),
        'undefined'
      )
    })

    it('Owner can change price token', async () => {
      await Factory.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
        ticketPrice, futureUnixDate, eventDuration, maxTickets, {
          from: owner
        } )
      const getTokenHash = await Factory.ticketOffices(0)
      await Factory.Existing(getTokenHash)
      await Factory.setTicketPrice('3', {from: owner})
      const getTicketPrice = await Factory.getTicketPrice()
      assert.equal(getTicketPrice, '3')
    } )

    describe('User usage', async () => {

      it('Not owner can`t create event', async () => {
          await expectRevert (
            Factory.addEvent(eventName, eventDescription, eventPosterURI, ticketSymbol,
              ticketPrice, futureUnixDate, eventDuration, maxTickets, {
              from: visitor1
            }),
            'Owner only'
          ) 
      })

      it('User can see token', async () => {
        const event = await Factory.eventsList(0, {
          from: visitor1
        })
        assert.equal(eventName, event.eventName, `Event name visible for the people.`)
      })
  
    })
  
  })

  // describe('Token price', async () => {
  //   it('Token has price', async () => {
  //     const price = await Factory.tokenPrice({from: visitor1})
  //     assert.equal('1', Web3.utils.fromWei(price, 'ether'))
  //   })

  //   it('Owner can change token price', async () => {
  //     await Factory.setTokenPrice(Web3.utils.toWei('1', 'finney'))
  //     let price = await Factory.tokenPrice()
  //     assert.equal('1', Web3.utils.fromWei(price, 'finney'))
  //     await Factory.setTokenPrice(Web3.utils.toWei('1', 'ether'))
  //     price = await Factory.tokenPrice()
  //     assert.equal('1', Web3.utils.fromWei(price, 'ether'))
  //   })

  //   it('Not owner can`t change price', async () => {
  //     try {
  //       await Factory.setTokenPrice(Web3.utils.toWei('1', 'finney'), {
  //         from: visitor1
  //       })
  //     } catch (e) {
  //       assert.equal(e.reason, 'Owner only.')
  //     }
  //   })
  // })

  // describe('Minting tokens', async () => {
  //   it('Can mint new token for 1 ether', async () => {
  //     await Factory.mint(0, {
  //       from: visitor1,
  //       value: Web3.utils.toWei('1', 'ether')
  //     })
  //     const balance = await Factory.balanceOf(visitor1)
  //     assert.equal(parseInt(balance), 1)
  //   })

  //   it('Buyer need to have enough ether to buy ticker', async () => {
  //     try {
  //       await Factory.mint(0, {
  //         from: visitor1,
  //         value: Web3.utils.toWei('1', 'finney')
  //       })
  //     } catch (e) {
  //       assert.equal(e.reason, "Wrong value.")
  //     }
  //   })
  // })

})
