const mysql = require("mysql2");
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "prac9"
});

const connectDb = ()=> {
    
    db.getConnection((err)=>{
        if(err) throw err;
        console.log("Connected!");
    })

    
}

const createTable = ()=>{
    var sql = "CREATE TABLE if not exists Students(id int PRIMARY KEY AUTO_INCREMENT, RollNo VARCHAR(10),Name VARCHAR(30), AWP int,MAE int,SE int, Percentage VARCHAR(20))";

    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log("Table Created");
    });

    sql = "";
}

const insertTable = (rollno,name,awp,mae,se,percentage) => {
    var sql = "INSERT INTO Students(RollNo,Name,AWP,MAE,SE,Percentage) VALUES(?,?,?,?,?,?)";
    db.query(sql,[rollno,name,awp,mae,se,percentage],(err,result)=>{
        if(err) throw err;
        console.log("Inserted Successfully!!")
    })
    sql = "";
}

const updateTable = (rollno,name,awp,mae,se,percentage) => {
    var sql = "UPDATE Students SET Name=?,AWP=?,MAE=?,SE=?,Percentage=? WHERE RollNo=?";
    db.query(sql,[name,awp,mae,se,percentage,rollno],(err,result)=>{
        if(err) throw err;
        console.log("Updated Successfully!!")
    })
    sql = "";
}

const deleteTable = (rollno) => {
    var sql = "DELETE FROM Students WHERE RollNo=?";
    db.query(sql,[rollno],(err,result)=>{
        if(err) throw err;
        console.log("Deleted Successfully!!")
    })
    sql = "";
}


module.exports = {connectDb,createTable,insertTable, updateTable, deleteTable}


