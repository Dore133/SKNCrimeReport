function getQueryVariable(parameter){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == parameter){
			return pair[1];
		}
	}
	return(false);
}

var loading = function() {
	// add the overlay with loading image to the page
	var over = '<div id="overlay">' +
	'<img id="loading" src="img/loading.gif">' +
	'</div>';
	$(over).appendTo('body');

	//click on the overlay to remove it
	$('#overlay').click(function() {
	   $(this).remove();
	});

};

//Menu Items
$(document).on("pageshow",function(){
	//alert('page show');
	var ActivePageN = $.mobile.activePage.attr('id');

	//alert(Menuto);
	if($( "#"+ActivePageN+" .PanelItems" ).has( "li" ).length == 0){
		//alert('no item');
		var MenuItems = null;

		MenuItems = '<li><a href="#HomePage" data-transition="flip" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Home</a></li>';
		MenuItems = MenuItems + '<li><a href="ReportDetails.html" data-transition="flip" class="ui-btn ui-btn-icon-right ui-icon-carat-r">Submit Report</a></li>';
    
		$( "#"+ActivePageN+" .PanelItems" ).append(MenuItems);
	}
	else{
		//alert($( ".PanelItems" ).html());
	}

	$( "#"+ActivePageN+" .MyFooter h1" ).html("Copyright Gov.Kn 2016 &copy;");

});

//Report Details
$(document).on("pageshow","#ReportDetails",function(){
	//window.location.href = "tel:8694651366";
	var LoadInfo = getQueryVariable('back');
	//alert(LoadInfo);
	if(LoadInfo == 1){
		//alert('yes');
		$(document).ready(loading);
		$('#ReportType').val($( "body" ).data( "ReportType" )) ;
		$('#overlay').remove();
	}

	$('#UploadImg').bind( 'click', function(event, ui) {
  		navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
  		//Camera.DestinationType.DATA_URL base64
	    function onSuccess(imageURI) {
	        var image = document.getElementById('myImage'),
	        	imgpath = imageURI;

	        $( "body" ).data( "imgpathcam", imageURI);
	        image.src = imageURI;
	    }

	    function onFail(message) {
	        alert('Failed because: ' + message);
	    }
	});

	$('#ChooseImg').bind( 'click', function(event, ui) {
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
  		//Camera.DestinationType.DATA_URL base64
	    function onSuccess(imageURI) {
	        var image = document.getElementById('myImage'),
	        	imgpath = imageURI;

	        $( "body" ).data( "imgpathgal", imageURI);
	        image.src = imageURI;
	    }

	    function onFail(message) {
	        alert('Failed because: ' + message);
	    }
	});

	//Show Date of Crime
	$('#ReportType').change(function() {
		var type = $(this).val();
  		if(type == 'Active Crime'){
  			$('.When').fadeOut();
  		}
  		else{
  			$('.When').fadeIn();
  		}
	});

	//Show Contact Details
	$('#Source').change(function() {
		var source = $(this).val();
		//$(".ContactDetails").fadeToggle();
  		if($('#Source').is(':checked')){
  			$('.ContactDetails').fadeOut();
  		}
  		else{
  			$('.ContactDetails').fadeIn();
  		}
	});

	//Validation

});

//Save Report Details for Review & Submission
$(document).on("pagebeforehide","#ReportDetails",function(){
	// alert('About to hide');
	// alert($('#ReportType').val());
	$( "body" ).data( "ReportType", $('#ReportType').val() );
	$( "body" ).data( "Source", $('#Source').val() );
	$( "body" ).data( "fullname", $('#fullname').val() );
	$( "body" ).data( "email", $('#email').val() );
	$( "body" ).data( "phonenum", $('#phonenum').val() );
	$( "body" ).data( "WhenDate", $('#WhenDate').val() );
	$( "body" ).data( "Alias", $('#Alias').val() );
	$( "body" ).data( "info", $('#info').val() );
});

function replacespecial(string){
	goodstring = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');

	return(goodstring)
}

//Details Page
$(document).on("pageshow","#ReportReview",function(){
	$(document).ready(loading);
	var html = '',
		parameters = $(location).attr('search'),
		BackLink = 'ReportDetails.html'+ parameters + '&back=1',
		ReportType = getQueryVariable('ReportType'),
		Source = getQueryVariable('Source'),
		Alias = getQueryVariable('Alias'),
		Locationz = getQueryVariable('Location'),
		info = getQueryVariable('addinfo');

	if(Source == 'false'){
		var fullname = getQueryVariable('fullname'),
			phonenum = getQueryVariable('phonenum'),
			email = getQueryVariable('email');
	}

	if(ReportType != 'AC'){
		var WhenDate = getQueryVariable('WhenDate');
	}

	html += '<tr><td>Type: </td><td>'+ replacespecial(ReportType) +'</td></tr>';
	html += '<tr><td>Source: </td><td>'+ replacespecial(Source) +'</td></tr>';

	if(Source == 'false'){
		html += '<tr><td>Full name: </td><td>'+ replacespecial(fullname) +'</td></tr>';
		html += '<tr><td>Phone Number: </td><td>'+ decodeURI(phonenum) +'</td></tr>';
		html += '<tr><td>Email: </td><td>'+ decodeURI(email) +'</td></tr>';
	}

	html += '<tr><td>Alias: </td><td>'+ replacespecial(Alias) +'</td></tr>';
	html += '<tr><td>Locationz: </td><td>'+ replacespecial(Locationz) +'</td></tr>';
	html += '<tr><td>Additional info: </td><td>'+ replacespecial(info) +'</td></tr>';

	$('#overlay').remove();

	$('#ReviewTable').html(html);
	$('#BackToDetails').attr('href', BackLink);
	$('#SubmitReport').attr('href', 'SubmitReport.html'+parameters);
});

//Details Page
$(document).on("pageshow","#SubmitReport",function(){
	$(document).ready(loading);

	//AddtoStorage();
	if (localStorage.MyCrimeReports) {
		CrimeReportArray = JSON.parse(localStorage.MyCrimeReports);
	}
	else{
		var CrimeReportArray = [];
	}
		
	var parameters = $(location).attr('search'),
		ReportType = getQueryVariable('ReportType'),
		Source = getQueryVariable('Source'),
		Alias = getQueryVariable('Alias'),
		Locationz = getQueryVariable('Location'),
		info = getQueryVariable('addinfo'),
		html = '';

	var CRObj = {
			ReportType: replacespecial(ReportType),
			Alias: replacespecial(Alias),
			Place: replacespecial(Locationz),
			info: replacespecial(info)
		};

	CrimeReportArray.push(CRObj);

	localStorage.MyCrimeReports = JSON.stringify(CrimeReportArray);

	$('#overlay').remove();

});

$(document).on("pageshow","#HomePage",function(){
	var html = '';
	if(typeof(Storage) !== "undefined") {
	    if (localStorage.MyCrimeReports) {
	    	var locz = localStorage.MyCrimeReports;
	    	var myCrimeReports = JSON.parse(locz);
	    	//alert(myCrimeReports.length);
	    	// alert( myCrimeReports[0].ReportType);
	    	if(myCrimeReports.length > 0){
	    		for(var i = 0 ; i < myCrimeReports.length; i++){
		    		html += '<li><a href="" class="ui-btn ui-btn-icon-right ui-icon-carat-r">'+ myCrimeReports[i].ReportType +'</a></li>';
		    	}
		    	$('.MyReportList').html(html);
		    	$('.NoReports').hide();
	    	}
	    	else{
	    		$('.NoReports').show();
	    	}
	    } 
	    else {
	        $('.NoReports').show();
	    }
	} else {
	    document.getElementById("result").innerHTML = "Sorry, your phone does not support local storage...";
	    console.log('not available');
	}

	$('#ClearReports').bind( 'click', function(event, ui) {
		localStorage.clear();
	});
	
});