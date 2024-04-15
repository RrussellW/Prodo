import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Card, CardContent, CardActions, Fab, Snackbar, Button} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews, RemoveCircle, DoneAll} from '@mui/icons-material';
import Axios from "axios"
import Review from '../Component/Reviews'
import './Events.css'
import { LoadingButton } from '@mui/lab';

export default function Events(data) {

  const [message,setMessage] = useState("Welcome");
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(data.name);
  const [open,setOpen] = useState("false");
  const [status, setStatus] = useState("")
  const [update,setUpdate] = useState(0);

  useEffect(() => {
    Axios.post("http://localhost:5000/getevents", {
      user: user,
  })
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
}, [update])

function updateComponent() {
    const n = update + 1;
    setUpdate(n)
}

function handleOpen(message) {
  if(open){
    handleClose();
  }
  setMessage(message)
  setOpen(true)
}

function handleClose() {
  setOpen(false)
}


function reviewSelect(title){
  data.setTitle(title);
}

function joinEvent(title) {
  setUser(data.name);
      Axios.post("http://localhost:5000/joinevent", {
          event: title,
          user: user,
      }).then((res) =>  {
          if(res.data.message === "Request created") {
            handleOpen("Request Sent")
            updateComponent()
          } else if(res.data.message === "Accepted"){
            handleOpen("Already Participating")
            updateComponent()
          } else {
            handleOpen("Request Pending")
            updateComponent()
          }
      })
      .catch(err => console.log(err));
  }

  function cancelEvent(title) {
        Axios.post("http://localhost:5000/cancelevent", {
            title: title,
        }).then((res) =>  {
            if(res.data.message === "Cancelled") {
              handleOpen("Cancelled event")
              
            } else if(res.data.message === "No such event"){
              handleOpen("Event does not exist")
            } else {
              handleOpen("Error")
            }

            updateComponent()

        })
        .catch(err => console.log(err));
    }

  function checkRequest(title) {
    setUser(data.name);
        Axios.post("http://localhost:5000/checkrequest", {
            event: title,
            user: user,
        }).then((res) =>  {
            if(res.data.message === "No request") {
              setStatus("No request")
            } else if(res.data.message === "Accepted"){
              setStatus("Already Participating")
            } else {
              setStatus("Request Pending")
            }
            handleOpen(status)
        })
        .catch(err => console.log(err));
    }

 return (
  <html>
      <AppBar position="static" sx={{backgroundColor: '#323232'}}>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px', backgroundColor: 'black',
          borderRadius: '10px', paddingTop: '5px',
         '&::-webkit-scrollbar': {
          display: 'none',
        },
        paddingLeft: '10px',
        '-ms-overflow-style': 'none',
        'scrollbar-color': 'transparent transparent'}}>
            {events && (events.map((event, index) => {
              // Format the date
              const dateOptions = { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' };
              const formattedDate = new Date(event.date).toLocaleDateString('en-US', dateOptions);
              const isOrganizer = data.name === event.organizer
              const isNull = event.pstatus === null;
              

              return (
                <Card key={index} sx={{ marginBottom: '10px',marginTop: '5px', marginLeft: '5px', marginRight: '15px', backgroundColor: '#323232', color: 'white'}}>
                  <CardContent>
                    <Typography variant="h3" sx={{color: '#FDFFC3'}}>{event.title}</Typography>
                    <Typography variant="subtitle2">Organizer: {event.organizer}</Typography>
                    <Typography variant="body1">Description: {event.description}</Typography>
                  </CardContent>
                  <CardActions sx={{padding: '20px', justifyContent: 'flex-start', backgroundColor: '#4F4F4F'}}>
                  <Fab variant="extended" color="secondary" aria-label="edit" size='small' onClick={() => handleOpen("Upvoted")}>
                     <ArrowUpward /> 
                  </Fab>

                  {!isOrganizer && !isNull && (event.pstatus === "accepted") && (
                  <Button startIcon={<DoneAll /> } variant="outline" sx={{color:"#89FF91"}} aria-label="edit" size='small' onClick={() => joinEvent(event.title)}>
                  ACCEPTED
                  </Button>
                  )}

                  {!isOrganizer && (event.pstatus !== "accepted") && (
                  <LoadingButton loadingPosition="start" startIcon={<AddReaction />} loading={!isNull} variant="contained" color="success" aria-label="edit" size='medium' onClick={() => joinEvent(event.title)}>
                    {isNull && (<span>JOIN</span>)}
                    {!isNull && (<span>PENDING</span>)}
                  </LoadingButton>
                  )}

                  {isOrganizer && (
                  <Button startIcon={<RemoveCircle />} variant="contained" color="error" aria-label="edit" size='small' onClick={() => cancelEvent(event.title)}>
                    Cancel
                  </Button>
                  )}
                  <Button startIcon={<Reviews /> } variant="contained" color="warning" aria-label="edit" size='small' onClick={() => reviewSelect(event.title)}>
                  Reviews
                  </Button>
                  
                  {(
                    <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      message={message}
                      onClose={() => handleClose()}
                    />
                  )}
                  
                  <Typography variant="body2">{formattedDate}</Typography>
                  </CardActions>
                </Card>
              );
            }))}
        </Box>
      </AppBar>
      
      </html>

      
)};
