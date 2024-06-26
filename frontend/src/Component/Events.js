import { useState, useEffect, Fragment } from 'react';
import { Box, Typography, AppBar, Card, CardContent, CardActions, Fab, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField, DialogTitle} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews, RemoveCircle, DoneAll, RemoveDone} from '@mui/icons-material';
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
  const [showcancel, setShowCancel] = useState(false)
  const [id,setId] = useState('')
  const [noevents,setNoEvents] = useState(true)

  useEffect(() => {
    Axios.post("http://localhost:5000/getevents", {
      user: user,
  })
    .then(res => {
        if(res.data.Status === "Success") {
            setEvents(res.data.events);
            setNoEvents(false)
        } else if(res.data.message === "No events"){
            setMessage(res.data.message)
            setNoEvents(true)
        } else {
          setMessage(res.data.message)
        }
    }).catch(error => {
      console.error("Error fetching events:", error);
      setMessage("Error fetching events.");
    });
}, [update,message])

function showCancel(n,m) {
  setId(m)
  setShowCancel(n)

}

function getEvent() {
  Axios.post("http://localhost:5000/getevents", {
      user: user,
  })
    .then(res => {
        
        if(res.data.Status === "Success") {
            setEvents(res.data.events);
            updateComponent();
        } else {
            updateComponent();
            setMessage(res.data.message)
        }
    }).catch(error => {
      console.error("Error fetching events:", error);
      setMessage("Error fetching events.");
    });
}

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


function reviewSelect(eventid){
  data.setTitle(eventid);
}

function joinEvent(eventid) {
  setUser(data.name);
      Axios.post("http://localhost:5000/joinevent", {
          eventid: eventid,
          user: user,
      }).then((res) =>  {
          if(res.data.message === "Request created") {
            handleOpen("Request Sent")
            setMessage(res.data.message)
            updateComponent()
          } else if(res.data.message === "Accepted"){
            handleOpen("Already Participating")
            setMessage(res.data.message)
            updateComponent()
          } else {
            handleOpen("Request Pending")
            setMessage(res.data.message)
            updateComponent()
          }
      })
      .catch(err => console.log(err));
  }

  function cancelEvent(reason) {
        Axios.post("http://localhost:5000/cancelevent", {
            eventid: id,
            reason: reason,
        }).then((res) =>  {
            if(res.data.message === "Cancelled") {
              handleOpen("Cancelled event")
              updateComponent()
            } else if(res.data.message === "No such event"){
              handleOpen("Event does not exist")
              updateComponent()
            } else if(res.data.message === "Error"){
              handleOpen("Error")
              updateComponent()
            }
            data.setShowReview(false)
            getEvent()
            setUpdate(0)

        })
        .catch(err => console.log(err));
    }

    function addUpvote(eventid) {
      setUser(data.name);
          Axios.post("http://localhost:5000/addupvote", {
              eventid: eventid,
              user: user,
          }).then((res) =>  {
              if(res.data.status === "Success") {
                handleOpen("Upvoted")
                updateComponent()
              } else if(res.data.status === "Removed"){
                handleOpen("Removed Upvote")
                updateComponent()
              } else {
                handleOpen("Error")
                updateComponent()
              }
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
            {(!noevents) && events && (events.map((event, index) => {
              // Format the date
              const dateOptions = { timeZone: 'GMT', month: 'long', day: 'numeric', year: 'numeric' };
              const formattedDate = new Date(event.date).toLocaleDateString('en-US', { ...dateOptions, timeZone: 'Asia/Manila' });
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
                  <Fab variant="extended" color="secondary" aria-label="edit" size='small' onClick={() => addUpvote(event.event_id)}>
                     <ArrowUpward />
                  </Fab>
                  <Typography variant="body2">{event.upvotes}</Typography>
                  

                  {!isOrganizer && !isNull && (event.pstatus === "accepted") && (
                  <Button startIcon={<DoneAll /> } variant="outline" sx={{color:"#89FF91"}} aria-label="edit" size='small' onClick={() => joinEvent(event.event_id)}>
                  ACCEPTED
                  </Button>
                  )}

                  {!isOrganizer && !isNull && (event.pstatus === "rejected") && (
                  <Button startIcon={<RemoveDone /> } variant="outline" sx={{color:"#FF8282"}} aria-label="edit" size='small' >
                  Rejected
                  </Button>
                  )}

                  {!isOrganizer && (event.pstatus !== "accepted") && (event.pstatus !== "rejected") && (
                  <LoadingButton loadingPosition="start" startIcon={<AddReaction />} loading={!isNull} variant="contained" color="success" aria-label="edit" size='medium' onClick={() => joinEvent(event.event_id)}>
                    {isNull && (<span>JOIN</span>)}
                    {!isNull && (<span>PENDING</span>)}
                  </LoadingButton>
                  )}

                  {(isOrganizer || (data.role==='admin')) && (
                  <Button startIcon={<RemoveCircle />} variant="contained" color="error" aria-label="edit" size='small' onClick={() => showCancel(true,event.event_id)}>
                    Cancel
                  </Button>
                  )}
                  <Button startIcon={<Reviews /> } variant="contained" color="warning" aria-label="edit" size='small' onClick={() => reviewSelect(event.event_id)}>
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
                  <Fragment>
                  <Dialog
                    open={showcancel}
                    onClose={() => showCancel(false,id)}
                    PaperProps={{
                      component: 'form',
                      onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const reason = formJson.reason;
                        cancelEvent(reason)
                        showCancel(false, id);
                      },
                    }}
                  >
                    <DialogTitle>Cancel {event.title}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        You are about to cancel the event {" " + event.title} please input reason to notify participants
                      </DialogContentText>
                      <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="reason"
                        name="reason"
                        label="Input Reason for Cancellation"
                        type="textfield"
                        fullWidth
                        variant="standard"
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => showCancel(false)}>nevermind</Button>
                      <Button variant='contained' type="submit" color='error'>Continue</Button>
                    </DialogActions>
                  </Dialog>
                </Fragment>
                  
                  <Typography variant="body2">{formattedDate}</Typography>
                  </CardActions>
                </Card>
              );
            }))}

            
        </Box>
      </AppBar>
      
      </html>

      
)};
