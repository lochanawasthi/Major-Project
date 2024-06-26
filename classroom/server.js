const express = require("express");
const app = express();

app.get("/",(req,res)=>{
res.send("hii i am root");
}
);

app.listen(3000, ()=>{
    console.log("Server is listenging 3000");
});