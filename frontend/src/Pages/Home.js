import Header from '../Component/Header'
import AddEvents from '../Component/AddEvents'
import Events from '../Component/Events'
import { Fragment, useEffect, useState } from 'react';
import Axios from "axios"
import { useNavigate } from 'react-router-dom';
import {Tab, Box} from '@mui/material';
import {TabPanel, TabList, TabContext } from '@mui/lab';

import Container from '@mui/material/Container';

export default function Home() {

    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState('0');

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        Axios.get("http://localhost:5000/home")
        .then(res => {
            if(res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.name);
            } else {
                setMessage(res.data.message)
            }
        })
    }, [])

    const tabEvent = (e) => {
        
    }

    if(auth){return(
        <html>
            <body>
            <Header name = {name}/>
            <Fragment>
                <Container maxWidth="sm">

                <Box sx={{ width: '100%', typography: 'body1', marginLeft: 'auto', marginRight: 'auto'}}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Events" value="1" sx = {{color: '#FFFFFF'}}/>

                        {disabled && (
                            <Tab label="Add Events" value="2" sx = {{color: '#FFFFFF'}}/>
                        )}
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Events name = {name}/>
                    </TabPanel>
                    <TabPanel value="2">
                        <AddEvents name = {name}/>
                    </TabPanel>
                </TabContext>
                </Box>
                    
                </Container>
            </Fragment>
            </body>
        </html>
        
        
    );} else {
        return(
            <div color='white'>{navigate('/login')}</div>
        );
    }
}