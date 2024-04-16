import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Button, Alert} from '@mui/material';
import './Login.css'
import { Link,useNavigate } from 'react-router-dom';
import {useState} from "react"
import Axios from "axios"

export default function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false)
    const [alert, setAlert] = useState("warning")
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    Axios.defaults.withCredentials = true;

    const login = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5000/login", {
            email: email,
            password: password,
        }).then((res) =>  {
            if(res.data.Status === "Success") {
                navigate('/home');
            } else {
                setAlert("warning")
                setShow(true)
                setMessage(res.data.message);
            }
        })
        .catch(err => console.log(err));
    }

    return(
        <html>
        <body>
            <div className='bg'>
                <Box
                    component="form"
                    sx={{
                        borderRadius: '16px',
                        backgroundColor: '#FFFFFF',
                        height: '500px',
                        width: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '50px',
                        marginInline: 'auto',
                        justifyContent: 'center',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <h1>Sign In</h1>
                    {show && (<Alert variant="filled" severity={alert} >{message}</Alert>)}
                    <br />
                    <TextField id="outlined-basic" onClick={() => setShow(false)} onChange={(e) => {setEmail(e.target.value)}} label="Email" variant="outlined" sx={{margin: '5px'}}/>
                    <TextField id="outlined-basic" onClick={() => setShow(false)} onChange={(e) => {setPassword(e.target.value)}} label="Password" variant="outlined" type="password" sx={{marginBottom: '25px'}}/>
                    <Button variant="contained" onClick={login}>
                        Login
                    </Button>
                    <br />
                    <p>
                    <Link to="/registration">Don't Have an Account? Sign Up</Link>
                    </p>
                </Box>
            </div>
        </body>
        </html>
    );
}