import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// Web3
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b42ca6aa17b7460bbff8de90e888eaf7");
const ticketFactory = require('~Abi/TicketFactory.json')
const ticketFactoryContract = new web3.eth.Contract(
  ticketFactory.abi,
  '0x06b02CF48157557d2c3857A182f34694083aB2B9'
)
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
// Get all events.
    const getEvents = async () => {
        const eventsCount = await ticketFactoryContract.methods.countEvents().call()
        for (let i = 0; i < eventsCount; i++) {
            const event = (await ticketFactoryContract.methods.eventsList(i).call())
            // save Events obj to state.
            setEvent(events => [...events, event])
          }
      }
//  Effects
      useEffect(() => {
        getEvents()
      }, [])
      console.log(Event)
// return User ivents cards.
const renderObject = () => {
    return Object.entries(Event).map(([key, value], i) => {
        return (
            <UL key={key}>
                <ListTheme>
                    <ListItem>
                        <IMGsIzer><IMG src={value.[3]}></IMG></IMGsIzer>
                    </ListItem>
                    <ListItem><p>{value.[1]}</p></ListItem>
                    <ListItem><p>{value.[2]}</p></ListItem>
                    <ListItem><p>Start at - {value.[6]}</p></ListItem>
                    <ListItem><p>Duration - {value.[7]}</p></ListItem>
                    <ListItem><p>Tickets left - {value.maxTickets}</p></ListItem>
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
const Container = styled.div `color: #000;
    display: grid;`
    // UL
const UL      = styled.ul  `margin: 0; padding: 0;`
        // List style
const ListTheme = styled.div `background: rgba(0, 0, 50, 0.4); margin: 40px 0; width: 100%;`
            // Elements token
const ListItem  = styled.li `list-style: none; display: flex; justify-content: center; `
// IMG
const IMGsIzer = styled.div`width: 500px; height: 500px; 
    display: flex; justify-content: center; alig-items: center;`
const IMG = styled.img`height: 100%; width: 100%;`

export default User
