const { connect } = require('getstream');
// const knex = require('./../db');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

const mysql = require("mysql2");
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "chat_application"
});

const connectDb = (fullName, username, userId, hashedPassword, phoneNumber)=> {
    
    db.getConnection((err)=>{
        if(err) throw err;
        console.log("Connected!");
    })

    var sql = "CREATE TABLE if not exists User(fullName VARCHAR(100), username VARCHAR(100),userId VARCHAR(100),hashedPassword VARCHAR(300), phoneNumber VARCHAR(100))";

    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("Table Created");
    });

    sql = "";

    var sql = "INSERT INTO User(fullName, username, userId, hashedPassword, phoneNumber) VALUES(?,?,?,?,?)";
    db.query(sql,[fullName, username, userId, hashedPassword, phoneNumber],(err,result)=>{
        if(err) throw err;
        console.log("Inserted Successfully!!")
    })
    sql = "";
}



// this helps us call the environment variable inside our node app
require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const api_id = process.env.STREAM_APP_ID;

// we create signup and login functions and export them. Once we route to that place, these functions will be called
// every controller will contain req and res, req comes from our frontend
const signup = async (req,res)=>{
    try {
        // we req the whole body and get the following parameters from it
        const { fullName, username, password, phoneNumber } = req.body;

        // we create a random hexadecimel crypto string to be used as userid
        const userId = crypto.randomBytes(16).toString('hex');

        // to connect to the server
        const serverClient = connect(api_key, api_secret, api_id);

        // we hash our password, 10 denotes the level of hashing
        const hashedPassword = await bcrypt.hash(password,10);

        // we create a user token id
        const token = serverClient.createUserToken(userId);

        // we check wether the frontend is getting all this info or not
        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber});

        connectDb(fullName, username, userId, hashedPassword, phoneNumber);

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error});
    }
};
const login = async (req,res)=>{
    try {
        const {username, password } = req.body;

        // to connect to the server
        const serverClient = connect(api_key, api_secret, api_id);

        // new instance of stream chat
        const client = StreamChat.getInstance(api_key, api_secret);

        // query all the users from database that match this username
        const { users } = await client.queryUsers({name: username});

        // if no users return error
        if(!users.length){
            return res.status(400).json({message: 'User Not Found'});
        }

        // we decrypt the user password and compare it to the hashed password of the existing user in our database
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if(success){
            res.status(200).json({token, fullName: users[0].fullName, username, userId: users[0].id});
        }
        else{
            res.status(500).json({message: 'Incorrect Password'});
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error});
    }
};


module.exports = {signup, login}