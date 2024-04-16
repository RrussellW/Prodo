import {useState} from "react"
import { Box, Fab, Alert, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Axios from "axios"

export default function AddReview(data) {

  const [title, setTitle] = useState(data.title);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState(data.name);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState("");
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  const addReview = (e) => {
    e.preventDefault();
        Axios.post("http://localhost:5000/addreview", {
            email: email,
            title: title,
            comment: comment,
        }).then((res) =>  {
            if(res.data.message === "Review created") {
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
      <h1>Add Review</h1>
      <Box component="form" noValidate sx={{ marginTop: '20px', flexDirection: 'column' }}>

        <TextField fullWidth id="comment" onClick={() => setShow(false)} onChange={(e) => {setComment(e.target.value);setShow(false)}} label="Review" variant="outlined" sx={{backgroundColor: "white", marginBottom: "10px", marginTop: "10px"}}/>

      </Box>
      <Box sx={{ marginTop: '20px' }}>
        <Fab color="primary" onClick={addReview}>
            <AddIcon />
        </Fab>
      </Box>
      <br />
      {show && (<Alert variant="filled" severity={alert} >{result}</Alert>)}
    </Box>
)};
