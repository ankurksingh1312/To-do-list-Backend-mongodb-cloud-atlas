//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://ankurksingh1312:Abcdef1@mongodb@cluster0.idn11.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});


const toDoItemsSchema= new mongoose.Schema({
  name:String
});

const ItemRecord=mongoose.model("todoitem",toDoItemsSchema);

const item0= new ItemRecord({
  name: "Welcome to you todo list"
});
const item1= new ItemRecord({
  name: "Hit the + button to add new items"
});
const item2= new ItemRecord({
  name: "<-- Hit this to delete the item"
});
const defaultItems=[item0,item1,item2];





app.get("/", function(req, res) {

  ItemRecord.find({},function(err,result){
    if(result.length===0){
      ItemRecord.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully saved default items");
        }
      });

    }
    res.render("list", {listTitle: "Home", newListItems: result});
  });


});



app.post("/", function(req, res){

  const newFormInputItem = req.body.newItem;
  const newItem=new ItemRecord({
    name: newFormInputItem
  });
  newItem.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedInputID=req.body.checkBoxInput;
  ItemRecord.findByIdAndRemove(checkedInputID,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("successfully deleted checked item");
        res.redirect("/");
      }
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
