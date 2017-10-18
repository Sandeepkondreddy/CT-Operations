var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    window.plugins.imeiplugin.getImei(callback);	
}
function callback(imei) {
    $("#hidIMEI").val(imei);
}
function onBackKeyDown() {
    }

$(document).ready(function(){
        qs();
		showUserRecords();
        $("#loading").hide();
        $(".box5").click(function(){
            $("#loading").show();
            window.location.href = 'RegDevice.html?user=' + btoa($("#hidusrid").val()) + '';
        });
        $(".box7").click(function(){
            $("#loading").show();
            window.location.href = 'Operations.html?user=' + btoa($("#hidusrid").val()) + '';
        });
		$(".box6").click(function(){debugger;
            $("#loading").show();
			alert($("#hidusrid").val());
			if(sdsresult!="")
            window.location.href = sdsresult+'?user=' + btoa($("#hidusrid").val()) + '';
        });
		
});


function qs() {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i = 0; i < parms.length; i++) {
            var pos = parms[i].indexOf('=');
            if (pos > 0) {
                var key = parms[i].substring(0, pos);
                var val = parms[i].substring(pos + 1);
                qsParm[key] = val;
            }
        }
        if (parms.length > 0) {
            $("#hidusrid").val(btoa(qsParm["user"]));
            return true;
        }
        else {
            window.location.href = 'Login.html';
            return false;
        }
		
}

var sdsresult="";
function getSDS(var userr,var passs)
{debugger;
	if(user!=""){
	$.ajax({
                    type: "GET",
					//url: "http://202.83.27.199/TestAPI/api/User/ValidateUser/" + $("#txtusername").val().trim() + "/" + $("#txtpassword").val(),	  	//Act Link.                
					url: "http://182.72.244.25/KPCTSDS/api/Account/ValidateUser/" + userr + "/" + passs,   //Airtel Link.
                    data: '{}',
                    contentType: "application/json",
                    success: function(data) {
                        if (data[1] == 'True') {
                            $("#husrid").val(data[0]);
                            $.ajax({
                                type: "GET",
                                //url: "http://202.83.27.199/TestAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),		//Act Link.						
								url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#husrid").val(),	//Airtel Link.
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {
									if(result=='admin.html')result='admin_sds.html'; alert(result);
                                    window.location.href = result + '?user=' + btoa($("#husrid").val());
                                }
                            });
                        } else {
                            alert("Invalid User Name or Password");
                        }
                    },
                    error: function() {
                        alert("Invalid User Name or Password");
                    }
                });
	}
}

//  Internal (SQL Lite) DB Section-----Start--- 
	
		// --SQLLite Database Creation
		var db = openDatabase("LocalDB", "1.0", "Local Database", 200000);  // Open SQLLite Database
		function initDatabase()  // Function Call When Page is ready.
		{
			 try {
				 if (!window.openDatabase)  // Check browser is supported SQLLite or not.
				 {
					 alert('Databases are not supported in this browser.');
				 }
				 else {
					 //createUserTable();  // If supported then call Function for create table in SQLite
				 }
			 }
		 
			catch (e) {
				 if (e == 2) {
					 // Version number mismatch. 
					 console.log("Invalid database version.");
				 } else {
					 console.log("Unknown error " + e + ".");
				 }
				 return;
			 }
		 }
var user="";var pass="";		 
		 // Function For Retrive User data from Database
		var selectRecentUserStatement = " SELECT * FROM UserTbl where Id=(Select Max(Id) from UserTbl)";
		var userDataset;
		function showUserRecords() // Function For Retrive data from Database Display records as list
		{
			 db.transaction(function (tx) {
				 tx.executeSql(selectRecentUserStatement, [], function (tx, result) {
					 userDataset = result.rows;
					 if(userDataset.length==0)
					 {				 
						 //document.getElementById('lblmessage').innerHTML = 'Offline User Data Not Available.!';
						 //alert (' Offline User Data Not Available.!');	
					 }
					 else{
						 //document.getElementById('lblmessage').innerHTML = dataset.length+ ' Offline User Data Available.!';
						// alert (' Offline User Data Available.!');	
					 }
					 for (var i = 0, item = null; i < userDataset.length; i++) {
						item = userDataset.item(i);
						//alert('Id:'+item['Id']+ ', IMEI:'+item['IMEI']+', LoginId:'+item['LoginId']+', Password:'+item['Password']+', HomePage:'+item['HomePage']+',  CreatedTime:'+item['CreatedTime']);						 
						 user=item['LoginId'];
						 pass=item['Password'];
						 getSDS(item['LoginId'],item['Password']);
					 }
					 
				 });
			 });
		 }
//  Internal (SQL Lite) DB Section-----End--- 