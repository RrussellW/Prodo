const express = require("express");
const mysql = require("mysql")
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET"],
        credentials: true

    }
));
app.use(express.json());

app.use(cookieParser());


app.post('/registration', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log('post : registration');
    console.log(email);
    console.log(password);

    con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("User already exists");
                res.json({message: "User already exists"})
            } else {
                con.query("INSERT INTO users (email, password, role) VALUES (?, ?, 'user')", [email, password],
                (err,result) => {
                    if(result) {
                        res.json({message: "Account created"});
                    } else if(err) {
                        res.json({message: "Enter correct registration details"})
                    }
                }
                )
            }
        }
    }
    )
});

app.get("/api", (req, res) => {
    return res.json({message: "This is from the backend"});
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;


    con.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({mesage: "Error Occurred"})
        } else {
            if(result.length > 0) {
                const name = result[0].email;
                const token = jwt.sign({name: name}, "metroevents-token-secret-key", {expiresIn: '1d'});
                res.cookie('token',token);
                res.json({Status: "Success"});
            } else {
                console.log("Wrong username or password");
                res.json({message: "Wrong username or password"})
            }
        }
    }
    )
});

app.post('/addevent', (req, res) => {
    const organizer = req.body.organizer;
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    const location = req.body.location;

    if(organizer == "" || title == "" || description == "" || date == "" || location == "") {
        res.json({message: "Enter correct event details"})
        return(err);
    }

    console.log('post : add event');
    console.log(organizer);
    console.log(title);

    con.query("SELECT * FROM events WHERE title = ?", [title],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("Event already exists");
                res.json({message: "Event already exists"})
            } else {
                con.query("INSERT INTO events (title, description, date, location, status, organizer) VALUES (?, ?, ?, ?, 1, ?)", [title, description, date, location, organizer],
                (err,result) => {
                    if(result) {
                        res.json({message: "Event created"});
                    } else if(err) {
                        console.log(err);
                        res.json({message: "Enter correct event details"})
                    }
                }
                )
            }
        }
    }
    )
});

app.get('/getevents', (req, res) => {

    console.log('post : get event');

    con.query("SELECT * FROM events WHERE status = '1'",
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("Event get");
                return res.json({Status: "Success", events: result})
            } else {
                console.log("No event");
                return res.json({message: "No events"})
            }
        }
    }
    )
});


app.post('/addupvote', (req, res) => {
    const email = req.body.email;
    const title = req.body.title;

    con.query("SELECT * FROM upvotes WHERE user = ? AND event = ?", [email, title],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                con.query("DELETE FROM upvotes WHERE user = ? and event = ?", [email, title],
                (err,result) => {
                    if(result) {
                        res.json({message: "Removed"});
                    } else if(err) {
                        res.json({message: "Failed"})
                    }
                }
                )
            } else {
                con.query("INSERT INTO upvotes (user, event) VALUES (?, ?)", [email, title],
                (err,result) => {
                    if(result) {
                        res.json({message: "Success"});
                    } else if(err) {
                        res.json({message: "Failed"})
                    }
                }
                )
            }
        }
    }
    )
});

app.post('/addreview', (req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    const comment = req.body.comment;

    if(email == "" || title == "" || comment == "") {
        res.json({message: "Enter correct review details"})
        return(err);
    }

    con.query("INSERT INTO reviews WHERE email = ? AND event = ? AND comment = ?", [email, title, comment],
        (err,result) => {
                if(result) {
                    res.json({message: "Review created"});
                } else if(err) {
                    console.log(err);
                    res.json({message: "Error occured"})
                }
            }
        )
});

app.get('/getreviews', (req, res) => {
    const title = req.body.title;

    con.query("SELECT * FROM reviews WHERE event = ?",[title],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("Reviews get");
                return res.json({Status: "Success", reviews: result})
            } else {
                console.log("No reviews");
                return res.json({message: "No reviews"})
            }
        }
    }
    )
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({message: "Token required. Please Log in"});
    } else {
        jwt.verify(token, "metroevents-token-secret-key", (err, decoded) => {
            if(err) {
                return res.json({message: "Authentication Error"});
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/home',verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name});
})


app.listen(5000, () => {
    console.log('app is running');
});

const con = mysql.createConnection(
    {
        user: "root",
        host: "localhost",
        password: "",
        database: "metroevents",
    }
)
