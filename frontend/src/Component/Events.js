import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Card, CardContent, CardActions, Fab} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews} from '@mui/icons-material';
import Axios from "axios"
import Review from '../Component/Reviews'

export default function Events(data) {

  const [message,setMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState("");
  const [upvote, setUpvote] = useState("tertiary");
  const [title, setTitle] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:5000/getevents")
    .then(res => {
        if(res.data.Status === "Success") {
            setEvents(res.data.events);
        } else {
            setMessage(res.data.message)
        }
    }).catch(error => {
      console.error("Error fetching events:", error);
      setMessage("Error fetching events.");
    });
}, [])

 return (
  <html>
      <AppBar position="static" sx={{backgroundColor: '#323232', justifyContent: 'center', alignContent: 'center', padding: '5px'}}>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px', maxWidth: '100%', backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',
         '&::-webkit-scrollbar': {
          display: 'none',
        },
        justifyContent: 'center',
        alignItems: 'center',
        '-ms-overflow-style': 'none',
        'scrollbar-color': 'transparent transparent'}}>
            {events && (events.map((event, index) => {
              // Format the date
              const dateOptions = { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' };
              const formattedDate = new Date(event.date).toLocaleDateString('en-US', dateOptions);

              return (
                <Card key={index} sx={{ marginBottom: '20px', backgroundColor: '#323232', color: 'white'}}>
                  <CardContent>
                    <Typography variant="h3" sx={{color: '#FDFFC3'}}>{event.title}</Typography>
                    <Typography variant="subtitle2">Organizer: {event.organizer}</Typography>
                    <Typography variant="body1">Description: {event.description}</Typography>
                  </CardContent>
                  <CardActions sx={{padding: '20px', justifyContent: 'flex-start'}}>
                  <Fab variant="extended" color="secondary" aria-label="edit" size='small'>
                     <ArrowUpward /> 
                  </Fab>

                  <Fab variant="extended" color="primary" aria-label="edit" size='medium'>
                    JOIN
                    <AddReaction />
                    
                  </Fab>
                  
                  <Fab variant="extended"  color="tertiary" aria-label="edit" size='small' /*onClick={setTitle(event.title)}*/>
                  Reviews <Reviews /> 
                  </Fab>
                  <Typography variant="body2">{formattedDate}</Typography>
                  </CardActions>
                </Card>
              );
            }))}
        </Box>
      </AppBar>
      {title && 
          <Review name = {data.name} title = {title}/>
      }
      </html>

      
)};
