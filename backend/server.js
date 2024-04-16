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

    if(email === "" || password === "") {
        console.log("No input");
        return res.json({message: "Fields must not be blank"})
    }

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

app.post('/promoteuser', (req, res) => {
    const { user, role } = req.body;

    if (!user || !role) {
        return res.json({ message: "Please provide user and role" });
    }

    con.query("UPDATE users SET role = ? WHERE email = ?", [role, user],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error occurred while promoting user" });
            } else {
                if (result.affectedRows > 0) {
                    console.log("User promoted successfully");
                    return res.json({ status: "Success" });
                } else {
                    console.log("User not promoted");
                    return res.json({ status: "User not found" });
                }
            }
        }
    );
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

app.post('/getuserrole', (req, res) => {
    const { user } = req.body;

    if (!user) {
        return res.json({ message: "Please provide user" });
    }

    con.query("SELECT role FROM users WHERE email = ?", [user],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error occurred while fetching user role" });
            } else {
                if (result.length > 0) {
                    const role = result[0].role;
                    console.log(role)
                    return res.json({ role: role });
                } else {
                    console.log("No user")
                    return res.json({ message: "User not found" });
                }
            }
        }
    );
});

app.post('/addevent', (req, res) => {
    const organizer = req.body.organizer;
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    const location = req.body.location;

    if (organizer == "" || title == "" || description == "" || date == "" || location == "") {
        res.json({ message: "Enter correct event details" });
        return;
    }

    console.log('post : add event');
    console.log(organizer);
    console.log(title);

    con.query("SELECT * FROM events WHERE title = ? AND status = '1'", [title],
        (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "Error Occurred" });
            } else {
                if (result.length > 0) {
                    console.log("Event already exists");
                    res.json({ message: "Event already exists" });
                } else {
                    con.query("INSERT INTO events (title, description, date, location, status, organizer) VALUES (?, ?, ?, ?, 1, ?)", [title, description, date, location, organizer],
                        (err, result) => {
                            if (result) {
                                con.query("SELECT event_id FROM events WHERE title = ? AND status = '1'", [title], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ message: "Error Occurred" });
                                    } else if (result.length > 0) {
                                        const newid = result[0].event_id;
                                        const message = "You are now a participant in the event " + title;
                                        con.query("INSERT INTO notifications (event, message) VALUES (?, ?)", [newid, message], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                res.json({ message: "Error Occurred" });
                                            } else {
                                                console.log("event id = " + newid);
                                                res.json({ message: "Event created" });
                                            }
                                        });
                                    }
                                });
                            } else if (err) {
                                console.log(err);
                                res.json({ message: "Enter correct event details" });
                            }
                        }
                    );
                }
            }
        }
    );
});

app.post('/cancelevent', (req, res) => {
    const eventid = req.body.eventid;
    const reason = req.body.reason;
    //console.log(title + " TITLE")


    con.query("SELECT * FROM events WHERE event_id = ?", [eventid],
    (err,result) => {
        if(err) {
            console.log(err);
            return res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                const title = result[0].title;
                con.query("UPDATE events SET status ='0' WHERE event_id = ?", [eventid],
                (err,result) => {
                    if(result.affectedRows > 0) {
                        const message = "The event " + title + " has been cancelled. Given reason: (" + reason + ")";
                        con.query("UPDATE notifications SET message = ? WHERE event = ?",[message, eventid]);
                        console.log("notification")
                        console.log("Cancelled Event")
                        return res.json({message: "Cancelled"});
                    } else if(err) {
                        return res.json({message: "Error"})
                    } else {
                        return res.json({message: "Failed"})
                    }
                }
                )
            } else {
                return res.json({message: "No such event"})
            }
        }
    }
    )
});

app.post('/getevents', (req, res) => {
    const user = req.body.user;

    con.query("SELECT e.*, p.status AS pstatus, (SELECT COUNT(*) FROM upvotes WHERE event = e.event_id) AS upvotes FROM events e LEFT JOIN participants p ON e.event_id = p.event AND p.user = ? WHERE e.status = '1'",[user],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                //console.log(result);
                return res.json({Status: "Success", events: result})
            } else {
                console.log("No event");
                return res.json({message: "No events"})
            }
        }
    }
    )
});

app.post('/getaccepted', (req, res) => {
    const user = req.body.user;

    con.query("SELECT e.title, e.date FROM events e INNER JOIN participants p ON e.title = p.event WHERE p.user = ? AND p.status = 'accepted'", [user],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"});
        } else {
            if(result.length > 0) {
                return res.json({Status: "Success", acceptedEvents: result});
            } else {
                console.log("No accepted events");
                return res.json({message: "No accepted events"});
            }
        }
    });
});

app.post('/getnotifications', (req, res) => {
    const user = req.body.user;

    if (!user) {
        return res.json({ message: "Please provide a user" });
    }

    con.query(`SELECT n.*, e.title, e.date, p.status, e.status AS eventstatus FROM notifications n INNER JOIN participants p ON n.event = p.event INNER JOIN events e ON n.event = e.event_id WHERE p.user = ?`, [user],
    (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ message: "Error Occurred" });
        } else {
            if (result.length > 0) {
                console.log("Notifications found");
                return res.json({ Status: "Success", notifications: result });
            } else {
                console.log("No notifications found");
                return res.json({ message: "No notifications found" });
            }
        }
    });
});




app.post('/addupvote', (req, res) => {
    const email = req.body.user;
    const eventid = req.body.eventid;

    con.query("SELECT * FROM upvotes WHERE user = ? AND event = ?", [email, eventid],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                con.query("DELETE FROM upvotes WHERE user = ? and event = ?", [email, eventid],
                (err,result) => {
                    if(result) {
                        return res.json({status: "Removed"});
                    } else if(err) {
                        return res.json({status: "Failed"})
                    }
                }
                )
            } else {
                con.query("INSERT INTO upvotes (user, event) VALUES (?, ?)", [email, eventid],
                (err,result) => {
                    if(result) {
                        return res.json({status: "Success"});
                    } else if(err) {
                        return res.json({status: "Failed"})
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
    console.log(email + " = email")
    console.log(title + " = title")
    console.log(comment + " = comment")

    if(email == "" || title == "" || comment == "") {
        res.json({message: "Enter correct review details"})
        return(err);
    }

    con.query("INSERT INTO reviews (email, event, comment) Values (?, ?, ?)", [email, title, comment],
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

app.post('/getreviews', (req, res) => {
    const title = req.body.title;
    console.log(title);

    con.query("SELECT * FROM reviews WHERE event = ?",[title],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("Reviews get");
                console.log(result)
                return res.json({Status: "Success", reviews: result})
            } else {
                console.log("No reviews");
                return res.json({message: "No reviews"})
            }
        }
    }
    )
});

app.post('/joinevent', (req, res) => {
    const user = req.body.user;
    const eventid = req.body.eventid;

    if(user == "") {
        res.json({message: "Enter correct review details"})
        console.log("Correct Details");
        return(err);
    }

    con.query("SELECT * FROM participants WHERE user = ? AND event = ? AND status = 'accepted'", [user, eventid],
                (err,result) => {
                    if(err) {
                        console.log("Select accepted");
                        console.log(err);
                        return res.json({message: "Error Occurred"})
                    } else {
                        if(result.length > 0) {
                            console.log("Already participating");
                            return res.json({message: "Accepted"})
                        } else {

                            con.query("SELECT * FROM participants WHERE user = ? AND event = ? AND status = 'pending'", [user, eventid],
                            (err,result) => {
                                if(err) {
                                    console.log("Select pending");
                                    console.log(err);
                                    return res.json({message: "Error Occurred"})
                                } else if(result.length > 0) {
                                        console.log("Request already exists");
                                        return res.json({message: "Request already exists"})
                                } else {
                                    con.query("INSERT INTO participants (user, event, status) Values (?, ?, 'pending')", [user, eventid],
                                                        (err,result) => {
                                                                if(result) {
                                                                    return res.json({message: "Request created"});
                                                                } else if(err) {
                                                                    console.log(err);
                                                                    console.log("Insert");
                                                                    return res.json({message: "Error occured"})
                                                                }
                                                            }
                                                        )

                                }
                            }
                            )
                            
                        }
                    }
                }
                )
});

app.post('/checkrequest', (req, res) => {
    const user = req.body.user;
    const event = req.body.event;

    if(event == "" || user == "") {
        res.json({message: "Error occured"})
        return(err);
    }

    con.query("SELECT * FROM participants WHERE user = ? AND event = ? AND status = 'accepted'", [user, event],
                (err,result) => {
                    if(err) {
                        console.log(err);
                        return res.json({message: "Error Occurred"})
                    } else {
                        if(result.length > 0) {
                            console.log("Already participating");
                            return res.json({message: "Accepted"})
                        } else {

                            con.query("SELECT * FROM participants WHERE user = ? AND event = ? AND status = 'pending'", [user, event],
                            (err,result) => {
                                if(err) {
                                    console.log(err);
                                    return res.json({message: "Error Occurred"})
                                } else if(result.length > 0) {
                                        console.log("Request already exists");
                                        return res.json({message: "Request already exists"})
                                } else {
                                        console.log("No request exists");
                                        return res.json({message: "No request"})
                                }
                            }
                            )
                            
                        }
                    }
                }
                )
});

app.post('/getrequests', (req, res) => {
    const organizer = req.body.user;

    con.query("SELECT e.event_id, e.organizer, p.user, p.status, e.title FROM events e INNER JOIN participants p ON e.event_id = p.event WHERE e.organizer = ? AND p.status = 'pending'",[organizer],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.length > 0) {
                console.log("Results")
                return res.json({requests: result, status: 'Pending'})
            } else {
                console.log("No Requests")
                return res.json({status: 'No Requests'})
            }
        }
    }
    )
});

app.post('/acceptrequest', (req, res) => {
    const name = req.body.name;
    const title = req.body.title;

    con.query("UPDATE participants SET status = 'accepted' WHERE user = ? AND event = ?",[name, title],
    (err,result) => {
        if(err) {
            console.log(err);
            res.json({message: "Error Occurred"})
        } else {
            if(result.affectedRows > 0) {
                console.log("Accepted")
                res.json({requests: result})
            } else {
                console.log("Not Accepted")
                res.json({status: 'Not Accepted'})
            }
        }
    }
    )
});

app.post('/rejectrequest', (req, res) => {
    const name = req.body.name;
    const title = req.body.title;

    con.query("UPDATE participants SET status = 'rejected' WHERE user = ? AND event = ?", [name, title], (err, result) => {
        if(err) {
            console.log(err);
            res.json({ message: "Error Occurred" });
        } else {
            if(result.affectedRows > 0) {
                console.log("Rejected");
                res.json({ status: 'Rejected' });
            } else {
                console.log("Not Rejected");
                res.json({ status: 'Not Rejected' });
            }
        }
    });
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
    con.query("SELECT role FROM users WHERE email = ?",[req.name], (err, result) => {
        if(err) {
            console.log(err);
            res.json({ message: "Error Occurred" });
        } else {
            if(result.length > 0) {
                return res.json({Status: "Success", name: req.name, role: result[0].role});
            } else {
                console.log("No Role");
                return res.json({Status: "Failed", name: req.name});
            }
        }
    });
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
