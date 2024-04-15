import {useState} from "react"
import { Box, Fab, Alert, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Axios from "axios"

export default function PromoteUser() {

  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState("");
  const [result, setResult] = useState("");
    const [user, setUser] = useState("")
    const [role, setRole] = useState("")

  const navigate = useNavigate();

  function promoteUser(name,role){
        Axios.post("http://localhost:5000/promoteuser", {
            user: name,
            role: role,
        }).then((res) =>  {
            if(res.data.status === "Success") {
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
      <h1>Promote User</h1>
      <Box component="form" noValidate sx={{ marginTop: '20px', flexDirection: 'column' }}>

        <TextField fullWidth id="user" onChange={(e) => {setUser(e.target.value);setShow(false)}} label="Type User to Promote" variant="outlined" sx={{backgroundColor: "white", marginBottom: "10px", marginTop: "10px"}}/>

      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Button variant="contained" color="success" onClick={() => promoteUser(user,'organizer')}>
            organizer
        </Button>
        <Button variant="contained" color="warning" onClick={() => promoteUser(user,'admin')}>
            admin
        </Button>
      </Box>
      <br />
      {show && (<Alert variant="filled" severity={alert}>{result}</Alert>)}
    </Box>
)};
