import { Mongo } from 'meteor/mongo';
import { Crews } from './crews.js';
import { HTTP } from 'meteor/http';

export const Reports = new Mongo.Collection('reports');



if (Meteor.isServer){
  var Api = new Restivus({
    prettyJson: true
  })

  Api.addCollection(Reports);

  //reading JSON message
  Api.addRoute('sendreport', {}, {
    post: function(){
      var report_id = this.bodyParams.report_id;
      var image_id = this.bodyParams.image_id;
      var lat = this.bodyParams.lat;
      var lng = this.bodyParams.lng;
      var date = this.bodyParams.date;
      var time = this.bodyParams.time;
      var description = this.bodyParams.description;
      var regions = this.bodyParams.region.toLowerCase();
      regions = regions.split(',');
      // if (report_id != null || crew_id != null){
      //   return {
      //     success: true, message: {
      //       "report_id": report_id,
      //       "image_id": image_id,
      //       "lat": lat,
      //       "lng": lng,
      //       "date": date,
      //       "time": time,
      //       "description": description,
      //       "region": regions
      //     }
      //   }
      // }
      var report_assignedRegion;
      //find crew in regione and available to work
      console.log("region 1 " +  regions[0]);
      var nearest_region1_avail = Crews.findOne({"region" : regions[0], "status":"a"});
      var nearest_region2_avail = Crews.findOne({"region" : regions[1], "status":"a"});
      var nearest_region3_avail = Crews.findOne({"region" : regions[2], "status":"a"});
      var nearest_region4_avail = Crews.findOne({"region" : regions[3], "status":"a"});
      console.log("nearest region " + nearest_region1_avail);
      console.log("2nd nearest region " + JSON.stringify(nearest_region2_avail));
      //return nearest_region1_avail;
      if (nearest_region1_avail !== undefined){
        report_assignedRegion = regions[0];
      } else if (nearest_region2_avail !== undefined){
        report_assignedRegion = regions[1];
      } else if (nearest_region3_avail !== undefined){
        report_assignedRegion = regions[2];
      }else {
        report_assignedRegion = regions[3];
      }
      Reports.insert({
        report_id: report_id,
        image_id: image_id,
        lat: lat,
        lng: lng,
        date: date,
        time: time,
        description: description,
        region: regions[0],
        status: "na",
        report_assignedRegion : report_assignedRegion
      },
      function(err,id){
        if(err){
          console.log("error " + err);
        }else{
          console.log("success " + id);
        }
        if(!err){
          return {
            success: true, message: {
              "report_id": report_id,
              "image_id": image_id,
              "lat": lat,
              "lng": lng,
              "date": date,
              "time": time,
              "description": description,
              "region": regions
            }
          }
        }else{
          return "error inserting to report db on CrewApp. toReturn: "  + toReturn + err.toString();
        }
      });
    }
  });


}

if (Meteor.isServer){
  var Api = new Restivus({
    prettyJson: true
  })

  Api.addCollection(Reports);

  //reading JSON message
  Api.addRoute('acceptjob', {}, {
    post: function(){
      var crew_id = this.bodyParams.crew_id;
      var crew_region = this.bodyParams.crew_region;
      var report_id = this.bodyParams.report_id;
      if (report_id !== null || crew_id !== null || crew_region !== null){
        //return {success: "true", message: "job accepted"}
      }else{
        return {success: "false", message: "job not accepted"}
      }
      //update crew status
      Crews.update({crew_id: crew_id}, {$set:{
        status: "na"
      }},
      function(err,id){
        console.log(err || id);
      });
      Reports.update({report_id: report_id}, {$set:{
        status: "a",
        crew_id: crew_id
      }},
      function(err,id){
        console.log(err || id);
        if (!err) {
          return {success: "true", message: "updated report status"}
        }else{
          return {success: "FALSE", message: "FAILED UPDATE OF REPORT DB"}
        }
      });
      //update tibco\
      var repair_startTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      var acceptjobrequest = {
        data :{
          report_id: report_id,
          crew_id: crew_id,
          crew_region: crew_region,
          repair_startTime: repair_startTime
        }
      };
      //tibco listening port
      HTTP.post('http://10.124.12.52:9092', acceptjobrequest,
      function(err, id) {
        console.log(err || id);
        if(err){
          console.log(err.toString());
          //location.reload();
        }
      });
    }
  });

  Api.addRoute('completejob', {}, {
    post: function(){
      var crew_id = this.bodyParams.crew_id;
      var report_id = this.bodyParams.report_id;
      if (report_id !== null || crew_id !== null){
        //return {success: "true", message: "job accepted"}
      }else{
        return {success: "false", message: "job not accepted"}
      }
      //update crew status
      Crews.update({crew_id: crew_id}, {$set:{
        status: "a"
      }},
      function(err,id){
        console.log(err || id);
      });
      Reports.update({report_id: report_id}, {$set:{
        status: "c"
      }},
      function(err,id){
        console.log(err || id);
        if (!err) {
          return {success: "true", message: "updated report status"}
        }else{
          return {success: "FALSE", message: "FAILED UPDATE OF REPORT DB"}
        }
      });

      var repair_endTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
      //update tibco
      var comletejobrequest = {
        data :{
          report_id: report_id,
          crew_id: crew_id,
          repair_endTime: repair_endTime
        }
      };
      //tibco listening port
      HTTP.post('http://10.124.12.52:9093', comletejobrequest,
      function(err, id) {
        console.log(err || id);
        if(!err){
          console.log(err.toString());
          location.reload();
        }
      });
    }
  });

  // //reading JSON message
  // Api.addRoute('completejob', {}, {
  //   post: function(){
  //     var crew_id = this.bodyParams.crew_id;
  //     var report_id = this.bodyParams.report_id;
  //     if (crew_id !== null || crew_region !== null){
  //       return {success: false, message: "error in completing"}
  //     }
  //     //update crew status
  //     Crews.update({crew_id: crew_id}, {$set:{
  //       status: "a"
  //     }},
  //     function(err,id){
  //       console.log(err || id);
  //     });
  //     Reports.update({report_id: report_id}, {$set:{
  //       status: "c"
  //     }},
  //     function(err,id){
  //       console.log(err || id);
  //     });
  //     //update tibco
  //     var completejobrequest = {
  //       data :{
  //         report_id: report_id,
  //         crew_id: crew_id,
  //       }
  //     };
  //     //tibco listening port
  //     HTTP.post('http://10.124.12.52:9091', completejobrequest,
  //     function(err, id) {
  //       console.log(err || id);
  //
  //       //alert("Thank you. Our repair crew is on the way!");
  //       if(err){
  //         console.log(err.toString());
  //         location.reload();
  //       }
  //     });
  //   }
  // });


}

if(Meteor.isServer){
  WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });
}
