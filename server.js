var port  = process.env.PORT || 8800,
    dburi = process.env.DBURI || "mongodb://localhost/sort";
var bodyParser = require("body-parser");
var express = require("express");
var app 	= express();
 
var mongoose = require("mongoose"); 
mongoose.connection.openUri(dburi, {useNewUrlParser:  true, useFindAndModify: false});
  

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static( __dirname + "/public"));
app.use(express.static( __dirname + "/views"));

app.set("view engine", "ejs");

var sortSchema  =  new mongoose.Schema({
         dataProps : Array,
         data : {type: Array, "default" :[]}    
});

var sort = mongoose.model("sort",sortSchema);
app.get("/", function(req, res){

		res.sendFile("index.html" , {root : __dirname + "/views"});
			 
});
app.post("/addSort",function(req,res){
	 
	sort.create({dataProps:req.body.prop}, function(err, newsort) {
		if(err){
            console.log(err);
        }
        res.redirect("/sort/"+newsort._id)
	})
	
})
app.get("/api/:sortid/",function(req,res) {
	sort.findById(req.params.sortid,function(err,founded){
		res.json(founded)
	// res.render("sort",{item:founded,sortprop:req.params.sortprop,sortOrder:req.params.sortOrder})
	});
});
app.get("/sort/:sortid/",function(req,res) {
	res.sendFile('sort.html', { root: __dirname + "/views"});
});

app.post("/addObject/:sortid",function(req,res) {
	 
	 sort.findById(req.params.sortid,function(err,founded){
	 founded.data.push(req.body)
	 founded.save()
	 res.status(201).json(founded)
	});
		
})
app.post("/download",function(req,res) {



res.redirect("back")
})
// app.get("/add",function(req,res) {
// 	var id ="5c0ce09833eesdsde6001659b9db"
	
	
// 	 sort.findById(id,function(err,founded){
// for (var i = 0; i < arr.length/founded.dataProps.length; i++) {
// 	 founded.data.push({});
// 	 console.log(founded.data)
// 	}
// 	var count = founded.data.length -arr.length/founded.dataProps.length ;
// for (var j = 0; j < arr.length/founded.dataProps.length; j++) {
// 	for (var i = 0; i < founded.dataProps.length; i++) {
// 		 founded.data[count][founded.dataProps[i]] = arr[j*founded.dataProps.length + i]
// 	} 
// 	count++
// }
//  	founded.save(function(err,saved) {
//  		sort.updateOne({"_id":id},{$set:{data:saved.data}},function(err){if(err){console.log(err);}})
//  	});
// 	}); 
// })
app.get("/edit/:sortid",function(req,res) {
  sort.findById(req.params.sortid,function(err,founded){
	 res.sendFile("editor.html", {root : __dirname + "/views"})
	});

})
app.post("/edit/:sortid/:action",function(req,res) {
	
 if (req.params.action == 0) {
 	 sort.findById(req.params.sortid,function(err,founded){

 	 	if (typeof(req.body.prop) !== "string") {
 	 		for (var i = 0; i < req.body.prop.length; i++) {
 	 			 founded.dataProps.push(req.body.prop[i])
 	 	}}
 	 	else founded.dataProps.push(req.body.prop)
 	  founded.save(function(err,saved) {
 	  	 res.status(201).json(saved)
 	  })
	});
 }
else if (req.params.action == 1) { 

 	 sort.findById(req.params.sortid,function(err,founded){
 		 if (typeof(req.body[founded.dataProps[0]] !== "string")) {
 			for (var i = 0; i < founded.dataProps.length; i++) {
 		  for (var j = 0; j < founded.data.length; j++) {
 		  	founded.data[j][founded.dataProps[i]] = req.body[founded.dataProps[i]][j]
 		  }
 		 } 
 		}
 		else {
 				for (var i = 0; i < founded.dataProps.length; i++) {
 			founded.data[0][founded.dataProps[i]] = req.body.founded.dataProps[i]
  		} 
 		}
 		
 		founded.save(function(err,saved) {
 		sort.updateOne({"_id":req.params.sortid},{$set:{data:saved.data}},function(err){if(err){console.log(err);}})
 		 res.status(201).json(saved)
 	});
 
 })
}
else if(req.params.action == 2){
	sort.findById(req.params.sortid,function(err,founded){
		if (typeof(req.body.prop) !== "string") {
 	 		for (var i = 0; i < req.body.prop.length; i++) {
 	 			for (var j = 0; j < founded.data.length; j++) {
 	 				if (founded.dataProps[i] !== req.body.prop[i]) {
   			 Object.defineProperty(founded.data[j], req.body.prop[i],Object.getOwnPropertyDescriptor(founded.data[j], founded.dataProps[i]));
    delete founded.data[j][founded.dataProps[i]]
}
 	 				// founded.data[j][req.body.prop[i]] = founded.data[j][founded.dataProps[i]];
 	 				// delete founded.data[j][founded.dataProps[i]]
 	 			}
 	 			 founded.dataProps[i] = req.body.prop[i]
 	 	}}
 	 	else{ 
 	 		for (var j = 0; j < founded.data.length; j++) {
 	 			 	 if (founded.dataProps[0] !== req.body.prop) {
   			 Object.defineProperty(founded.data[j], req.body.prop,Object.getOwnPropertyDescriptor(founded.data[j], founded.dataProps[0]));
    delete founded.data[j][founded.dataProps[0]]
}  	 		}
 	
 	 		founded.dataProps[0]=req.body.prop} 
 founded.save(function(err,saved) {
 		sort.updateOne({"_id":req.params.sortid},{$set:{dataProps:saved.dataProps,data:saved.data}},function(err){if(err){console.log(err);}})
 	 res.status(201).json(saved)
 	});
	});
}
 
})
 	
 		

app.get("*", function(req, res){
  res.send("404 URL NOT FOUND");
});
app.listen(port,function(){console.log("Server Started!");});