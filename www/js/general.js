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
	$("#overlay").on("tap",function(){
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

	$( "#"+ActivePageN+" .MyFooter h1" ).html("Copyright gov.kn 2017 &copy; 1-800-8477 (TIPS)");

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
			//Anonymous Switch
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

			if(DataTempArray[0].Island == 'Nevis'){
				$('.NvArea').fadeIn();
				$('.SkArea').fadeOut();
			}

			if(localStorage.ImgTemp){
				ImgTemp = JSON.parse(localStorage.ImgTemp);
				$('.ReportImg').show();
				$('.ReportImg img').show();
				$('.ReportImg video').hide();
				$('#myImage').attr('src',ImgTemp[0].ImgPath);
			}

			if(localStorage.VideoTemp){
				VideoTemp = JSON.parse(localStorage.VideoTemp);
				$('.ReportImg').show();
				$('.ReportImg video').show();
				$('.ReportImg img').hide();
				$('#myVideo').attr('src',VideoTemp[0].VideoPath);
			}

			$('#ReportType').val(DataTempArray[0].ReportType);
			$('#ReportType-button span').text(DataTempArray[0].ReportType);
			$('#Source').val(DataTempArray[0].Source);
			$('#Alias').val(DataTempArray[0].Alias);
			$('#Island').val(DataTempArray[0].Island);
			$('#Island-button span').text(DataTempArray[0].Island);

			$('#SkLocation').val(DataTempArray[0].SkVillage);
			$('#SkLocation-button span').text(DataTempArray[0].SkVillage);
			$('#NvLocation').val(DataTempArray[0].NvVillage);
			$('#NvLocation-button span').text(DataTempArray[0].NvVillage);
			$('#StreetLoc').val(DataTempArray[0].Street);

			$('#info').val(DataTempArray[0].Info);
			$('#fullname').val(DataTempArray[0].FullName);
			$('#phonenum').val(DataTempArray[0].PhoneNum);
			$('#email').val(DataTempArray[0].Email);
			$('#WhenDate').val(DataTempArray[0].WhenDate);
		}
	}

	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
	    pictureSource = navigator.camera.PictureSourceType;
	    destinationType = navigator.camera.DestinationType;
	    mediaType = navigator.camera.MediaType;
	}

	//Take a photo with camera
	$('#UploadImg').bind( 'click', function(event, ui) {
  		
  		navigator.camera.getPicture(onSuccess, onFail, { 
  			quality: 100, 
  			destinationType: Camera.DestinationType.FILE_URI, 
  			correctOrientation: true 
  		});
  		//Camera.DestinationType.DATA_URL base64
  		//Camera.DestinationType.FILE_URI imgpath
	    function onSuccess(imageData) {
	        localStorage.removeItem('ImgTemp');
	        
	        var image = document.getElementById('myImage'),
	        	path = imageData;

	        //Save Img Path to local storage
	        var ImgTempArray = [];

	        var ImgTempObj = {
					ImgPath: imageData
				};

			ImgTempArray.push(ImgTempObj);

			localStorage.ImgTemp = JSON.stringify(ImgTempArray);
	        //image.src = "data:image/jpeg;base64," + imageData;
	        image.src = imageData;
	        $('.ReportImg').show();
	        $('.ReportImg video').hide();
		    $('.ReportImg img').show();
	    }

	    function onFail(message) {
	        console.log('Camera Failed because: ' + message);
	    }
	});
	
	//Upload Img from photo library
	$('#ChooseImg').bind( 'click', function(event, ui) {
		
		navigator.camera.getPicture(onSuccess, onFail, { 
			quality: 100, 
			destinationType: Camera.DestinationType.FILE_URI, 
			mediaType: mediaType.PICTURE,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
			correctOrientation: true
		});

  		//Camera.DestinationType.DATA_URL base64
  		//Camera.DestinationType.FILE_URI imgpath
  		
	    function onSuccess(imageData) {
        	localStorage.removeItem('ImgTemp');

        	var MediaPath = imageData,
        		extension = imageData.substr( (imageData.lastIndexOf('.') +1) ),
        		stoppath = imageData.indexOf("?"),
    			newpath = imageData.slice(0, stoppath);

	        var ImgFileType = ['jpg','jpeg','png','gif','bmp','tiff'];

			var image = document.getElementById('myImage');
			alert('newpath '+ newpath);
			alert('imageData '+ imageData);
			//Save Img Path to local storage
	        var ImgTempArray = [];

	        var ImgTempObj = {
					ImgPath: imageData
				};

			ImgTempArray.push(ImgTempObj);

			localStorage.ImgTemp = JSON.stringify(ImgTempArray);
			
	        image.src = imageData;
	        $('.ReportImg').show();
	        $('.ReportImg img').show();
	        $('.ReportImg video').hide();

	    }

	    function onFail(message) {
	        alert('Gallery Failed because: ' + message);
	    }
	});
	
	//Take a video with a camera
	$('#ChooseVideo').bind( 'click', function(event, ui) {
		
		// capture callback
		var captureSuccess = function(mediaFiles) {
		    var i, path, len;
		    var video = $('#myVideo source');

		    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
		        path = mediaFiles[i].fullPath;
		        // do something interesting with the file
		    }

		    //Save Img Path to local storage
	        var VideoTempArray = [];

	        var VideoTempObj = {
					VideoPath: path
				};

			VideoTempArray.push(VideoTempObj);

		    localStorage.VideoTemp = JSON.stringify(VideoTempArray);
		    video.attr('src', path);
		    $('.ReportImg').show();
		    $('.ReportImg video').show();
		    $('.ReportImg img').hide();
		};

		// capture error callback
		var captureError = function(error) {
		    console.log('Video Failed Error code: ' + error.code );
		};

		// start video capture
		navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});
	});

	$('#Uploadzz').bind( 'click', function(event, ui) {

		navigator.camera.getPicture(uploadPhoto, onFail, { 
			quality: 100, destinationType: Camera.DestinationType.FILE_URI, 
			mediaType: mediaType.ALLMEDIA,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY 
		});

		function uploadPhoto(imageURI) {
        	//alert('UploadPhoto function');
        	var	extension = imageURI.substr( (imageURI.lastIndexOf('.') +1) );
	        	ImgFileType = ['jpg','jpeg','png','gif','bmp','tiff'];

	        function makeid(){
			    var text = "",
			    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
			    	idlength = 5;

			    for( var i=0; i < idlength; i++ ){
			        text += possible.charAt(Math.floor(Math.random() * possible.length));
		        }
			    
			    return text;
			}

			function UploadWin(result){
		        alert('RESULT'+JSON.stringify(result));
		    }

		    function UploadFail(error){
		        alert('ERROR'+JSON.stringify(error));
		    }

		    var options = new FileUploadOptions();
			    //if file extension not of image type
				if ( ImgFileType.indexOf( extension ) == -1 ) { 
					options.fileKey = "avatar";
					options.mimeType = "video/mpeg";
				}
				else{
					options.fileKey = "file";
					options.mimeType = "image/"+extension;
				}
				//Generate Random File Name
			    options.fileName = makeid() + new Date().getTime();
			    console.log(options.fileName);
		    
		    var params = new Object();
			    params.username = "";
			    params.password = "";
			    options.params = params;
			    options.chunkedMode = true;

		    var ft = new FileTransfer();
		    	ft.upload(imageURI, "http://mobileapps.gov.kn/upload.php", UploadWin, UploadFail, options);

		}

		function onFail(message) {
	        alert('Gallery Failed because: ' + message);
	    }

	});

	//Remove Photo & Video from que
	$('#ClearPhoto').bind( 'click', function(event, ui) {
		//Remove Path from local storage
        localStorage.removeItem('ImgTemp');
        localStorage.removeItem('VideoTemp');

        var image = document.getElementById('myImage'),
        	video = $('#myVideo source');
        
        image.src = "";
        video.attr('src','');
		
		$('.ReportImg').hide();    
		$('.ReportImg video').hide();
	    $('.ReportImg img').hide();    
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

	//Show Respective Areas of Country
	$('#Island').change(function() {
		var type = $(this).val();
  		if(type == 'Nevis'){
  			$('.SkArea').fadeOut();
  			$('.NvArea').fadeIn();
  		}
  		else{
  			$('.SkArea').fadeIn();
  			$('.NvArea').fadeOut();
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

  		if($('#ReportType').val() == 'Traffic Offense'){
  			if ($("#WhenDate").val() > formatDate(new Date())) {
				$("#dateval").text("Date CANNOT be a future date...").show().addClass('valiActive');
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

  		if($('#Island').val() == 'St. Kitts'){
  			if($('#SkLocation').val() == ''){
  				$("#locval").text("Please choose the location of this crime...").show().addClass('valiActive');
  				Proceed = Proceed + 1;
  			}
  			else{
				$("#locval").fadeOut().removeClass('valiActive');
			}
  		}
  		else{
  			if($('#NvLocation').val() == ''){
  				$("#locval").text("Please choose the location of this crime...").show().addClass('valiActive');
  				Proceed = Proceed + 1;
  			}
  			else{
				$("#locval").fadeOut().removeClass('valiActive');
			}
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
			Island: $('#Island').val(),
			SkVillage: $('#SkLocation').val(),
			NvVillage: $('#NvLocation').val(),
			Street: $('#StreetLoc').val(),
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

	html += '<tr><td><strong>Report Type:</strong> </td><td>'+ DataTempArray[0].ReportType +'</td></tr>';
	//html += '<tr><td>Source: </td><td>'+ replacespecial(Source) +'</td></tr>';

	//alert(DataTempArray[0].Source);
	if(DataTempArray[0].Source == 'not checked'){
		html += '<tr><td><strong>Full Name:</strong> </td><td>'+ DataTempArray[0].FullName +'</td></tr>';
		html += '<tr><td><strong>Phone #:</strong> </td><td>'+ DataTempArray[0].PhoneNum +'</td></tr>';
		html += '<tr><td><strong>Email:</strong> </td><td>'+ DataTempArray[0].Email +'</td></tr>';
	}

	html += '<tr><td><strong>Date of Crime:</strong> </td><td>'+ DataTempArray[0].WhenDate +'</td></tr>';
	
	if(DataTempArray[0].Alias != ''){
		html += '<tr><td><strong>Alias:</strong> </td><td>'+ DataTempArray[0].Alias +'</td></tr>';
	}

	html += '<tr><td><strong>Island:</strong> </td><td>'+ DataTempArray[0].Island +'</td></tr>';

	if(DataTempArray[0].Island == 'Nevis'){
		html += '<tr><td><strong>Village:</strong> </td><td>'+ DataTempArray[0].NvVillage +'</td></tr>';
	}
	else{
		html += '<tr><td><strong>Village:</strong> </td><td>'+ DataTempArray[0].SkVillage +'</td></tr>';
	}

	html += '<tr><td><strong>Street Address:</strong> </td><td>'+ DataTempArray[0].Street +'</td></tr>';
	html += '<tr><td><strong>Add Info:</strong> </td><td>'+ DataTempArray[0].Info +'</td></tr>';

	$('#overlay').remove();

	$('#ReviewTable').html(html);
	$('#BackToDetails').attr('href', 'ReportDetails.html?back=1');
	
	$('#SubmitReport').bind( 'click', function(event, ui) {
		loading();
		
		var CRObjz = 'false',
			Proceed = 0;

		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
		    pictureSource = navigator.camera.PictureSourceType;
		    destinationType = navigator.camera.DestinationType;
		    mediaType = navigator.camera.MediaType;
		    //console.log('deviceready review page');
		}

		SubmitCrimeReport();

		//Go to success page after details sent
		function SubmitCrimeReport(){
			DataTempArray = JSON.parse(localStorage.DataTemp);

			function makeid(){
			    var text = "",
			    	possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
			    	idlength = 5;

			    for( var i=0; i < idlength; i++ ){
			        text += possible.charAt(Math.floor(Math.random() * possible.length));
		        }
			    
			    return text;
			}

			ReportIDz = makeid() + new Date().getTime();

			//Set Image url from storage to variable
			if(localStorage.ImgTemp){
				ImgArray = JSON.parse(localStorage.ImgTemp);
				ImgData = ImgArray[0].ImgPath;
			}
			else{
				ImgData = '';
				FinishSend(ImgData);
			}

			if (ImgData != '') {
				var ImgName = makeid() + new Date().getTime();
					ImgUrl = 'http://mobileapps.gov.kn/upload/'+ImgName+'.jpg';
					uploadPhoto(ImgData,ImgName,ImgUrl);
			}

			function uploadPhoto(imageURI,ImgName,ImgUrl) {
	        	//alert('UploadPhoto function');
	        	var	extension = imageURI.substr( (imageURI.lastIndexOf('.') +1) );
		        	ImgFileType = ['jpg','jpeg','png','gif','bmp','tiff'];

				function UploadWin(result){
			        console.log('RESULT'+JSON.stringify(result));
			        FinishSend(ImgUrl);
			    }

			    function UploadFail(error){
			        console.log('ERROR'+JSON.stringify(error));
			        alert('Error uploading image. Please make sure you have stable internet connection.');
			        $('#overlay').remove();
			    }

			    var options = new FileUploadOptions();
				    //if file extension not of image type
					if ( ImgFileType.indexOf( extension ) == -1 ) { 
						options.fileKey = "avatar";
						options.mimeType = "video/mpeg";
					}
					else{
						options.fileKey = "file";
						options.mimeType = "image/"+extension;
					}
					//Generate Random File Name
				    options.fileName = ImgName;
				    console.log(options.fileName);
			    
			    var params = new Object();
				    params.username = "";
				    params.password = "";
				    options.params = params;
				    options.chunkedMode = true;

			    var ft = new FileTransfer();
			    	ft.upload(imageURI, "http://mobileapps.gov.kn/upload.php", UploadWin, UploadFail, options);

			}

			function onFail(message) {
		        alert('Gallery Failed because: ' + message);
		    }

			function FinishSend(ImgUrl){
				if(DataTempArray[0].Island == 'Nevis'){
					TempCity = DataTempArray[0].NvVillage;
				}
				else{
					TempCity = DataTempArray[0].SkVillage;
				}

				if(DataTempArray[0].Source == 'not checked'){
					TempSource = 'OFF';
				}
				else{
					TempSource = 'ON';
				}

				//alert(ImgUrl);

				//Code to submit report
				var postreportdata = {
					"async": true,
					"crossDomain": true,
					"url": "https://stkittsnevisegovernmentplatform-test.mendixcloud.com/rest/wsc_postcrimereportingdata/",
					"method": "POST",
					"data": {
						"reportid": ReportIDz,
						"entryType": DataTempArray[0].ReportType,
						"suspect": DataTempArray[0].Alias,
						"country": DataTempArray[0].Island,
						"city": TempCity,
						"address": DataTempArray[0].Street,
						"notes": DataTempArray[0].Info,
						"fullname": DataTempArray[0].FullName,
						"phonenumber": DataTempArray[0].PhoneNum,
						"email": DataTempArray[0].Email,
						"anonymous": TempSource,
						"title": ImgUrl,
						"doc": DataTempArray[0].WhenDate
					},
					"headers": {
						"content-type": "application/x-www-form-urlencoded",
						"cache-control": "no-cache"
						//"postman-token": "ff4fa53c-bd50-fc25-cf52-656242377376"
					},
					error: function (xhr, ajaxOptions, thrownError) {
						console.log('Web Service POST Error Code' + xhr.status);
						console.log('Web Service POST ThrownError' + thrownError);
						alert('There was an error submitting the report. Please try again.');
						$('#overlay').remove();
						$.mobile.navigate( 'ReportDetails.html?back=1' );
					}
				}

				//Check if Report submission was succesfull
				$.ajax(postreportdata).done(function (response) {
					console.log('Web Service POST ' + response);
					if(response == 'Success'){
						localStorage.removeItem('DataTemp');
						localStorage.removeItem('ImgTemp');
						localStorage.removeItem('VideoTemp');
						localStorage.removeItem('MyCrimeReports');
						localStorage.removeItem('GeoTemp');
						$('#overlay').remove();
						$.mobile.navigate( 'ReportSuccess.html' );
					}
					else{
						$('#overlay').remove();
						alert('There was an error submitting the report. Please try again.');
						//$.mobile.navigate( 'ReportDetails.html?back=1' );
					}
				});
			}

		}
	});
});