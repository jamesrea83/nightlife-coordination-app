$(document).ready(function() {

    if (user) {
        $("#user").text(user);
    } else {
        $("#user").text("Not logged in!");
    }
    
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




    /* Map & Location API setup */
    
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude);
    })

    var service = new google.maps.places.PlacesService(document.createElement('div'));
    var myLocation = new google.maps.LatLng(50.7680, 0.2905);

    function initMap(results) {
        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: myLocation
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
    
    
    
    
    /* Google Locations API call */
    
    var request = {
        location: myLocation,
        radius: '5000',
        type: ['restaurant']
    };

    function callback(results, status) {
        results.forEach(function(elem) {
            $("#results").append("<li>" +
                "<img src='" + elem.photos[0].getUrl({
                    'maxWidth': 100,
                    'maxHeight': 100
                }) + "'>" +
                elem.name +
                "<span>visitors: <span id='" + elem.id + "-counter'>0</span></span>" +
                "<button class='location-btn btn btn-default " +
                (user ? "" : "disabled") + "'" +
                "id='" + elem.id + "'>Click to say I'm going</button>" +
                "</li>");

        })

    $(".location-btn").click(function(event) {
      voteButtonHandler(event);
    })


        initMap(results)
        updateCounters();
    }

    service.nearbySearch(request, callback);




    /* update vote counters */
    
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
    
    
    /* end */
})
