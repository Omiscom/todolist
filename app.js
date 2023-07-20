const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
var _ = require("lodash");


const app = express();
app.set("view engine", "ejs");


app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Setting Up mongoose Databases Using ATLAS
// mongoose.connect("mongodb+srv://omikunleqomorudeen:<password>@nodeapp.a7srovj.mongodb.net/todolistDB")

//Setting Up mongoose Databases Using MONGODB 
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")


const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy Food"
});
const item2 = new Item({
  name: "cook Food"
});
const item3 = new Item({
  name: "eat food"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  // new way
  let foundItems = '';
Item.find({}).then(function (foundItems) {
    if(foundItems.length === 0){
      Item.insertMany(defaultItems).then(function() {
        console.log("Data Inserted Successfully");
      }).catch(function(error) {
        console.log(error)
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
}).catch(function (err) {
  console.log(err);
});
});

app.get("/:customListName", function(req, res) {

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}).then(function(foundList){
    if(!foundList){
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName);
    }else{
      res.render("list", {listTitle: foundList.name, newListItems : foundList.items});
    }
  }).catch(function(err){
      console.log(err)
  });
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}).then((foundList) =>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName)
    }).catch((err) =>{

    })
  }
  
});

app.post("/delete", function(req, res){
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {

    Item.findByIdAndRemove(checkItemId).then(function(){
      console.log("Successfully deleted data with ID " + checkItemId );
      res.redirect("/")
    }).catch(function(err){
        console.log(err);
    });
  } else {

    List.findOneAndUpdate({name: listName}, {$pull:{items:{_id: checkItemId}}}).then(function(foundList){
        
        res.redirect("/" + listName);

    }).catch((err)=> {
      console.log("err")
    })
  }

 
});

app.get("/about", function(req, res) {
  res.render("about", {
    listTitle: "Today"
  });
});

app.listen(3000, function() {
  console.log("the localhost is running on port 3000");
})
