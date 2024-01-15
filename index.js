const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const username =process.env.MOONGODB_USERNAME;
const password =process.env.MOONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.tppshyd.mongodb.net/registrationFormDB`,
{ useNewUrlParser: true,
 useUnifiedTopology: true,
});

// User schema
const registerationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registeration= mongoose.model('User', registerationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.post("/register",async (req, res) => {
    try{
    const {name ,email,password} =req.body;
    const existingUser = await User.findOne({email : email});
    if(!existingUser){
        const registerationData = new Registeration({
            name,
            email,
            password
        });
      await  registerationData.save();
      res.redirect("/success");
        }
        else{
            console.log("User already exist");
        }
    } 
    catch(error){
        console.log(error);
        res.redirect("error");
    }
    })
    app.get('/success', (req, res) => {
        res.sendFile(__dirname + '/public/success.html');
    })
    app.get('/error', (req, res) => {
        res.sendFile(__dirname + '/public/error.html');
    })
    

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
