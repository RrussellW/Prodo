import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Container, Grid, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Header from '../Component/Header'
const theme = createTheme();

const TaskCreation = () => {
    const location = useLocation();
    const email = location.state.email;
    const [taskData, setTaskData] = useState({
        category: '',
        color: '',
        deadline: '',
        description: '',
        email: email,
        name: ''
    });

    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/v1/task', taskData);
            console.log(response.data); // Handle success response
        } catch (error) {
            console.error('Error:', error); // Handle error response
        }
    };

    return (
        
        <ThemeProvider theme={theme}>
            <Header email = {email}/>
            <Container>
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <h2>Create Task</h2>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="category"
                                    label="Category"
                                    value={taskData.category}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    value={taskData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="color-select-label">Color</InputLabel>
                                    <Select
                                        labelId="color-select-label"
                                        id="color-select"
                                        name="color"
                                        value={taskData.color}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="red">Red</MenuItem>
                                        <MenuItem value="orange">Orange</MenuItem>
                                        <MenuItem value="yellow">Yellow</MenuItem>
                                        <MenuItem value="green">Green</MenuItem>
                                        <MenuItem value="blue">Blue</MenuItem>
                                        <MenuItem value="purple">Purple</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="deadline"
                                    label="Deadline"
                                    type="date"
                                    value={taskData.deadline}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={taskData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Create Task
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default TaskCreation;
