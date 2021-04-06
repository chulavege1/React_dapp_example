import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// Create event pannel & User pannel.
import CreateEvent from './CreateToken/createEvent'
import User from './User/User'
// Route
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter,
    useRouteMatch
  } from "react-router-dom";
// Web 3 & Adress..
import { abi } from '~Abi/TicketFactory.json'
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/b42ca6aa17b7460bbff8de90e888eaf7");
const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'
/////////////////////////////////////////////////////////////
/// ! Change this FACTORY key, if want connect to          //
/// ! test-rpc ropsten - SMART CONTRACT ADRESS!            //
const FACTORY = '0xD8fa4C622177cF93656804CEE5bAbC4D4ce72298'
/////////////////////////////////////////////////////////////
//                            
const CreateToken = props => {
    // Initial render state hooks
        const [authenticated, setAuthenticated] = useState(false)
        const [owner, setOwner] = useState(undefined)
        const [adress, setUserAdress] = useState(DEFAULT_ADDRESS)
    // console.log(ticketFactoryContract.methods);

// Set metamask adress & check is owner.
    const setAdress = async () => {
        const ticketFactory = new web3.eth.Contract(abi, FACTORY)
        const user = await web3.eth.getAccounts()
        console.log(user)
        setUserAdress(user[0])
        const owner = await ticketFactory.methods.owner().call()
        const isOwner = adress.toLowerCase() === owner.toLowerCase()
        setOwner(isOwner)
    }
// Connect & Update state.
    const connect = async () => {
        if (Object.prototype.hasOwnProperty.call(window, 'ethereum')) {
            await window.ethereum.enable()
            setAuthenticated(true)
        }
    }
    // side effects.
    useEffect(() => {
        const { pathname } = location;
        console.log('New path:', pathname);
    }, [location.pathname]);
    
    setAdress()
    connect()
    
//  return web interface 
    return (
        <Container>
            <Router>
            <Link style={{color: 'rgba(135, 195, 30, 1)', fontSize: '30px', margin: '0 30px'}} to='/' >User</Link>
            { owner ? <Link style={{color: 'rgba(46, 69, 217, 1)', fontSize: '40px'}} to='/addivent'>Create Ivent Component</Link> : <h1>Hi user :)</h1>} 
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