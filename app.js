//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _ =require("lodash");


const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nketu06:823560@cluster0.zqm5j.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useUnifiedTopology: true ,useNewUrlParser:true});
const itemsSchema={
  name:String
};
const Item=mongoose.model("item",itemsSchema);

const item1=Item({
  name:"Welcome"
});
const item2=Item({
  name:"Hit + to add in list"
});
const item3=Item({
  name:"<--- Hit This to delete"
});
const defaultItems=[item1,item2,item3]

const listSchema={
  name:String,
  items:[itemsSchema]
}
const List=mongoose.model("List",listSchema);


app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){

    if (foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
        if( err){
          console.log(err);
        }else{
          console.log("Sucessfully added defaultItems");
        }
      })
res.redirect("/")
    }
    res.render("list", {listTitle: "Today", newListItems: foundItems});

  })

});

app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if(!foundList){
      //creat a new list
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save()
      res.redirect("/"+ customListName)
      }else{
      //show a existiong list
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});

      }
    }
  });


})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;

  const item=new Item({
    name:itemName
  });

if (listName=="Today"){
  item.save()
  res.redirect("/")
}else{
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName)
  })
}


});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName=req.body.listName;

  if(listName=="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){

        console.log("deleted");
        res.redirect("/")
      }
      else{
        console.log(err);
      }  })

  }

else{
List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
  if(!err){
    res.redirect("/"+listName);
  }
});

}


})
let port = process.env.PORT;
if(port==null||port==""){
  port=3000;
}


app.listen(port, function() {
  console.log("Server started");
});
