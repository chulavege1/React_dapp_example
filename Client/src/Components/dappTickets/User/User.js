import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// Web3
import Web3 from 'web3'
let web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b42ca6aa17b7460bbff8de90e888eaf7")
const ticketFactory = require('~Abi/TicketFactory.json')
const ticketOffice = require('~Abi/TicketOffice.json')
const ticketFactoryContract = new web3.eth.Contract(
  ticketFactory.abi,
  '0xCDf544e0767eC4C17fd00fC03DfBCe76DF74b657'
)
import moment from 'moment'
//
const User = () => {
// Initial state for user.
const [userInit, setUserInit] = useState({
    loaded: {
        balance: false,
        totalSupply: false
    },
    myTickets: 0,
    ticketsSold: 0
})
// Event state.
const [Event, setEvent] = useState([])
console.log(Event)
// UseEffect.
useEffect(() => {
    getEvents()
    }, [])
// Get all events.
    const getEvents = async () => {
        const eventsCount = await ticketFactoryContract.methods.countEvents().call()
        for (let i = 0; i < eventsCount; i++) {
            const event = (await ticketFactoryContract.methods.eventsList(i).call())
            // save Events obj to state.
            setEvent(events => [...events, event])
          }
      }
// return User ivents cards + buy this cards.
const renderObject = () => {
    return Object.entries(Event).map(([key, value], i) => {
        // Buy ticket.
        const buyTicket = async () => {
            
            const user = await web3.eth.getAccounts()

            const ticketOfficeContract = new web3.eth.Contract(
                ticketOffice.abi,
                value.[0]
            )
            ticketOfficeContract.methods.mint().send({
                from: user.[0],
                value: value.[5]
            })
            .on('transactionHash', function (hash) {
                console.log('setTransactionText', 'Watch your transaction on Etherscan.io')
                console.log('setTransactionUrl', 'https://ropsten.etherscan.io/tx/' + hash)
                console.log('setTransaction', true)
            })
        }
        const sendTicket = async () => {
            const user = await web3.eth.getAccounts()
            const ticketOfficeContract = new web3.eth.Contract(
                ticketOffice.abi,
                value.[0],
            )
            ticketOfficeContract.methods.safeTransferFrom('0x9906903e3Ce4aE0C4317aE2530a47575944b0A20', '0x2aFff045817546868Ae8E4Bda427d2fb90Ec7632', '2')
            .send({ from: user.[0] })
        }

//////////////////////// Get user purchased tickets.
    const getMyTickets = async () => {
        const user = await web3.eth.getAccounts()
        const ticketOfficeContract = new web3.eth.Contract(
            ticketOffice.abi, value.[0]
        )
        return await console.log(ticketOfficeContract.methods.balanceOf(user.[0]).call())
    }
    console.log(getMyTickets())
    const changeOwnerr = async () => {
        const accounts = await window.ethereum.enable()
        const account = accounts[0]
        const result = await ticketFactoryContract.methods
            .changeOwner('0x2aFff045817546868Ae8E4Bda427d2fb90Ec7632')
            .send({ from: account })
        console.log(result)
    }
//////////////////////// 
return (
    <UL key={key}>
        <ListTheme>
            <IMG src={value.[3]}></IMG>
            <ListItem><button onClick={sendTicket}>sendTicket sendTicket</button></ListItem>
            <ListItem><button onClick={getMyTickets}>Get tickets</button></ListItem>
            <ListItem><button onClick={changeOwnerr}>changeOwnerr</button></ListItem>
            <div>
                <ListItem><P>Title - {value.[1]}</P></ListItem>
                <ListItem><P>Description -{value.[2]}</P></ListItem>
                <ListItem><P>Start at - {moment(parseInt(value[6])).format('[Start at] MMMM Do [at] h:mm a')}</P></ListItem>
                <ListItem><P>{moment.utc(value[7] * 1000).format('[Duration] HH:mm')}</P></ListItem>
                <ListItem><P>Tickets left - {value.maxTickets}</P></ListItem>
            </div>
            <LastListItem>
                <Button onClick={buyTicket}>
                    {web3.utils.fromWei(value.[5], 'ether')}Ξ ETH
                </Button> {/* Buy ticket */}
            </LastListItem>
        </ListTheme>
    </UL>
        )
    })
}
    
    return (
        <Container>
            {renderObject()}
        </Container>
    )
}
// Container
const Container = styled.div `
display: flex; flex-wrap: wrap; justify-content: space-around;`
    // UL
const UL      = styled.ul `margin: 0; padding: 0;`
        // List style
const ListTheme = styled.div `background: rgba(0, 0, 0, 0.5); border-radius: 10px;
position: relative; max-width: 600px; height: 440px; width: 100%; min-width: 320px;
display: flex; flex-direction: column; align-items: center;
justify-content: center; border: 4px solid #fff;`
            // Elements token
const ListItem  = styled.li `list-style: none; position: relative;`
const LastListItem = styled.li `list-style: none; position: absolute; bottom: 0; right: 0;`
// IMG
const P = styled.p ` text-align: left; 
    color: #fff; font-weight: 700; background: rgba(0,0,0,0.5);
    padding: 4px;`
const IMG = styled.img `position: absolute; height: 100%; width: 100%;`
const Button = styled.button `font-size: 22px; color: #000; background: #fff; padding: 4px;`

export default User
