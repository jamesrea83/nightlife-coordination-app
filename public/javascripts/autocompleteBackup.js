    /* MAP & LOCATION API SETUP */
    
    function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById("map"), {
            center: {lat: 50.82253, lng: -0.137163},
            zoom: 13,
            mapTypeId: "roadmap"
        });
        
        var options = {
            type: ['restaurant']
         };
        
        
        /* SEARCH BOX */
        var input = document.getElementById("pac-input");
        var searchBox = new google.maps.places.SearchBox(input, options);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        
        map.addListener("bounds_changed", function() {
            searchBox.setBounds(map.getBounds());
        });
        
        var markers = [];
        
        searchBox.addListener("places_changed", function() {
            var places = searchBox.getPlaces()
            
            console.log(places);
            
            if (places.length == 0) {
                return;
            }
            
            /* CLEAR OLD MARKERS */
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
            
            /* GET PLACES ICON, NAME & LOCATION */
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("Returned place has no details");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                
                /* CREATE NEW MARKERS */
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));
                
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds/extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
        
    }



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
