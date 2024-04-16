import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Card, CardContent, Toolbar, Fab, CardActions} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews} from '@mui/icons-material';
import Axios from "axios"

export default function Notifications(data) {

  const [message,setMessage] = useState('');
  const [hasrequest, setHasRequest] = useState(false)
  const [upvote, setUpvote] = useState("tertiary");
  const [user, setUser] = useState(data.name);
  const [requests, setRequests] = useState([])
  const [notifs, setNotifs] = useState([])
  const [hasnotif, setHasNotif] = useState(false)
  const [update,setUpdate] = useState("0")
  

  useEffect(() => {
    if(data.name) {
        Axios.post("http://localhost:5000/getrequests", {
        title: data.title,
        user: user,
    })
    .then(res => {
        if(res.data.status === "Pending") {
            setRequests(res.data.requests);
            setHasRequest(true);
        } else if(res.data.status === "No Requests"){
            setHasRequest(false);
        }
    }).catch(error => {
      console.error("Error fetching reviews:", error);
      setMessage("Error fetching reviews.");
    });
    }

    if(data.name) {
      Axios.post("http://localhost:5000/getnotifications", {
      user: data.name,
  })
  .then(res => {
      if(res.data.Status === "Success") {
          setNotifs(res.data.notifications);
          setHasNotif(true);
      } else if(res.data.status === "No notifications found"){
          setHasNotif(false);
      }
  }).catch(error => {
    console.error("Error fetching notifications:", error);
    setMessage("Error fetching notifications.");
  });
  }
}, [data.title,update])

    function acceptRequest(title,name) {
        if(data.name) {
            Axios.post("http://localhost:5000/acceptrequest", {
            title: title,
            name: name,
        })
        .then(res => {
            if(res.data.Status === "Accepted") {
                alert("Accepted request")
                if(update==="0"){
                  setUpdate("1")
                } else {
                  setUpdate("0")
                }
            } else {
                if(update==="0"){
                  setUpdate("1")
                } else {
                  setUpdate("0")
                }

            }
        }).catch(error => {
          console.error("Error accepting:", error);
          setMessage("Error accepting.");
        });
        }
    }

    function rejectRequest(title,name) {
        if(data.name) {
            Axios.post("http://localhost:5000/rejectrequest", {
            title: title,
            name: name,
        })
        .then(res => {
            if(res.data.Status === "Rejected") {
              if(update==="0"){
                setUpdate("1")
              } else {
                setUpdate("0")
              }
            } else {
              if(update==="0"){
                setUpdate("1")
              } else {
                setUpdate("0")
              }

            }
        }).catch(error => {
          console.error("Error accepting:", error);
          setMessage("Error accepting.");
        });
        }
    }

    function isWithinWeek(eventDate) {
      const today = new Date();
      const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
      const eventDateTime = new Date(eventDate).getTime();
    
      return eventDateTime >= firstDayOfWeek.getTime() && eventDateTime <= lastDayOfWeek.getTime();
    }
    

 return (
      <AppBar position="static" sx={{Width: '50%', backgroundColor: 'black', justifyContent: 'center', alignContent: 'center', padding: '5px'}}>
        <Toolbar sx={{backgroundColor: 'Black'}}>
        <Typography variant="h5" color="#9AA8FF">Notifications</Typography>
        </Toolbar>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px', maxWidth: '100%', backgroundColor: 'black', padding: '10px',
          borderRadius: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        '-ms-overflow-style': 'none',
        'scrollbar-color': 'black'}}>
            {hasrequest && (data.role!=='user') && (requests.map((request, index) => {
              return (
                <Card key={index} sx={{ backgroundColor: '#323232', color: 'white', margin: '5px'}}>
                  
                    {request.user !== data.name && (<CardContent >
                        <Typography variant="body1" color="#9AA8FF">{request.user} wants to participate in {request.title}</Typography>
                      </CardContent>
                      )
                    }

                    {request.user !== data.name && (<CardActions sx={{padding: '20px'}}>
                        
                        <Fab variant="extended" sx={{backgroundColor: '#FDFFC3'}} aria-label="edit" size='small' onClick={() => acceptRequest(request.event_id,request.user)}>
                        <AddReaction />Accept
                        </Fab>

                        <Fab variant="extended" sx={{backgroundColor: '#FF8282'}} aria-label="edit" size='small' onClick={() => rejectRequest(request.event_id,request.user)}>
                         Decline
                        </Fab>
                    </CardActions>
                      )
                    }
                
                </Card>
              );
            }))}
            {!hasrequest && (data.role!=='user') && (
              <Card sx={{ backgroundColor: '#323232', color: 'white', marginBottom: '10px'}}>
                <CardContent>
                  <Typography variant="body1" sx={{color: '#FDFFC3'}}>No Event Requests Yet</Typography>
                </CardContent>
              </Card>
            )
          }


            {hasnotif && (notifs.map((notif, index) => {
              const isRejected = notif.status === 'rejected'
              const onGoing = notif.eventstatus
              const dateOptions = { timeZone: 'GMT', month: 'long', day: 'numeric', year: 'numeric' };
              const formattedDate = new Date(notif.date).toLocaleDateString('en-US', { ...dateOptions, timeZone: 'Asia/Manila' });

              const today = new Date();
              const todayFormatted = today.toLocaleDateString('en-US', { ...dateOptions, timeZone: 'Asia/Manila' });
              const isToday = formattedDate === todayFormatted;

              return (
                <Card key={index} sx={{ backgroundColor: '#3C3C3C', color: 'white', margin: '5px'}}>
                  
                    {(onGoing === 1) && isToday && (
                        <CardContent sx={{backgroundColor: 'green'}}>
                          <Typography variant="h6" color="#89FF91">Today</Typography>
                          <Typography variant="subtitle2" color="white">The event {notif.title} is happening today!</Typography>
                        </CardContent>
                      )}

                    {(onGoing === 1) && isWithinWeek && !isToday && (
                            <CardContent sx={{backgroundColor: '#4F4F4F'}}>
                              <Typography variant="h6" color="#89FF91">This Week</Typography>
                              <Typography variant="subtitle2" color="white">The event {notif.title} is happening this week!</Typography>
                            </CardContent>
                          )}
                    {!isRejected && (notif.status !== 'pending') && (
                      <CardContent >
                        {!onGoing && (
                          <Typography variant="subtitle2" color="#FF8282">{notif.message}</Typography>
                        )}

                        {(onGoing === 1) && (
                          <div>
                            <Typography variant="subtitle2" color="#89FF91">{notif.message}</Typography>
                          </div>
                        )}
                        
                      </CardContent>
                    )}
                    
                    {isRejected && (
                      <CardContent >
                        <Typography variant="h6" color="#FF8282">{notif.title}</Typography>
                        <Typography variant="subtitle2" color="#FF8282" >Your request to participate in the event {notif.title} has been rejected</Typography>
                      </CardContent>
                    )}

                    {/*<CardActions sx={{padding: '20px'}}>
                        
                        <Fab variant="extended" sx={{backgroundColor: '#FDFFC3'}} aria-label="edit" size='small' >
                        <AddReaction />Accept
                        </Fab>

                        <Fab variant="extended" sx={{backgroundColor: '#FF8282'}} aria-label="edit" size='small' >
                         Decline
                        </Fab>
                    </CardActions>*/}
                
                </Card>
              );
            }))}

            {!hasnotif && (
              <Card sx={{ backgroundColor: '#323232', color: 'white', marginTop: '10px'}}>
                <CardContent>
                  <Typography variant="body1" sx={{color: '#FDFFC3'}}>No Event Notifications Yet</Typography>
                </CardContent>
              </Card>
            )
          }
        </Box>
      </AppBar>
)};
