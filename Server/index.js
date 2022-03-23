const express = require('express');
const cors = require('cors');

// routes for our sign in 
const authRoutes = require("./routes/auth.js");


// this is an object
const app = express();
const PORT = 5000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID


// allows us to make cross origin requests
app.use(cors());

// this will help us to pass json payloads from front end to back end
app.use(express.json());

// inbuilt in express to recognize the incoming Request Object as strings or arrays 
app.use(express.urlencoded());

// our first route
app.get('/',(req,res)=>{
    res.send('Hello World');
})

// endpoint to get user info to send to twilio
app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.use('/auth',authRoutes)


app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));