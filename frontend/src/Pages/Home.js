import Header from '../Component/Header'
import AddEvents from '../Component/AddEvents'
import Events from '../Component/Events'
import Review from '../Component/Reviews'
import AddReview from '../Component/AddReview'
import Notifications from '../Component/Notifications'
import { Fragment, useEffect, useState } from 'react';
import Axios from "axios"
import { useNavigate } from 'react-router-dom';
import {Tab, Box} from '@mui/material';
import {TabPanel, TabList, TabContext } from '@mui/lab';

import Container from '@mui/material/Container';
import PromoteUser from '../Component/PromoteUser'

export default function Home() {

    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState('0');
    const [titlereview,setTitleReview] = useState('');
    const [showreview,setShowReview] = useState(false);

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [value2, setValue2] = useState('1');

    const handleChange2 = (event, newValue) => {
        setValue2(newValue);
    };

    const [value3, setValue3] = useState('1');

    const handleChange3 = (event, newValue) => {
        setValue3(newValue);
    };

    useEffect(() => {
        if(name==='' && role===''){
        Axios.get("http://localhost:5000/home")
        .then(res => {
            if(res.data.Status === "Success") {
                setAuth(true);
                setName(res.data.name);
                setRole(res.data.role);
            } else {
                setMessage(res.data.message)
            }
        })

        }
    }, [role])

    function setTitle(title) {
        if(showreview && title===titlereview){
            setShowReview(false)
        } else {
            setTitleReview(title);
            setShowReview(true)
        }
    }

    if(auth){return(
        <html>
            <body>
            <Header name = {name} role = {role}/>
            <Fragment>
                <div class="box-container">
                <div class="boxTab">
                <Container>

                <Box sx={{typography: 'body1'}}>
                <TabContext value={value3}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange3} aria-label="lab API tabs example">
                        <Tab label="Notifications"  value="1" sx = {{color: '#FFFFFF'}}/>

                        {(role === 'admin') && (
                            <Tab label="Promote a User" value="2" sx = {{color: '#FFFFFF'}}/>
                        )}
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Notifications name = {name} title = {titlereview}/>
                    </TabPanel>
                    <TabPanel value="2">
                        <PromoteUser name = {name}/>
                    </TabPanel>
                </TabContext>
                </Box>
                    
                </Container>
                </div>

                <div class="boxTabCenter">
                <Container>

                <Box sx={{typography: 'body1'}}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Events" value="1" sx = {{color: '#FFFFFF'}}/>

                        {(role === 'organizer' || role ==='admin') && (
                            <Tab label="Add Events" value="2" sx = {{color: '#FFFFFF'}}/>
                        )}
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Events name = {name} setTitle = {setTitle}/>
                    </TabPanel>
                    <TabPanel value="2">
                        <AddEvents name = {name}/>
                    </TabPanel>
                </TabContext>
                </Box>
                    
                </Container>
                </div>

                {showreview && (
                    <div class="boxTabRight">
                    <Container>

                    <Box sx={{typography: 'body1'}}>
                    <TabContext value={value2}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange2} aria-label="lab API tabs example">
                            <Tab label="Reviews" value="1" sx = {{color: '#FFFFFF'}}/>

                            {disabled && (
                                <Tab label="Add Review" value="2" sx = {{color: '#FFFFFF'}}/>
                            )}
                        </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Review name = {name} title = {titlereview}/>
                        </TabPanel>
                        <TabPanel value="2">
                            <AddReview name = {name} title = {titlereview}/>
                        </TabPanel>
                    </TabContext>
                    </Box>
                        
                    </Container>
                    </div>
                )}
                </div>
            </Fragment>
            </body>
        </html>
    );} else {
        return(
            <div color='white'>{navigate('/login')}</div>
        );
    }
}