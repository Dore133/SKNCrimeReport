$(document).ready(function() {

    var loading = function() {
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="img/loading.gif">' +
            '</div>';
        $(over).appendTo('body');

        // click on the overlay to remove it
        //$('#overlay').click(function() {
        //    $(this).remove();
        //});

        // hit escape to close the overlay
        /*$(document).keyup(function(e) {
            if (e.which === 27) {
                $('#overlay').remove();
            }
        });*/
    };
    
    $(document).ready(loading);
    //alert('1');
    function getQueryVariable(parameter)
    {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == parameter){return pair[1];}
       }
       return(false);
    }

    var id = getQueryVariable('id');

    $.ajax({
        url: "https://stkittsnevisegovernmentplatform-test.mendixcloud.com/rest/wsc_getevents/?contenttype=json",
        //https://stkittsnevisegovernmentplatform-test.mendixcloud.com/rest/wsc_getevents/?contenttype=json
        //data: {q : 'Van Gogh'},
        xhrFields: {
            // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
            // This can be used to set the 'withCredentials' property.
            // Set the value to 'true' if you'd like to pass cookies to the server.
            // If this is enabled, your server must respond with the header
            // 'Access-Control-Allow-Credentials: true'.
            withCredentials: false
        },
    }).then(function(data) {
        var totalrec = 11; //data.eventsObjects.length;
        /*if(totalrec > 10){
            var totalrec = 10;
        }*/
        var finishid = totalrec - 1;
        for (var i = 0; i < totalrec; i++) {
            var title = data.eventsObjects[i].title,
                EventDate = new Date(data.eventsObjects[i].startDate),
                EventDate = EventDate.toDateString();
                
            //navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
            $('.listitems').append('<li><a id="'+i+'" href="details.html?Title='+ title +'" class="EventListItem ui-btn ui-btn-icon-right ui-icon-carat-r"><h3>'+ title +'</h3><p>'+ EventDate +'</p></a></li>');
            //$('.mx-listview .mx-list').append('<li class="mx-name-index-0 mx-listview-item"><h4 class="mx-text">' + name +'</h4><div class="text-right"><span><label>' + phonenumber + '</label></span></div><div class="col-md-1 col-xs-2 text-right"><span class="mx-link" tabindex="0"><span class="glyphicon glyphicon-chevron-right"></span><a tabindex="-1"></a></span></div></li>');
            //$('.listing').append('<div class="listingitem"><p>Name: '+ name +'</p><p>Phone number: '+ phonenumber +'</p><p>Age: '+ age +'</p><p>Email: '+ email +'</p><hr></div>');
            //details.html?Title='+ title +'
            if(i == finishid){
                $('#overlay').remove();
                //alert('done');
            }
        };
    });

});