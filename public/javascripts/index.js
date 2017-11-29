$(document).ready(function() {

/* BUTTON CONTROLS */
    
    var buttonState = [];
    
    
    var buttonStateChecker = function(id) {
      var result = Boolean(buttonState.filter(function(elem) {
        return elem === id;
      }).length)
      return result;
    }
    
    var buttonStateToggle = function(id, toggle) {
      console.log(id);
      if (toggle) {
        buttonState = buttonState.filter(function(elem) {
          return elem !== id;
        })
      } else {
        buttonState.push(id);
      }      
    }
    
    var updateButtons = function() {
        $(".location-btn").each(function() {
            if (buttonStateChecker(this.id)) {
                $(this).text("Click to change your mind");
            } else {
                $(this).text("Click to say I'm going");
            }
        })
    }
    
    var voteButtonHandler = function(event) {
          if (event.target.type === "submit") {
              if (!buttonStateChecker(event.target.id)) {
                  $.ajax({
                      type: "POST",
                      url: "/main",
                      data: {
                          googleID: event.target.id
                      },
                      success: function(data) {
                          updateCounters()
                      },
                  });
                buttonStateToggle(event.target.id, false);
              } else {
                  $.ajax({
                      type: "DELETE",
                      url: "/main",
                      data: {
                          googleID: event.target.id
                      },
                      success: function(data) {
                          updateCounters()
                      },
                  });
                buttonStateToggle(event.target.id, true);  
              }
          }
          updateCounters()
          updateButtons();
      };




/* AUTOCOMPLETE BOX SETUP */
    
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        var location = new google.maps.LatLng(autocomplete.getPlace().geometry.location.lat(), autocomplete.getPlace().geometry.location.lng());
        var request = {
            location: location,
            radius: '5000',
            type: ['bar']
        };
        
        service.nearbySearch(request, callback);
    })
       
       
            
    
/* MAP & LOCATION API SETUP */

    var service = new google.maps.places.PlacesService(document.createElement('div'));
    var myLocation = new google.maps.LatLng(50.7680, 0.2905);

    //service.nearbySearch(request, callback);

    
/* INITALISE MAP */
        
    function initMap(results) {
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
        });
        
        
        results.forEach(function(elem) {
            var marker = new google.maps.Marker({
                position: {
                    lat: elem.geometry.location.lat(),
                    lng: elem.geometry.location.lng()
                },
                map: map,
            })
            var infowindow = new google.maps.InfoWindow({
                content: elem.name + "<br>" +
                    "Rating: " + elem.rating + "<br>" +
                    "<span>visitors: <span id='" + elem.id + "-counter'>0</span></span><br>" + 
                    "<button class='location-btn btn btn-default " +
                    (user ? "" : "disabled") + "'" +
                    "id='" + elem.id + "'>Click to say I'm going</button>"
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
                updateCounters();
                $(".location-btn").unbind("click").click(function(event) {
                  voteButtonHandler(event);
                })
                updateButtons();
            });
        })
    }
    
    

    
/* GOOGLE LOCATIONS API CALL */
    
    function callback(results, status) {
        $("#results").empty();
        results.forEach(function(elem) {
            $("#results").append("<tr>" +
                "<td class='image-cell'><img src='" + (elem.photos ? elem.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : "") + "'></td>" +
                "<td class='title-cell'>" + elem.name + "</td>" +
                "<td><span>visitors: <span id='" + elem.id + "-counter'>0</span></span></td>" +
                "<td><button class='location-btn btn btn-default " +
                (user ? "" : "disabled") + "'" +
                "id='" + elem.id + "'>Click to say I'm going</button>" +
                "</td></tr>");

        })

    $(".location-btn").click(function(event) {
      voteButtonHandler(event);
    })
        initMap(results)
        updateCounters();
    }

    
    

/* UPDATE VOTE COUNTERS */
    
    function updateCounters() {
        $.ajax({
            type: "GET",
            url: "/main/request",
            success: function(data) {
                data.forEach(function(elem) {
                    $("span").each(function() {
                        if (elem.googleID + "-counter" === this.id) {
                            $(this).html(elem.visitors);
                        } 
                    })
                })
            }
        })
    }
    
    
    /* END */
})
