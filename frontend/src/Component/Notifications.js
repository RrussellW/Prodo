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
////////////////notifications
    if(data.name) {
      Axios.post("http://localhost:5000/getnotifications", {
      title: data.title,
      user: user,
  })
  .then(res => {
      if(res.data.status === "Success") {
          setNotifs(res.data.notifications);
          setHasNotif(true);
      } else if(res.data.status === "No Requests"){
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
            {hasrequest && (requests.map((request, index) => {
              return (
                <Card key={index} sx={{ backgroundColor: '#323232', color: 'white', margin: '5px'}}>
                  
                    {request.user !== data.name && (<CardContent >
                        <Typography variant="body1" color="#9AA8FF">{request.user} wants to participate in {request.title}</Typography>
                      </CardContent>
                      )
                    }

                    {request.user !== data.name && (<CardActions sx={{padding: '20px'}}>
                        
                        <Fab variant="extended" sx={{backgroundColor: '#FDFFC3'}} aria-label="edit" size='small' onClick={() => acceptRequest(request.title,request.user)}>
                        <AddReaction />Accept
                        </Fab>

                        <Fab variant="extended" sx={{backgroundColor: '#FF8282'}} aria-label="edit" size='small' onClick={() => rejectRequest(request.title,request.user)}>
                         Decline
                        </Fab>
                    </CardActions>
                      )
                    }
                
                </Card>
              );
            }))}
            {!hasrequest && (
              <Card sx={{ backgroundColor: '#323232', color: 'white'}}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{color: '#FDFFC3'}}>No Requests Yet</Typography>
                </CardContent>
              </Card>
            )
          }


            {hasnotif && (notifs.map((notif, index) => {
              return (
                <Card key={index} sx={{ backgroundColor: '#323232', color: 'white', margin: '5px'}}>
                  
                    <CardContent >
                        <Typography variant="h1" color="#9AA8FF">{notif.title}</Typography>
                        <Typography variant="body1" color="#9AA8FF">{notif.message}</Typography>
                      </CardContent>

                    <CardActions sx={{padding: '20px'}}>
                        
                        <Fab variant="extended" sx={{backgroundColor: '#FDFFC3'}} aria-label="edit" size='small' >
                        <AddReaction />Accept
                        </Fab>

                        <Fab variant="extended" sx={{backgroundColor: '#FF8282'}} aria-label="edit" size='small' >
                         Decline
                        </Fab>
                    </CardActions>
                
                </Card>
              );
            }))}
        </Box>
      </AppBar>
)};
