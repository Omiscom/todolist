const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");

let day = date.getDate();
let time = date.getTime()


const app = express();
app.set("view engine", "ejs");


app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const items = ["buy food", "cook food", "cook food"];
const workItems = [];


app.get("/", function(req, res) {


  res.render("list", {
    listTitle: day,
    newListItems: items,
    time: time
  });
});

app.post("/", function(req, res) {

console.log(req.body);
const  item = req.body.newItem;
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    time: time,
    newListItems: workItems
  })
});
app.get("/about", function(req, res){
  res.render("about", {listTitle: day, time:time});
})

app.listen(3000, function() {
  console.log("the localhost is running on port 3000");
})
