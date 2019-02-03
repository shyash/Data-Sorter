var on = {}
$(document).ready(function(){
 	$.getJSON("/api/"+window.location.pathname.split("").splice(6,24).join(""))
 	.then(function (data) {
 		arrange(data,data.dataProps[0],-1)
 		on.prop = data.dataProps[0]
 		on.order = -1
 	})
 	.catch(function(err) {
 		console.log(err)
 	})
 })
 function is_numeric(str){
    return /^\d+$/.test(str);
}
var itemout
var comp = false
 function arrange(item,sortProp,sortOrder)
 {
 	    	$('#propeditbtn').text("edit name of properties")
   	document.querySelector('#propeditbtn').style.background = "#2196f3"
		$("#propTable").remove()
 		$("#tableDiv").append('<table style="margin-top: 10px;" id="propTable"></table>')
	for (var i = 0; i < item.dataProps.length; i++)
	 {
 		$("#propTable").append('<tr><td><p style="margin-top: 10px;">'+item.dataProps[i]+'</p></td> <td><input type="text" name="'+item.dataProps[i]+'" style="margin-top: 10px;color:#2880ff ;margin-left: 5px;" ></td> </tr>')
 	 }
 		itemout = item
 	if (sortProp == on.prop)
 		{
 		    if (on.order>=0) {
 		    	sortOrder = -1 
 		    	on.order  =  -1
 		    }
 		    else{
 		    	sortOrder = 1
 		    	on.order  = 1 
 		    }
 		}

 	else {
 			on.prop = sortProp
 			on.order = sortOrder
 		 }

    $("tbody").remove()

	$("#comptable").append("<tbody> <tr> <th>S.NO.</th> </tr> </tbody> ")		

  item.data.forEach(function(obj){
		for (var i = 0; i < item.dataProps.length; i++)
		{ 
	 		 if (is_numeric(obj[item.dataProps[i]])) 
	 	 	{ 
	 				obj[item.dataProps[i]] = +obj[item.dataProps[i]]
			}
		}
	})

  	for (var i = 0; i < item.dataProps.length; i++)
  		    {
  		    	$("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">' +item.dataProps[i]+'</th>')
  		 	}
  	var count = 1
		if (sortOrder >=0 ) { item.data.sort(function(a,b){
		return  (a[sortProp] > b[sortProp]) ? 1 : (b[sortProp]  > a[sortProp]) ? -1 : 0
		}).forEach(function(elem)
		{
		   count++
		   document.querySelector("tbody").appendChild(document.createElement('tr'))
		   var sno = count-1
		   $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +sno + "</td>")
		   for (var i = 0; i < item.dataProps.length; i++)
		   {
		   	$("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +elem[item.dataProps[i]] +"</td>")
		   }
	    }
	    )}
 		else
 			{ 
 			 item.data.sort(function(a,b){
	             return  (a[sortProp] < b[sortProp]) ? 1 : (b[sortProp]  < a[sortProp]) ? -1 : 0
	             }).forEach(function(elem)
	    {
		    count++
		    document.querySelector("tbody").appendChild(document.createElement('tr'))
		    var sno = count-1
		    $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +sno + "</td>")
		    for (var i = 0; i < item.dataProps.length; i++) 
		    {
			  $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +elem[item.dataProps[i]] +"</td>")
			}
	    }
	    )}

        var num = 0

		for (var i = 0; i < item.dataProps.length; i++)
		 {
			if(item.dataProps[i] == on.prop)
			  {
			    	num = i+2
			     if (on.order >= 0)
			        {
			    	  document.querySelector("#comptable tbody th:nth-of-type("+num+")").innerText += ' ▲'
			    	}
			    else{
			    	  document.querySelector("#comptable tbody th:nth-of-type("+num+")").innerText += ' ▼'
			    	}
			  }
		}
		document.querySelector("#propnum").innerHTML = itemout.dataProps.length + 1 
		document.querySelector("#comptable tbody th:nth-of-type("+num+")").style.background = "#3f51b5"
		document.querySelector("#func").innerHTML = 'var count = itemout.dataProps.length + 1 ; function func() {count++ ; var nth = count - itemout.dataProps.length;  document.querySelector("#propContainer").appendChild(document.createElement(\'div\')); document.querySelector("#propContainer div:nth-of-type("+nth+")").innerHTML = \'<p style="margin-top:10px;">Prop \'+count+\'</p> <input type="text" required name="prop"  value="" style="margin:10px;text-align-last: left;padding-left: 10px;color:#2677eb ">\'}'
 } //End of arrange()

 document.addEventListener('click', function (event) 
 	{
       if ( event.target.classList.contains('properties')) 
         {
          arrange(itemout,event.target.innerText.replace(/ ▲| ▼/g,""),-1)
   		 }

	}, false);

 function addobj() 
 	{
 		var obj = {}
 		for (var i = 0; i < itemout.dataProps.length; i++) 
 		{
 			obj[itemout.dataProps[i]] = $('input[name="'+itemout.dataProps[i]+'"]').val();
 		}
 	 $.post("/addObject/"+window.location.pathname.split("").splice(6,24).join(""),obj)
 		.then(function() 
 			{
 				itemout.data.push(obj)
 	 				if (on.order>=0) 
 	 				{
 						on.order  =  -1
 					}
 						else{
 								on.order  = 1 
 							}	

 	 		  arrange(itemout,on.prop,on.order)
 			}) 
 	}
 	function edit() {
 		arrangeForEdit(itemout)
 	}

 	function arrangeForEdit(item){

			$('button[onclick="edit()"]').text("Save Changes")
			document.querySelector('button[onclick="edit()"]').style.background = "#009688"
 			$('button[onclick="edit()"]').attr("onclick","save()")
 			$("tbody").remove()
			$("#comptable").append("<tbody> <tr> <th>S.NO.</th> </tr> </tbody> ")	
 		for (var i = 0; i < item.dataProps.length; i++)
 		 {
  			$("#comptable tbody tr:nth-of-type(1)").append('<th class="properties">' +item.dataProps[i]+'</th>')
  		 }
  				var count = 1
			item.data.forEach(function(elem)
			{
			    	count++
			    document.querySelector("tbody").appendChild(document.createElement('tr'))
			    	var sno = count-1
			    $("#comptable tbody tr:nth-of-type("+count+")").append("<td>" +sno + "</td>")

		     for (var i = 0; i < item.dataProps.length; i++)
		     {
 		    	$("#comptable tbody tr:nth-of-type("+count+")").append('<td><input type="text" name="'+item.dataProps[i]+'" style=" color:#2677eb " value="'+ elem[item.dataProps[i]]+'"></td>')
		     }
	        })
 				$("th").removeClass("properties")
 	    }

  function save() {

  		var savedata = {}

  	for(var j = 0 ; j <itemout.dataProps.length ; j++){
 		savedata[itemout.dataProps[j]] = []
	}

	for(var j = 0 ; j <itemout.dataProps.length ; j++)
	  {

		$('#comptable input[name="'+itemout.dataProps[j]+'"]').each(function()
		{
 		   savedata[itemout.dataProps[j]].push($(this).val())
		});
      }

	
	$.post("/edit/"+window.location.pathname.split("").splice(6,24).join("")+"/1",savedata)
 		.then(function(saved_item) 
 			{   
 			  itemout = saved_item

 				if (on.order>=0) 
 	 				{
 						on.order  =  -1
 					}
 						else{
 								on.order  = 1 
 							}	

 	 		  arrange(itemout,on.prop,on.order)

 	 		  $('button[onclick="save()"]').text("edit data")
 	 		  document.querySelector('button[onclick="save()"]').style.background = "#2196f3"
 			 $('button[onclick="save()"]').attr("onclick","edit()")

 			}) 
    	}

  	function addProp(){

  		var arr = {prop: []}
  		
  		var valcheck = 0 

  		$('input[name="prop"]').each(function(){
 	 if($(this).val() == "" ){valcheck++}
		})
  		
  		if(valcheck == 0){	$('input[name="prop"]').each(function(){
  			  arr.prop.push($(this).val())})}
  		if (arr.prop.length == 0 ) {
  				validForm()
  	     }

  	else{
  		 
  		 $.post("/edit/"+window.location.pathname.split("").splice(6,24).join("")+"/0",arr)
  		 .then(function(saved_item) 
 			{   
 			itemout = saved_item 
 				if (on.order>=0) 
 	 				{
 						on.order  =  -1
 					}
 						else{
 								on.order  = 1 
 							}	

 	 		  arrange(itemout,on.prop,on.order)
 	 		  
 			}) 
  	      }
	    }
  function validForm() {
  			document.querySelector("#validForm").style.display = "block"
  			

  			setTimeout(function() {
  				document.querySelector("#validForm").style.display = "none"
  				
  			},2000)
  		}	
   function	arrangePropEdit()
     {
   			document.querySelector('button[onclick="addobj()"]').style.display= "none"
   			document.querySelector('#propeditbtn').style.background = "#009688"
   			$('#propeditbtn').text("Save Changes")
   			$('#propeditbtn').attr("onclick","saveProps()")
   			$("#propTable").remove()
 			$("#tableDiv").append('<table style="margin-top: 10px;" id="propTable"></table>')

  	 	for (var i = 0; i < itemout.dataProps.length; i++)
		 {
 		    $("#propTable").append('<tr><td><input type="text" name="prop" value="'+itemout.dataProps[i]+'" style="margin-top: 10px;color:#2880ff ;margin-left: 5px;padding-left:5px;" ></td> </tr>')
 	 	 }
   	}

   function saveProps(){
   			var props = {prop: []}
   			$('#propTable input[name="prop"]').each(function(){
   			props.prop.push($(this).val())})

   	 $.post("/edit/"+window.location.pathname.split("").splice(6,24).join("")+"/2",props)
 		.then(function(saved_item) 
 			{   
 			itemout = saved_item 
 				if (on.order>=0) 
 	 				{
 						on.order  =  -1
 					}
 						else{
 								on.order  = 1 
 							}	

 	 		  arrange(itemout,on.prop,on.order)

 	 		  $('#propeditbtn').text("edit name of properties")
 	 		  document.querySelector('#propeditbtn').style.background = "#2196f3"
 			 $('#propeditbtn').attr("onclick","arrangePropEdit()")
 			 document.querySelector('button[onclick="addobj()"]').style.display= ""
 			 
 			}) 
 		  }
 function printTable() {
 		  	$("#formHolder").css("display","none")
 		  	window.print()
 		  	 	$("#formHolder").css("display","flex")
 		  }		  
