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

	$( "#"+ActivePageN+" .MyFooter h1" ).html("Copyright gov.kn 2016 &copy; 1-800-8477 (TIPS)");

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
  		
  		navigator.camera.getPicture(onSuccess, onFail, { quality: 100, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true });
  		//Camera.DestinationType.DATA_URL base64
  		//Camera.DestinationType.FILE_URI imgpath
	    function onSuccess(imageData) {
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
	        image.src = 'data:image/png;base64,' + imageData;
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
			quality: 100, destinationType: Camera.DestinationType.FILE_URI, 
			mediaType: mediaType.PICTURE,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
			correctOrientation: true
		});

  		//Camera.DestinationType.DATA_URL base64
  		//Camera.DestinationType.FILE_URI imgpath
  		
	    function onSuccess(imageData) {
        	var MediaPath = imageData,
        		extension = imageData.substr( (imageData.lastIndexOf('.') +1) );

	        var ImgFileType = ['jpg','jpeg','png','gif','bmp','tiff'];

			var image = document.getElementById('myImage');

			//Save Img Path to local storage
	        var ImgTempArray = [];

	        var ImgTempObj = {
					ImgPath: imageData
				};

			ImgTempArray.push(ImgTempObj);

			localStorage.ImgTemp = JSON.stringify(ImgTempArray);
			
	        image.src = 'data:image/png;base64,' + imageData;
	        $('.ReportImg').show();
	        $('.ReportImg img').show();
	        $('.ReportImg video').hide();

	    }

	    function onFail(message) {
	        console.log('Gallery Failed because: ' + message);
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

	$('#RestServz').bind( 'click', function(event, ui) {
		//alert('clicked');
		/*navigator.camera.getPicture(uploadRest, onFail, { 
			quality: 100, destinationType: Camera.DestinationType.DATA_URL, 
			mediaType: mediaType.ALLMEDIA,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			correctOrientation: true
		});*/

		uploadPhoto();

		function uploadPhoto() {
			//alert('run upload photo function');
			var img64 = 'data:image/png;base64,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';

			var imgData = JSON.stringify(img64);
		  	$.ajax({
		  		url: 'http://localhost:8080/rest/postdatarest/',
			  	dataType: 'json',
			  	data: imgData,
			  	type: 'POST',
			  	success: function(data) {
    				alert(data);
	    		}
	  		});

			function getBase64Image(imgElem) {
				// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
			    var canvas = document.createElement("canvas");
			    canvas.width = imgElem.clientWidth;
			    canvas.height = imgElem.clientHeight;
			    var ctx = canvas.getContext("2d");
			    ctx.drawImage(imgElem, 0, 0);
			    var dataURL = canvas.toDataURL("image/png");
			    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
			}

			/*$.post("http://localhost:8080/rest/postdatarest/",
	        {
	          title: new Date().getTime(),
	          name: 'nameoffile',
	          file: img64
	        },
	        function(data,status){
	            alert("Data: " + data + "\nStatus: " + status);
	        });

			$.ajax({
				url: "http://localhost:8080/rest/postdatarest/",
				type: "POST",
				processData: false,
      			contentType: false,
				data: {
					title : EventTitle,
					name : true,
					file : img64
				},
				xhrFields: {
					withCredentials: true
				},
			}).then(function(data) {
				$('#overlay').remove();
			});*/
		}

		function onFail(message) {
	        alert('Gallery Failed because: ' + message);
	    }
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
		    	ft.upload(imageURI, "http://hhsecurityservicespst.com/upload.php", UploadWin, UploadFail, options);

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

  		if($('#ReportType').val() == 'Traffic Accident'){
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

	html += '<tr><td>Type: </td><td>'+ DataTempArray[0].ReportType +'</td></tr>';
	//html += '<tr><td>Source: </td><td>'+ replacespecial(Source) +'</td></tr>';

	//alert(DataTempArray[0].Source);
	if(DataTempArray[0].Source == 'not checked'){
		html += '<tr><td>Full Name: </td><td>'+ DataTempArray[0].FullName +'</td></tr>';
		html += '<tr><td>Phone #: </td><td>'+ DataTempArray[0].PhoneNum +'</td></tr>';
		html += '<tr><td>Email: </td><td>'+ DataTempArray[0].Email +'</td></tr>';
	}

	html += '<tr><td>When: </td><td>'+ DataTempArray[0].WhenDate +'</td></tr>';
	
	if(DataTempArray[0].Alias != ''){
		html += '<tr><td>Alias: </td><td>'+ DataTempArray[0].Alias +'</td></tr>';
	}

	html += '<tr><td>Island: </td><td>'+ DataTempArray[0].Island +'</td></tr>';

	if(DataTempArray[0].Island == 'Nevis'){
		html += '<tr><td>Village: </td><td>'+ DataTempArray[0].NvVillage +'</td></tr>';
	}
	else{
		html += '<tr><td>Village: </td><td>'+ DataTempArray[0].SkVillage +'</td></tr>';
	}

	html += '<tr><td>Street address: </td><td>'+ DataTempArray[0].Street +'</td></tr>';
	html += '<tr><td>Add Info: </td><td>'+ DataTempArray[0].Info +'</td></tr>';

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

			//Set Image url from storage to variable
			if(localStorage.ImgTemp){
				ImgArray = JSON.parse(localStorage.ImgTemp);
				ImgData = ImgArray[0].ImgPath;
			}
			else{
				ImgData = '';
			}

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
					//"title": "iVBORw0KGgoAAAANSUhEUgAAAMwAAADiCAYAAAAChCi0AAAACXBIWXMAABcSAAAXEgFnn9JSAAA52WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU0OTExLCAyMDEzLzEwLzI5LTExOjQ3OjE2ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTYtMDctMTVUMTE6MTk6NDMtMDQ6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU",
					"doc": DataTempArray[0].WhenDate
				},
				"headers": {
					"content-type": "application/x-www-form-urlencoded",
					"cache-control": "no-cache"
					//"postman-token": "ff4fa53c-bd50-fc25-cf52-656242377376"
				}
			}

			//Check if Report submission was succesfull
			$.ajax(postreportdata).done(function (response) {
				console.log(response);
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
					alert('There was an error submitting the report. Please try again.')
					//$.mobile.navigate( 'ReportDetails.html?back=1' );
				}
			});

		}
	});
});