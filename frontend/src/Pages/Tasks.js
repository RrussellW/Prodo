import { useState, useEffect, Fragment } from 'react';
import { Box, Typography, AppBar, Card, CardContent, CardActions, Fab, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField, DialogTitle } from '@mui/material';
import { AddReaction, ArrowUpward, Reviews, RemoveCircle, DoneAll, RemoveDone } from '@mui/icons-material';
import Axios from "axios"
import { useLocation } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

export default function Tasks(data) {
    const location = useLocation();
    const email = location.state.email;
  const [message, setMessage] = useState("Welcome");
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState("false");
  const [status, setStatus] = useState("")
  const [update, setUpdate] = useState(0);
  const [showcancel, setShowCancel] = useState(false)
  const [id, setId] = useState('')
  const [noTasks, setNoTasks] = useState(false)

  useEffect(() => {
    Axios.post("http://localhost:3001/api/v1/task/user", {
      email: email,
    })
      .then(res => {
        if (res.data.Status === "Success") {
          setTasks(res.data.tasks);
          setNoTasks(false)
        } else if (res.data.message === "No tasks") {
          setMessage(res.data.message)
          setNoTasks(true)
        } else {
          setMessage(res.data.message)
        }
      }).catch(error => {
        console.error("Error fetching tasks:", error);
        setMessage("Error fetching tasks.");
      });
  }, [update, message])

  function showCancel(n, m) {
    setId(m)
    setShowCancel(n)
  }

  function getTasks() {
    Axios.post("http://localhost:3001/api/v1/task/user", {
      email: email,
    })
      .then(res => {

        if (res.data.Status === "Success") {
          setTasks(res.data.tasks);
          updateComponent();
        } else {
          updateComponent();
          setMessage(res.data.message)
        }
      }).catch(error => {
        console.error("Error fetching tasks:", error);
        setMessage("Error fetching tasks.");
      });
  }

  function updateComponent() {
    const n = update + 1;
    setUpdate(n)
  }

  function handleOpen(message) {
    if (open) {
      handleClose();
    }
    setMessage(message)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }


  function cancelTask(reason) {
    Axios.post("http://localhost:3001/canceltask", {
      taskId: id,
      reason: reason,
    }).then((res) => {
      if (res.data.message === "Cancelled") {
        handleOpen("Cancelled task")
        updateComponent()
      } else if (res.data.message === "No such task") {
        handleOpen("Task does not exist")
        updateComponent()
      } else if (res.data.message === "Error") {
        handleOpen("Error")
        updateComponent()
      }
      data.setShowReview(false)
      getTasks()
      setUpdate(0)

    })
      .catch(err => console.log(err));
  }

  return (
    <html>
      <AppBar position="static" sx={{ backgroundColor: '#323232' }}>
        <Box sx={{
          overflowY: 'auto', maxHeight: '450px', backgroundColor: 'black',
          borderRadius: '10px', paddingTop: '5px',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          paddingLeft: '10px',
          '-ms-overflow-style': 'none',
          'scrollbar-color': 'transparent transparent'
        }}>
          {(!noTasks) && tasks && (tasks.map((task, index) => {
            return (
              <Card key={index} sx={{ marginBottom: '10px', marginTop: '5px', marginLeft: '5px', marginRight: '15px', backgroundColor: '#323232', color: 'white' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ color: '#FDFFC3' }}>{task.name}</Typography>
                  <Typography variant="subtitle2">Category: {task.category}</Typography>
                  <Typography variant="body1">Description: {task.description}</Typography>
                </CardContent>
                <CardActions sx={{ padding: '20px', justifyContent: 'flex-start', backgroundColor: '#4F4F4F' }}>

                  {/* Add your task specific buttons/actions here */}

                  <Typography variant="body2">{task.deadline}</Typography>
                </CardActions>
              </Card>
            );
          }))}

        </Box>
      </AppBar>

    </html>
  );
};
