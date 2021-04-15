import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import CreateEvent from './CreateToken/createEvent'
import User from './User/User'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter,
    useParams,
    useRouteMatch
  } from "react-router-dom"
// Web 3, Abis
import { abi } from '~Abi/TicketFactory.json'
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/b42ca6aa17b7460bbff8de90e888eaf7")
const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'
/////////////////////////////////////////////////////////////
/// ! Change this FACTORY key, if want connect to          //
/// ! test-rpc ropsten - SMART CONTRACT ADRESS!            //
const FACTORY = '0x99CE04064b6555d562423465EeB1D35F574Bed12'
/////////////////////////////////////////////////////////////
// Main fucntion.
const CreateToken = props => {
        const [authenticated, setAuthenticated] = useState(false)
        const [owner, setOwner] = useState(undefined)
        const [adress, setUserAdress] = useState(DEFAULT_ADDRESS)
        // console.log(adress, owner, authenticated)
        // console.log(ticketFactoryContract.methods);

// Set metamask adress & check is owner.
    const setAdress = async () => {
        const ticketFactory = new web3.eth.Contract(abi, FACTORY)
        const user = await web3.eth.getAccounts()
        setUserAdress(user[0])
        const owner = await ticketFactory.methods.owner().call()
        const isOwner = adress.toLowerCase() === owner.toLowerCase()
        setOwner(isOwner)
    }
// Connect to ETH.
    const connect = async () => {
        if (Object.prototype.hasOwnProperty.call(window, 'ethereum')) {
            await window.ethereum.enable()
            setAuthenticated(true)
        }
    }
// Side effects.
    useEffect(() => {
        const { pathname } = location;
        console.log('New path:', pathname);
    }, [location.pathname]);
// Functions enable.
    setAdress()
    connect()
// Client router helpers.
    let { path, url } = useRouteMatch();
//  return web interface.
    return (
        <Container>
            <Router>
            { owner ? <Link to='/addivent'>Create Ivent</Link> : <h1>Hi user :)</h1> }
            <Link style={{color: '#000', marginLeft: '30px'}} to='/'>Back</Link> 
                <Switch>
                    <Route exact path="/"><User /></Route>
                    <Route path="/addivent"><CreateEvent /></Route>
                </Switch>
            </Router>
        </Container>
    )
}
// styled-components
const Container = styled.div`z-index: 6; padding: 10px 0 0 0; background: rgba(255, 166, 185, 0.12);
    transition: all 1s linear; position: relative; border-radius: 20px 20px 20px 20px;` 

export default withRouter(CreateToken)