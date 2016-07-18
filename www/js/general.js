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

function loading(){
	// add the overlay with loading image to the page
	var over = '<div id="overlay">' +
	'<img id="loading" src="img/loading.gif">' +
	'</div>';
	$(over).appendTo('body');

	//click on the overlay to remove it
	$('#overlay').click(function() {
	   $(this).remove();
	});
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

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

	$( "#"+ActivePageN+" .MyFooter h1" ).html("Copyright gov.kn 2016 &copy;");

});

//Report Details
$(document).on("pageshow","#ReportDetails",function(){
	//window.location.href = "tel:8694651366";
	
	//Populate fields from temp data local storage if coming from review page
	var LoadInfo = getQueryVariable('back');
	if(LoadInfo == 1){
		//alert('Adding to fields');
		DataTempArray = JSON.parse(localStorage.DataTemp);

		window.setTimeout(AddValues, 10);
		
		function AddValues(){
			if(DataTempArray[0].Source == 'not checked'){
				$('.ContactDetails').fadeIn();
				sourceval = 'off';
				$('.ui-flipswitch').removeClass('ui-flipswitch-active');
			}
			else{
				sourceval = 'on';
			}

			if(DataTempArray[0].ReportType == 'Active Crime'){
				$('.When').fadeOut();
			}

			if(localStorage.ImgTemp){
				ImgTemp = JSON.parse(localStorage.ImgTemp);
				$('.ReportImg').show();
				$('#myImage').attr('src','data:image/jpeg;base64,' + ImgTemp[0].ImgPath);
			}

			$('#ReportType').val(DataTempArray[0].ReportType);
			$('#ReportType-button span').text(DataTempArray[0].ReportType);
			$('#Source').val(DataTempArray[0].Source);
			$('#Alias').val(DataTempArray[0].Alias);
			$('#Location').val(DataTempArray[0].Place);
			$('#info').val(DataTempArray[0].Info);
			$('#fullname').val(DataTempArray[0].FullName);
			$('#phonenum').val(DataTempArray[0].PhoneNum);
			$('#email').val(DataTempArray[0].Email);
			$('#WhenDate').val(DataTempArray[0].WhenDate);
		}
	}
	
	//Take a photo with camera
	$('#UploadImg').bind( 'click', function(event, ui) {
  		navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
  		//Camera.DestinationType.DATA_URL base64
	    function onSuccess(imageData) {
	        var image = document.getElementById('myImage'),
	        	imgpath = imageData;

	        //Save Img Path to local storage
	        var ImgTempArray = [];

	        var ImgTempObj = {
					ImgPath: imageData
				};

			ImgTempArray.push(ImgTempObj);

			localStorage.ImgTemp = JSON.stringify(ImgTempArray);
	        image.src = "data:image/jpeg;base64," + imageData;;
	        $('.ReportImg').show();
	    }

	    function onFail(message) {
	        console.log('Failed because: ' + message);
	    }
	});
	
	//Upload Img from photo library
	$('#ChooseImg').bind( 'click', function(event, ui) {
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
  		//Camera.DestinationType.DATA_URL base64
  		//Camera.DestinationType.FILE_URI imgpath
  		
	    function onSuccess(imageData) {
	        var image = document.getElementById('myImage'),
	        	imgpath = imageData;

	        //Save Img Path to local storage
	        var ImgTempArray = [];

	        var ImgTempObj = {
					ImgPath: imageData
				};

			ImgTempArray.push(ImgTempObj);

			localStorage.ImgTemp = JSON.stringify(ImgTempArray);
	        image.src = "data:image/jpeg;base64," + imageData;
	        $('.ReportImg').show();
	    }

	    function onFail(message) {
	        console.log('Failed because: ' + message);
	    }
	});

	//Remove Photo from que
	$('#ClearPhoto').bind( 'click', function(event, ui) {
		//Remove Img Path from local storage
        localStorage.removeItem('ImgTemp');

        var image = document.getElementById('myImage');
        image.src = "";
		
		$('.ReportImg').hide();        
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

	//Form Validation
	$("#ReportForm").submit(function() {
		//alert('submit');
		var Proceed = 0;
		//If Anonymous flipswitch is off
		if($('#Source').is(':checked') == false){
  			//If full name is empty
  			if ($("#fullname").val() == "") {
				$("#nameval").text("Please enter your name...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#nameval").fadeOut().removeClass('valiActive');
			}
			//if phone number is empty
			// if ($("#phonenum").val() == "") {
			// 	$("#phoneval").text("Please enter your phone number...").show().addClass('valiActive');
			// 	Proceed = Proceed + 1;
			// }
			// else{
			// 	$("#phoneval").fadeOut().removeClass('valiActive');
			// }

			//if phone number length is less than 7
			if ($("#phonenum").val().length < 7) {
				$("#phoneval").text("Please enter a valid phone number...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#phoneval").fadeOut().removeClass('valiActive');
			}
			//if email is empty
			if ($("#email").val() == "") {
				$("#emailval").text("Please enter your email address...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#emailval").fadeOut().removeClass('valiActive');
			}
  		}

  		if($('#ReportType').val() != 'Active Crime'){
  			if ($("#WhenDate").val() == "") {
				$("#dateval").text("Please enter when this crime occured...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#dateval").fadeOut().removeClass('valiActive');
			}
  		}

  		if($('#ReportType').val() == 'Future Crime'){
  			if ($("#WhenDate").val() <= formatDate(new Date())) {
				$("#dateval").text("Date must be a future date...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#dateval").fadeOut().removeClass('valiActive');
			}
  		}

  		if($('#ReportType').val() == 'Past Crime'){
  			if ($("#WhenDate").val() >= formatDate(new Date())) {
				$("#dateval").text("Date must be a past date...").show().addClass('valiActive');
				Proceed = Proceed + 1;
			}
			else{
				$("#dateval").fadeOut().removeClass('valiActive');
			}
  		}

  		if($('#ReportType').val() == ''){
  			$("#typeval").text("Please select a report type...").show().addClass('valiActive');
			Proceed = Proceed + 1;
  		}
  		else{
			$("#typeval").fadeOut().removeClass('valiActive');
		}

  		if($('#info').val() == ''){
  			$("#infoval").text("Please enter additional information...").show().addClass('valiActive');
  			Proceed = Proceed + 1;
  		}
  		else{
			$("#infoval").fadeOut().removeClass('valiActive');
		}

  		if($('#Location').val() == ''){
  			$("#locval").text("Please enter the location of this crime...").show().addClass('valiActive');
  			Proceed = Proceed + 1;
  		}
  		else{
			$("#locval").fadeOut().removeClass('valiActive');
		}

		if(Proceed == 0){
			return true;
		}
		else{
			return false;
		}
	});
});

//Save Report Details for Review & Submission
$(document).on("pagebeforehide","#ReportDetails",function(){
	//Form Validation

	//alert('Adding to temp data');
	//Before Moving page add data from fields to temp data storage
	var DataTempArray = [];

	if($('#Source').is(':checked')){
		var sourcechecked = 'checked';
	}
	else{
		var sourcechecked = 'not checked';
	}

	if($('#ReportType').val() == 'Active Crime'){
		var DateInput =formatDate(new Date());
	}
	else{
		var DateInput = $('#WhenDate').val();
	}

    var DataTempObj = {
			ReportType: $('#ReportType').val(),
			Source: sourcechecked,
			Alias: $('#Alias').val(),
			Place: $('#Location').val(),
			Info: $('#info').val(),
			FullName: $('#fullname').val(),
			PhoneNum: $('#phonenum').val(),
			Email: $('#email').val(),
			WhenDate: DateInput
		};

	DataTempArray.push(DataTempObj);

	localStorage.DataTemp = JSON.stringify(DataTempArray);
	//alert('Added to localStorage');
});

//Replace special characters from string
function replacespecial(string){
	goodstring = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
	return(goodstring)
}

//Details Page
$(document).on("pageshow","#ReportReview",function(){
	//$(document).ready(loading);
	loading();
	
	var html = '';

	DataTempArray = JSON.parse(localStorage.DataTemp);

	html += '<tr><td>Type: </td><td>'+ DataTempArray[0].ReportType +'</td></tr>';
	//html += '<tr><td>Source: </td><td>'+ replacespecial(Source) +'</td></tr>';

	//alert(DataTempArray[0].Source);
	if(DataTempArray[0].Source == 'not checked'){
		html += '<tr><td>Full Name: </td><td>'+ DataTempArray[0].FullName +'</td></tr>';
		html += '<tr><td>Phone #: </td><td>'+ DataTempArray[0].PhoneNum +'</td></tr>';
		html += '<tr><td>Email: </td><td>'+ DataTempArray[0].Email +'</td></tr>';
	}

	// if(replacespecial(ReportType) != 'Active Crime'){
	// 	var WhenDate = getQueryVariable('WhenDate');
	// }
	// else{
	// 	var WhenDate = formatDate(new Date());
	// }

	html += '<tr><td>When: </td><td>'+ DataTempArray[0].WhenDate +'</td></tr>';
	html += '<tr><td>Alias: </td><td>'+ DataTempArray[0].Alias +'</td></tr>';
	html += '<tr><td>Location: </td><td>'+ DataTempArray[0].Place +'</td></tr>';
	html += '<tr><td>Add Info: </td><td>'+ DataTempArray[0].Info +'</td></tr>';

	$('#overlay').remove();

	$('#ReviewTable').html(html);
	$('#BackToDetails').attr('href', 'ReportDetails.html?back=1');
	$('#SubmitReport').attr('href', 'SubmitReport.html');
});

//Details Page
$(document).on("pageshow","#SubmitReport",function(){
	//$(document).ready(loading);

	//Check if the MyCrimeReports from local storage exist
	if (localStorage.MyCrimeReports) {
		CrimeReportArray = JSON.parse(localStorage.MyCrimeReports);
		var RpIdz = CrimeReportArray.length;
	}
	else{
		var CrimeReportArray = [];
		var RpIdz = 0;
	}

	DataTempArray = JSON.parse(localStorage.DataTemp);
		
	var html = '';

	// if(DataTempArray[0].Source == 'not checked'){
	// 	var fullname = '',
	// 		phonenum = '',
	// 		email = '',
	// 		Source = 'details';
	// }

	// if(DataTempArray[0].ReportType == 'Active Crime'){
	// 	var WhenDate = formatDate(new Date());
	// }

	if(localStorage.ImgTemp){
		ImgArray = JSON.parse(localStorage.ImgTemp);
		ImgData = ImgArray[0].ImgPath;
	}
	else{
		ImgData = '';
	}

	var CRObj = {
			ReportId: RpIdz,
			ReportDate: formatDate(new Date()),
			ReportType: DataTempArray[0].ReportType,
			Alias: DataTempArray[0].Alias,
			Place: DataTempArray[0].Place,
			Info: DataTempArray[0].Info,
			FullName: DataTempArray[0].FullName,
			PhoneNum: DataTempArray[0].PhoneNum,
			Email: DataTempArray[0].Email,
			Source: DataTempArray[0].Source,
			Img: ImgData,
			WhenDate: DataTempArray[0].WhenDate
		};


	CrimeReportArray.push(CRObj);

	//Add to local storage and remove temp data
	localStorage.MyCrimeReports = JSON.stringify(CrimeReportArray);
	localStorage.removeItem('DataTemp');
	localStorage.removeItem('ImgTemp');

	$('#overlay').remove();

});

$(document).on("pageshow","#HomePage",function(){

	//Check if MyCrimeReports from local storage exist and Populate "My Reports Lists"
	var html = '';
	if(typeof(Storage) !== "undefined") {
	    if (localStorage.MyCrimeReports) {
	    	var locz = localStorage.MyCrimeReports;
	    	var myCrimeReports = JSON.parse(locz);
	    	var x = myCrimeReports.length;
	    	//alert(myCrimeReports.length);
	    	//$('.MyReportHeader').append('('+myCrimeReports.length+')');
	    	if(myCrimeReports.length > 0){
	    		for(var i = 0 ; i < myCrimeReports.length; i++){
	    			x = x - 1;
		    		html += '<li><a href="MyReport.html?id='+myCrimeReports[x].ReportId+'" class="ui-btn ui-btn-icon-right ui-icon-carat-r">'+ myCrimeReports[x].ReportType +'</a></li>';
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
		$('.MyReportList').html('');
	});
	
});

$(document).on("pageshow","#MyReport",function(){

	loading();

	ReportId = getQueryVariable('id');

	myCrimeReports = JSON.parse(localStorage.MyCrimeReports);

	if(myCrimeReports[ReportId].Img != ''){
		$('.ReportImg').show();
		$('#myImage').attr('src','data:image/jpeg;base64,' + myCrimeReports[ReportId].Img);
		$('#myImagePopUp').attr('src','data:image/jpeg;base64,' + myCrimeReports[ReportId].Img);
	}

	$('.ReportType').append('<b>' + myCrimeReports[ReportId].ReportType + '</b>');
	$('.Alias').append('<b>' + myCrimeReports[ReportId].Alias + '</b>');
	$('.Location').append('<b>' + myCrimeReports[ReportId].Place + '</b>');
	$('.Info').append('<b>' + myCrimeReports[ReportId].Info + '</b>');
	// $('.fullname').append(myCrimeReports[ReportId].FullName + '</b>');
	// $('.phonenum').append(myCrimeReports[ReportId].PhoneNum + '</b>');
	// $('.email').append(myCrimeReports[ReportId].Email + '</b>');
	$('.WhenDate').append('<b>' + myCrimeReports[ReportId].WhenDate + '</b>');

	$('#overlay').remove();
	
});
