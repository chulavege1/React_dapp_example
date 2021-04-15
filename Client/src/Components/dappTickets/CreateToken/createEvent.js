import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FormControl, TextField, Button, Tooltip } from '@material-ui/core';
// Route
import { BrowserRouter as Router, useRouteMatch } from "react-router-dom";
const TextFieldM = styled(TextField)`margin: 10px;`
    // Style materialUi \\
import { makeStyles } from '@material-ui/core/styles'
    // Nubmer helper. \\
import moment, { duration } from 'moment'
    // WEB3. \\
import Web3 from 'web3';
let web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/b42ca6aa17b7460bbff8de90e888eaf7");
const ticketFactory = require('~Abi/TicketFactory.json')
/////////////////////////////////////////////////////////////
// ! Owner checker. Type your hash (!!!SMART-CONTRACT-ADRESS!!!)
const ticketFactoryContract = new web3.eth.Contract
    ( ticketFactory.abi, '0x06b02CF48157557d2c3857A182f34694083aB2B9' )
//                      ! Change this key, if want connect to          
//                      ! test-rpc ropsten or mainnet             
/////////////////////////////////////////////////////////////
// Styles 
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiFormControl-root': {
            margin: theme.spacing(1),
            width: 400,
          }
    },
    textField: {
        width: 800,
    },
    }));
    ////////////////////////////////////////////////////////////////
////////////// Event data token creator. \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const CreateEventBar = (time) => {
    const classes = useStyles();
    const timeRegExp = new RegExp(/^([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    const defaultSymbol = 'TICKET'
    // Component state & Date.
    const [EventData, setEventData] = useState
        ({
            title: '',
            description: '',
            imageUrl: '',
            date: moment().unix(),
            duration: 3600, // 1hour
            ticketCost: 1e17, // 0.1 ether
            maxTickets: 999,
            dialog: false,
            symbol: defaultSymbol,
            timeRule: [v => v.match(timeRegExp) != null || 'Invalid time!'],
            maxTicketsRule: [v => v > 0 || 'Invalid amount!']
        })
    useEffect(() => {
        EventData.ticketCost = web3.utils.toWei(EventData.ticketCost.toString()),
        EventData.date = moment().unix()
    }, );
////
//     Data inputs saver.     
    const handleChanger = e => {
        const { name, value } = e.target;
        setEventData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const date = async () => {
        return EventData.date = moment(EventData.date * 1000).toISOString().substr(0, 10)
    }
    // const duration = async (time) => {
    //     return EventData.duration = moment.utc(EventData.duration * 1000).format('H:mm')
    // }
    const ticketCost = async () => {
        return (
            EventData.ticketCost = web3.utils.fromWei(EventData.ticketCost.toString(), 'ether')
        )
    }
    // duration()
    ticketCost()
    date()
////
// Click = Save all given inputs data & create transaction.
    const createEvent = async () => {
        let { title, description, imageUrl, symbol, ticketCost, date, duration, maxTickets } = EventData;
        console.log(title, description, imageUrl, symbol, ticketCost, date, duration, maxTickets)
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        const result = await ticketFactoryContract.methods
            .setEventData(title, description, imageUrl, symbol, 
                        ticketCost, date, duration, maxTickets)
            .send({ from: account })
        console.log(result)
      }
      
    // Components view UI.
    return (
        <Container>
            <FormControl className={classes.root} onSubmit={createEvent}>
                <div style={{display: 'flex', gridGap: '10px'}}>
                    <Flex>
                        <TextFieldM 
                            label="Title"
                            variant="outlined"
                            value={EventData.title}
                            type='text'
                            onChange={handleChanger}
                            name='title'
                        />
                        <TextFieldM 
                            label="Description"
                            variant="outlined"
                            value={EventData.description}
                            type='text'
                            onChange={handleChanger}
                            name='description'
                        />
                        <Tooltip title='Example - https://someWebsiteUrl.jpg' arrow>
                            <TextFieldM 
                                label="Image URL"
                                variant="outlined"
                                value={EventData.imageUrl}
                                type='text'
                                onChange={handleChanger}
                                name='imageUrl'
                            />
                        </Tooltip>
                        <TextFieldM 
                            label="Max Tickets"
                            value={EventData.maxTickets}
                            type='text'
                            onChange={handleChanger}
                            name='maxTickets'
                        />
                        <TextFieldM
                            label="Ticket cost"
                            variant="outlined"
                            value={EventData.ticketCost}
                            onChange={handleChanger}
                            name='ticketCost'
                        />
                        <TextFieldM 
                            label="Ticket Symbol"
                            variant="outlined"
                            value={EventData.symbol}
                            type='text'
                            onChange={handleChanger}
                            name='symbol'
                        />
                        <TextField
                            id="datetime-local"
                            name='date'
                            label="Next appointment"
                            type="datetime-local"
                            onChange={handleChanger}
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextFieldM 
                            label="Duration"
                            value={EventData.duration}
                            type='text'
                            onChange={handleChanger}
                            name='duration'
                            pattern={EventData.timeRule}
                        />
                        <Button variant="contained" color="primary" onClick={createEvent} type='submit'>Create</Button>
                        <Button variant="contained" color="primary" onClick={createEvent} type='submit'>Create</Button>
                    </Flex>
                </div>
            </FormControl>
        </Container>
    )
}

const Container = styled.div `height: 100vh; width: 100%; background: rgba(255, 255, 255, .2);
    display: flex; justify-content: center; align-items: center; padding: 40px 0 0 0`
const Flex = styled.div`display: flex; flex-direction: column; grid-gap: 10px; 
    height: 100vh; width: 100%; padding: 20px 0;`

export default CreateEventBar
