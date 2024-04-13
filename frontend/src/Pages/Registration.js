import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Login.css'
import { Link } from 'react-router-dom';
import {useState} from "react"
import Axios from "axios"

export default function Registration() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5000/registration", {
            email: email,
            password: password,
        }).then((res) =>  {
            if(res.data.message === "Account created") {
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        })
    }

    return(
        <div>
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
                    <h1>Sign Up</h1>
                    <br />
                    <TextField id="emailText" label="Email" onChange={(e) => {setEmail(e.target.value)}} variant="outlined" sx={{margin: '5px'}}/>
                    <TextField id="passwordText" label="Password" onChange={(e) => {setPassword(e.target.value)}} variant="outlined" type="password" sx={{marginBottom: '25px'}}/>
                    <Button variant="contained" type="submit" onClick={register}>
                        <span>Register</span>
                    </Button>
                    <br />
                    <p>
                        <Link to="/login">Already Have an Account? Sign In</Link>
                    </p>
                </Box>
            </div>
        </body>
        </html>
        </div>
    );
}
