import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Card, CardContent, Toolbar, Fab} from '@mui/material';
import {AddReaction, ArrowUpward, Reviews} from '@mui/icons-material';
import Axios from "axios"

export default function Review(data) {

  const [message,setMessage] = useState('');
  const [hasreview, setHasReview] = useState(false)
  const [reviews, setReviews] = useState([]);
  const [upvote, setUpvote] = useState("tertiary");

  useEffect(() => {
    if(data.title) {
        Axios.post("http://localhost:5000/getReviews", {
        title: data.title,
    })
    .then(res => {
        if(res.data.Status === "Success") {
            setHasReview(true);
            setReviews(res.data.reviews);
        } else {
            setMessage(res.data.message)
            setHasReview(false)
        }
    }).catch(error => {
      console.error("Error fetching reviews:", error);
      setMessage("Error fetching reviews.");
    });
    }
}, [data.title])

 return (
      <AppBar position="static" sx={{Width: '100px', backgroundColor: 'black', justifyContent: 'center', alignContent: 'center', padding: '5px', marginLeft: 'auto'}}>
        <Toolbar sx={{backgroundColor: 'Black'}}>
        <Typography variant="h5" color="#9AA8FF">{data.title} Reviews </Typography>
        </Toolbar>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px', maxWidth: '100%', backgroundColor: 'black', padding: '10px',
          borderRadius: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        '-ms-overflow-style': 'none',
        'scrollbar-color': 'black'}}>
            {hasreview && (reviews.map((review, index) => {
              return (
                <Card key={index} sx={{ backgroundColor: '#323232', color: 'white', margin: '5px'}}>
                  <CardContent >
                    {review.email === data.name &&
                        (<Typography variant="subtitle2" sx={{color: '#FDFFC3'}}>{review.email}</Typography>)
                    }
                    {review.email !== data.name && 
                      (<Typography variant="subtitle2" color="#9AA8FF">{review.email}</Typography>)
                    }
                    <Typography variant="body1">{review.comment}</Typography>
                  </CardContent>
                </Card>
              );
            }))}
            {!hasreview && (
              <Card sx={{ backgroundColor: '#323232', color: 'white'}}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{color: '#FDFFC3'}}>No Reviews Yet</Typography>
                </CardContent>
              </Card>
            )
          }
        </Box>
      </AppBar>
)};
