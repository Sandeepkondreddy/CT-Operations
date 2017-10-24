var qsParm = new Array();
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
    $("#hiduuid").val(device.uuid);
    window.plugins.imeiplugin.getImei(callback);
}
function callback(imei) {
    $("#hidimei").val(imei);
}
/* function onBackKeyDown() {
} */
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
    if (parms.length > 0) {debugger;
        $("#hidusrid").val(atob(qsParm["user"]));
        return true;
    }
    else {
        window.location.href = 'Login.html';
        return false;
    }
}
$(document).ready(function () {
    $("#loading").hide();
    qs();
	showUserRecords();
    $("#home").click(function () {
        $.ajax({
            type: "GET",
			url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/GetUserScreens/" + $("#hidusrid").val(),
            //url: "http://202.83.27.199/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
	        //url: "http://182.72.244.25/KPCTSDS/api/Account/GetUserScreens/" + $("#hidusrid").val(),
            data: '{}',
            contentType: "application/json",
            success: function(result) {
                window.location.href = result + '?user=' + btoa($("#hidusrid").val());
            }
        });
    });

	$(".box7").click(function(){
            $("#loading").show();
			ValidateDevice();
            
        });
	$(".box6").click(function(){debugger;
            $("#loading").show();
			alert($("#hidusrid").val());
			if(sdsresult!="")
            window.location.href = sdsresult+'?user=' + btoa($("#hidusrid").val()) + '';
        });
    /* $("#btnSubmit").click(function (){

            $(this).find("i.fa").attr('class', 'fa fa-spinner fa-spin');
            $(this).find("span").text(" device is registering please wait...");
            $(this).attr('disabled', true);
            $(this).attr('class', 'btn btn-custom-icon');
            $("#loading").show();
            var Adddata = {};
            Adddata.IMEI = $("#hidimei").val();
            Adddata.UUID = $("#hiduuid").val();            
            Adddata.User = $("#hidusrid").val();
            $.ajax({
                type: 'POST',
                url: 'http://apps.kpcl.com/KPCLOpsAPI/api/Device/RegisterDevice',
                dataType: "json",
                data: Adddata,
                success: function (loctyperesult) {
                    alert('Device Registered Successfully');
                },
                error: function (xhr, status, error) {
                    $("#btnSubmit").prop('disabled', false);
                    alert('Error Occurred while Registring device.\n\r' + xhr.responseText);
                }
            });      
        $(this).find("i.fa").attr('class', 'fa fa-check');
        $(this).find("span").text(" Submit");
        $(this).attr('disabled', false);
        $(this).attr('class', 'btn btn-custom');
        $("#loading").hide();
    }); */
});

function ValidateDevice(){
	//alert($("#hidimei").val()+$("#hiduuid").val());
					$.ajax({
                                type: "GET",
								url: "http://apps.kpcl.com/KPCLOpsAPI/api/User/DeviceValidate/" + $("#hidimei").val()+"/"+$("#hiduuid").val(),
                                data: '{}',
                                contentType: "application/json",
                                success: function(result) {
									if (result == "Registered") {
										//alert('Device Already Registered.');
										window.location.href = 'Operations.html?user=' + btoa($("#hidusrid").val()) + '';
										//$("#btnSubmit").attr('disabled',false);
										}
										else {
											alert('Device Not Registered, Please contact IT Team.');$("#loading").hide();
											//$("#btnSubmit").attr('disabled',true);
										} 
                                    
                                },
								error: function () {
									alert('Error Occurred while getting Details');
								}
     });

}


var sdsresult="";
function getSDS( userr, passs)
{
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
									if(result=='admin.html')result='admin_sds.html';// alert(result);
                                    //window.location.href = result + '?user=' + btoa($("#husrid").val());
									sdsresult=result;
									
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