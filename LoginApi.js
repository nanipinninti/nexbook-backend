const NexBook = require('./connection');
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const { username, password, number, email } = req.body;
    console.log(username,password,number,email);
    
    if ( !username || !password || !number || !email ){
        return res.status(400).json({ message: "Enter all fields correctly" });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const query = `INSERT INTO "Users" (name, email, password, number) VALUES ($1, $2, $3, $4)`; // Fixed table name and query syntax
    const values = [username, email, hashedPassword, number];
    try {
        const result = await NexBook.query(query, values);
        return res.status(200).json({ message: "Signup successfull" });
    } catch (error) { 
        console.error("Database error:", error);
        return res.status(400).json({ message: "Server error" });
    }
});

const SECRET_KEY = "Nani_pinninti"
app.post("/signin",async (req,res)=>{
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({message : "Enter all fields"})
    }
    try{
        const query = `select * from "Login" where email = $1`
        const value = [email]
        const result = await NexBook.query(query,value)
        if (result.rowCount > 0){
            const user = result.rows[0]
            const is_match = await bcrypt.compare(password,user.password)
            if (!is_match){
                return res.status(400).json({message : "Password incorrect"})
            }
            const token = jwt.sign(
                {email : user.email},
                SECRET_KEY,
                {expiresIn : "1h"}
            )

            return res.status(200).json({message : "Succesfull",token})
        }
        return res.status(401).json({message : "Email doesn't exist"})
    }catch(error){
        console.error("Database Errror : ",error)
        return res.status(400).json({message : "Servor Error"})
    }

})

const verifyToken = (req,res,next)=>{
    const {token} = req.headers['authorization']
    if (!token){
        return res.status(401).json({message : "No token was found"})
    }
    jwt.verify(token,SECRET_KEY,(err,decoded)=>{
        if (err){
            return res.status(401).json({message : "Invalid token"})
        }
        req.user = decoded
        next()
    }
    )
}

app.get("/show",verifyToken,(req,res)=>{
    return res.status(200).json(req.user)
})
app.listen(5000, () => {
    console.log("Server starts running at 5000");
});
