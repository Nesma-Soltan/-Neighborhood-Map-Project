
var initLocations = [
            {
              title:'My home',
              location: { lat: 30.983737, lng: 31.171908 },
              description:'Hi, Wellcome this is my lovely Family home, Which i live in it.'
            },
            {
              title:'Cairo',
              location: { lat: 30.0444196, lng: 31.23571160000006 },
              description:'Cairo  is the capital and largest city of Egypt. Cairo has the oldest and largest film and music industries in the Arab world, as well as the world\'s second-oldest institution of higher learning, Al-Azhar University. Many international media, businesses, and organizations have regional headquarters in the city; the Arab League has had its headquarters in Cairo for most of its existence.'
            },
            {
              title:'Montaza Palace',
              location: { lat: 31.288497, lng: 30.01597 } ,
              description:'Montaza Palace is a palace and extensive gardens in the Montaza district of Alexandria, Egypt. It was built on a low plateau east of central Alexandria overlooking a beach on the Mediterranean Sea.Montazah palaces and gardens have been much less exclusive than they once were. The gardens are now a well-maintained and very attractive public, seaside park. It is the most pleasant place to relax and walk in Alexandria and for the very modest price .'
            },
            {
              title:'Mansoura University',
              location: { lat: 31.043101, lng: 31.356726 },
              description:'Mansoura University is my University that i learnt in . '
            },
            {
              title:'luxor',
              location: { lat: 25.743247, lng: 32.695547 } ,
              description:'luxor is a city in Upper (southern) Egypt and the capital of Luxor Governorate. Luxor has frequently been characterized as the \"world\'s greatest open-air museum\", as the ruins of the temple complexes at Karnak and Luxor stand within the modern city. Immediately opposite, across the River Nile, lie the monuments, temples and tombs of the West Bank Necropolis, which includes the Valley of the Kings and Valley of the Queens.'
            },
            {
              title:'Pyramids of Giza',
              location: { lat: 29.976480, lng: 31.131302 } ,
              description:'The Great Pyramid of Giza (also known as the Pyramid of Khufu or the Pyramid of Cheops) is the oldest and largest of the three pyramids in the Giza pyramid complex bordering what is now El Giza, Egypt. It is the oldest of the Seven Wonders of the Ancient World, and the only one to remain largely intact.'},
            {
              title:'Abo Simble Temples',
              location: { lat: 22.336823, lng: 31.625532 } ,
              description:'The Abu Simbel temples are two massive rock temples at Abu Simbel (أبو سمبل in Arabic), a village in Nubia, southern Egypt, near the border with Sudan. They are situated on the western bank of Lake Nasser, about 230 km southwest of Aswan (about 300 km by road). The complex is part of the UNESCO World Heritage Site known as the "Nubian Monuments",[1] which run from Abu Simbel downriver to Philae (near Aswan). The twin temples were originally carved out of the mountainside during the reign of Pharaoh Ramesses II in the 13th century BC, as a lasting monument to himself and his queen Nefertari, to commemorate his victory at the Battle of Kadesh. Their huge external rock relief figures have become iconic'
            },
            {
              title:'Aswan',
              location: { lat: 23.08554, lng: 32.80845 } ,
              description:'Aswan is the ancient city of Swenett, later known as Syene, which in antiquity was the frontier town of Ancient Egypt facing the south. Swenett is supposed to have derived its name from an Egyptian goddess with the same name.'
            }
            ];
var locationsInfo = function (data) {
  this.title = (data.title);
  this.location = (data.location);
  this.marker = (data.marker);
  this.description=(data.description);
  this.visible = ko.observable(true);
  this.showMarker = ko.computed(function () {
    if (this.visible() === true) {
      if (this.marker) {
        this.marker.setVisible(true);
      }
    }
    else {
      this.marker.setVisible(false);
    }
    return true;
  }, this);
};
var infowindow;
var map;
// create a new blank array for all listing markers
var markers = [];
// Styles the map
var styles = [
                  {
                    elementType: 'geometry',
                    stylers: [{color: '#FFF3EA'}]
                  },
                  {
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#742D34'}]
                  },
                  {
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#FFEAC0'}]
                  },
                  {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#FFEAC0'}]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#579C47'}]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#A8F3BA'}]
                  },
                  {
                    featureType: 'poi.park',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#5D2A23'}]
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#E3E2D6'}]
                  },
                  {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#EEFFEF'}]
                  },
                  {
                   featureType: 'road',
                   elementType: 'labels.text.fill',
                   stylers: [{color: '#9ca5b3'}]
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#DCD7D5'}]
                  },
                  {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#C3C5C1'}]
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#7EC5D3'}]
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#515c6d'}]
                  },
                  {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#17263c'}]
                  }
        ];
//***view model****
var ViewModel = function () {
    var self = this;
    this.searchTitle = ko.observable('');
    this.locationList = ko.observableArray([]);
    initLocations.forEach(function (locItem) {
      self.locationList.push(new locationsInfo(locItem));
    });
    this.changeLocation = function (clickLoc) {
      populateInfoWindow(clickLoc.marker, infowindow);
    };
    // create search function to return the listplace item and markers that matches.
    this.listPlaces = ko.computed(function () {
            var filter = self.searchTitle().toLowerCase();
            if (!filter)
            {
                  self.locationList().forEach(function (locItem) {
                        locItem.visible(true);
                     });
                    return self.locationList();
            }
            else
            {
                      return ko.utils.arrayFilter(self.locationList(),function(locItem)
                      {
                            var string = locItem.title.toLowerCase();
                            var result = (string.search(filter) >= 0);
                            locItem.visible(result);
                            return result;
                      });
            }
    }, self);
          /*
         * the drawer will open when the menu icon clicked.
         */
        var menu = document.querySelector('#menu');
        var drawer = document.querySelector('.nav');
        menu.addEventListener('click', function(e) {
          drawer.classList.toggle('open');
          e.stopPropagation();
        });
};
 // initialize  map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 30.983737, lng: 31.171908 },
          zoom: 8
  });

  // initialize infowindow
  infowindow = new google.maps.InfoWindow();
  // create an array of markers on initialize.
  for (var i = 0; i < initLocations.length; i++) {
            var position = initLocations[i].location;
            var title = initLocations[i].title;
            var description=initLocations[i].description;
            // create a marker per location
            var marker = new google.maps.Marker({
                  map: map,
                  position: position,
                  title: title,
                  description:description,
                  animation: google.maps.Animation.DROP,
                  id: i
            });
            // add marker to each Location.
            vm.locationList()[i].marker = marker;
            // push the marker
            markers.push(marker);
            // create an click event to marker.
            marker.addListener('click', markerClick);
    }
  // create markerClick function
  function markerClick() {
      populateInfoWindow(this, infowindow);
  }
}
//  populates the infowindow when the marker is clicked based on markers position.
function populateInfoWindow(marker, infowindow)
{
    // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker)
  {
      infowindow.marker = marker;
      infowindow.setContent('<div><h3>' + marker.title + '</h3><h5>'+
                             marker.description + '</h5></div>');
      // marker property disappear if the infowindow closed.
      infowindow.addListener('closeclick', function () {
         for (var i = 0; i < markers.length; i++)
         {
              markers[i].setMarker = null;
          }
          markers = [];
       });
    // Foursquare API
     var foursquareUrl = "https://api.foursquare.com/v2/venues/search?query=" +
      marker.title + '&ll=' + marker.position.lat() + ',' + marker.position.lng() +
      '&client_id=VGWNICIOTVQ1AKK3RTBCQDM3O5RUMQENR10VAD22EOOS0PMK' +
      '&client_secret=TEJESOLSIYWA0FAPUKNK251LUOGKRAXB5TV2UYPSP12DK4PV&v=20170602';

      $.ajax({
              url: foursquareUrl,
              dataType: "json",
              success: function (data)
              {
                   var fourSq = data.response.venues[0];
                    infowindow.setContent('<div><h3>' + fourSq.name + '</h3><h5>'+
                    marker.description + '</h5></div>');
              },
            //error get foursqure
              error: function () {
                        alert("please, Try again there was an error to get Foursquare.");
              }
          });
          // open the infowindow
          infowindow.open(map, marker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function ()
          {
              marker.setAnimation(null);
          }, 2100);
  }
}
      // error handling
      function errorHandling (e) {
        	 alert("Please check your internet connection. Google Maps failed to load.");
           console.log('ERROR , Google Maps failed to load or error internet connection.');
      }
// initialize the Knockout View Model
var vm = new ViewModel();
ko.applyBindings(vm);