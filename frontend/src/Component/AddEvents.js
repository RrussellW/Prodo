import {useState} from "react"
import { Box, Fab, Alert, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Axios from "axios"

export default function AddEvents(data) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState(data.name);
  const [show, setShow] = useState("");
  const [alert, setAlert] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  const addEvent = (e) => {
    e.preventDefault();
    setOrganizer(data.name);
        Axios.post("http://localhost:5000/addevent", {
            title: title,
            description: description,
            date: date,
            location: location,
            organizer: organizer
        }).then((res) =>  {
            if(res.data.message === "Event created") {
              setShow(true);
              setAlert("success")
              setResult(res.data.message);
            } else {
              setShow(true);
              setAlert("warning")
              setResult(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

 return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        color: 'white',
        height: '80%',
        maxWidth: '500px',
        maxHeight: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#FFFFFF'
      }}
    >
      <h1>Add Event</h1>
      <Box component="form" noValidate sx={{ marginTop: '20px', flexDirection: 'column' }}>
        <TextField id="title" onChange={(e) => {setTitle(e.target.value);setShow(false)}} label="Title" helperText="What would the event be called?" variant="outlined" sx={{backgroundColor: "white", marginBottom: "10px"}}/>
        
        <TextField fullWidth id="description" onChange={(e) => {setDescription(e.target.value);setShow(false)}} label="Description" variant="outlined" sx={{backgroundColor: "white", marginBottom: "10px"}}/>
        
        <input type="date" id="date" onChange={(e) => {setDate(e.target.value);setShow(false)}} name="date" />

        <TextField fullWidth id="location" onChange={(e) => {setLocation(e.target.value);setShow(false)}} label="Location" variant="outlined" sx={{backgroundColor: "white", marginBottom: "10px", marginTop: "10px"}}/>

      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Fab color="primary" onClick={addEvent}>
            <AddIcon />
        </Fab>
      </Box>
      <br />
      {show && (<Alert variant="filled" severity={alert}>{result}</Alert>)}
    </Box>
)};
