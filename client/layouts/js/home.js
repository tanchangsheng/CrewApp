import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import { Crews } from '../../../collections/crews.js';
import { Reports } from '../../../collections/reports.js';
import { HTTP } from 'meteor/http';



import '../templates/home.html';

Template.home.onRendered(
  function homeOnRendered() {
    // counter starts at 0
    //this.counter = new ReactiveVar(0);
    crew_id = Session.get("crew_id");
    Session.set("crew_id", Session.get("crew_id"));
    console.log("Session crew_id: " + crew_id);
    if (!Session.get("crew_id")){
      console.log("hello");
      FlowRouter.go("/");
    }

  },


);
//
// function initMap() {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 8,
//     center: {lat: 40.731, lng: -73.997}
//   });
//   var geocoder = new google.maps.Geocoder;
//   var infowindow = new google.maps.InfoWindow;
//
//   document.getElementById('submit').addEventListener('click', function() {
//     geocodeLatLng(geocoder, map, infowindow);
//   });
// }
//
// function geocodeLatLng(geocoder, map, infowindow) {
//   var input = document.getElementById('latlng').value;
//   var latlngStr = input.split(',', 2);
//   var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
//   geocoder.geocode({'location': latlng}, function(results, status) {
//     if (status === 'OK') {
//       if (results[1]) {
//         map.setZoom(11);
//         var marker = new google.maps.Marker({
//           position: latlng,
//           map: map
//         });
//         infowindow.setContent(results[1].formatted_address);
//         infowindow.open(map, marker);
//       } else {
//         window.alert('No results found');
//       }
//     } else {
//       window.alert('Geocoder failed due to: ' + status);
//     }
//   });
// }



Template.home.helpers({
  // getAllCrew: function(){
  //   return Crews.find().fetch();
  // },
  crew_id () {
    return Session.get("crew_id");
  },
  crew_status () {
    var status = Crews.findOne({"crew_id" : Session.get("crew_id")})["status"];
    if(status === "a"){
      return status
    }
  },
  report () {
    //crew information
    var crew_id = Session.get("crew_id");
    var crew = Crews.findOne({"crew_id" : crew_id});
    var crew_status = crew["status"];
    var crew_region = crew["region"];


    //report that is assigned to crew region but not assigned to any crew
    var new_report = Reports.findOne({
      "status": "na",
      "report_assignedRegion": crew_region
    });
    //if crew is free, view unassigned report in his region to accept
    if(crew_status === "a" && new_report !== undefined){
      Session.set("jobstatusbutton", "accept");
      Session.set("accept_job_data",
      {
        "crew_id" : crew_id,
        "crew_region" : crew["region"],
        "report_id" : new_report["report_id"]
      }
    );
    Session.set("latlng", new_report["lat"] + "," + new_report["lng"]);
    return new_report;
    // return JSON.stringify(new_report);
  }

  //report that is assigned to crew region but not assigned to any crew
  var assigned_report = Reports.findOne({
    "crew_id": crew_id,
    "status": "a"
  });

  //if report is assigned to crew
  if(assigned_report !== undefined){
    console.log("assigned report " + JSON.stringify(assigned_report));
    Session.set("jobstatusbutton", "complete");
    Session.set("complete_job_data",
    {
      "crew_id" : crew_id,
      "report_id" : assigned_report["report_id"]
    }
  );

  Session.set("latlng", assigned_report["lat"] + "," + assigned_report["lng"]);
  return assigned_report;
  // return JSON.stringify(assigned_report);
}
Session.set("jobstatusbutton", "none");



},
// address(){
//   var latlng = Session.get("latlng");
//   $.ajax({ url:"http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=true",
//   success: function(data){
//     return data.results[0].formatted_address;
//     /*or you could iterate the components for only the city and state*/
//     }
//   });
//
// },
accept_complete_job (){
  var jobstatusbutton = Session.get("jobstatusbutton");
  if(jobstatusbutton === "none"){
    return "No Job Available";
  }
  if (jobstatusbutton === "complete"){
    return "Complete Job";
  }
  if (jobstatusbutton === "accept"){
    return "Accept Job";
  }
},
// userlat(){
//   if (navigator.geolocation) { //Checks if browser supports geolocation
//     navigator.geolocation.getCurrentPosition(function (position) {
//       console.log("lat " + position.coords.latitude)
//       return position.coords.latitude;                    //users current
//     });
//   }
// },
// userlng(){
//   if (navigator.geolocation) { //Checks if browser supports geolocation
//     navigator.geolocation.getCurrentPosition(function (position) {
//                 //users current
//       return  position.coords.longitude;
//     });
//   }
// },
});



Template.home.events({
  'click .logout'(event, instance){
    // your cleanup code here
    Object.keys(Session.keys).forEach(function(key){
      Session.set(key, undefined);
    });
    Session.keys = {}; // remove session keys
    alert("Successfully logged out");
    FlowRouter.go("/");
  },
  'click .jobstatusbutton'(event, instance){
    var jobstatusbutton = Session.get("jobstatusbutton");


    if (jobstatusbutton === "accept"){

      var accept_job_data = Session.get("accept_job_data");
      Session.set("accept_job_data", undefined);
      var accept_job_json = {
        data :{
          crew_id : accept_job_data["crew_id"],
          crew_region: accept_job_data["crew_region"],
          report_id: accept_job_data["report_id"]
        }
      };

      console.log("clicked on accept job " + JSON.stringify(accept_job_json));
      HTTP.post('http://localhost:3000/api/acceptjob', accept_job_json,
      function(err, id) {
        console.log(err || id);
        //Session.set("jobstatusbutton", "complete");
        alert("Job Accepted!");
      });
      return;
    }


    if (jobstatusbutton === "complete"){
      var complete_job_data = Session.get("complete_job_data");
      console.log("complete_job_data " + JSON.stringify(complete_job_data));
      Session.set("complete_job_data", undefined);
      var complete_job_json = {
        data :{
          crew_id : complete_job_data["crew_id"],
          report_id: complete_job_data["report_id"]
        }
      };


      console.log("clicked on complete job " + complete_job_json);
      HTTP.post('http://localhost:3000/api/completejob', complete_job_json,
      function(err, id) {
        console.log(err || id);
        //Session.set("jobstatusbutton", "none");
        alert("Job Completed!");
        if(err){
          console.log(err.toString());
        }
      });

    }

  },
});
