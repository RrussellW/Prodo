import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Card, CardContent, CardActions, Fab} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews} from '@mui/icons-material';
import Axios from "axios"

export default function Review(data) {

  const [message,setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState("");
  const [upvote, setUpvote] = useState("tertiary");

  useEffect(() => {
    if(data.title) {
        Axios.get("http://localhost:5000/getReviews", {
        title: data.title
    })
    .then(res => {
        if(res.data.Status === "Success") {
            setReviews(res.data.reviews);
        } else {
            setMessage(res.data.message)
        }
    }).catch(error => {
      console.error("Error fetching reviews:", error);
      setMessage("Error fetching reviews.");
    });
    }
}, [])

const getReviews = () => {
    if(data.title) {
        Axios.get("http://localhost:5000/getReviews", {
        title: data.title
    })
    .then(res => {
        if(res.data.Status === "Success") {
            setReviews(res.data.reviews);
        } else {
            setMessage(res.data.message)
        }
    }).catch(error => {
      console.error("Error fetching reviews:", error);
      setMessage("Error fetching reviews.");
    });
    }
}

const addReview = (title,comment) => {
    setUser(data.name);
        Axios.post("http://localhost:5000/addreview", {
            email : user,
            title : title,
            comment : comment
        }).then((res) =>  {
            if(res.data.message === "Success") {
                getReviews();
            } else {

            }
        })
        .catch(err => console.log(err));
    }

 return (
      /*<AppBar position="static" sx={{backgroundColor: '#323232', justifyContent: 'center', alignContent: 'center', padding: '5px', marginLeft: 'auto'}}>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px', maxWidth: '100%', backgroundColor: 'white', padding: '10px',
          borderRadius: '10px',
         '&::-webkit-scrollbar': {
          display: 'none',
        },
        justifyContent: 'center',
        alignItems: 'center',
        '-ms-overflow-style': 'none',
        'scrollbar-color': 'transparent transparent'}}>
            {reviews && (reviews.map((review, index) => {
            
              return (
                <Card key={index} sx={{ backgroundColor: '#323232', color: 'white'}}>
                  <CardContent>
                    <Typography variant="h3" sx={{color: '#FDFFC3'}}>{review.email}</Typography>
                    <Typography variant="subtitle2">Organizer: {review.comment}</Typography>
                  </CardContent>
                </Card>
              );
            }))}
        </Box>
      </AppBar>*/
      <div></div>
)};
