const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
let items=["Buy Food","Cook Food","Eat Food"];
let workItem=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {


let day=date()
  res.render("list", {
    listTitle: day, newListItem:items});
  });
  app.post("/", function(req, res) {
    let item = req.body.newItem;
    if (req.body.list == "work")
    {

      workItem.push(item)
      res.redirect("/work")

    }
else
{
  items.push(item);
  res.redirect("/");
}



});
  app.get("/work",function(req,res){
    res.render("list",{listTitle:"work List",newListItem:workItem});
  })



app.listen(3000, function() {
  console.log("server is up");
})
