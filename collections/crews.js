import { Mongo } from 'meteor/mongo';

export const Crews = new Mongo.Collection('crews');


/*
Reports.schema = new SimpleSchema({
createdAt: {type: String},
latitude: {type: Number, defaultValue: 0},
longitude: {type: Number, defaultValue: 0},
date: {type : String, defaultValue: ""},
time: {type : String, defaultValue: ""},
description: {type: String, optional: true}
});
*/
// if (Meteor.isServer) {
//   Crews.allow({
//     insert: function () {
//       /* user and doc checks ,
//       return true to allow insert */
//       return true;
//     },
//     update: function () {
//       /* user and doc checks ,
//       return true to allow insert */
//       return true;
//     }
//   });
// }
//
//
// if (Meteor.isServer){
//   var Api = new Restivus({
//     prettyJson: true
//   })
//
//   Api.addCollection(Crews);
//
//   //reading JSON message
//   Api.addRoute('assigncrew', {}, {
//     post: function(){
//       var report_id = this.bodyParams.report_id;
//       var crew_id = this.bodyParams.crew_id;
//       if (report_id != null || crew_id != null){
//         return {success: false, message: "report_id or crew_id is null"}
//       }
//       Crews.update({_id: report_id}, {$set:{
//         crew_id: crew_id,
//         status: "a"
//       }},
//       function(err,id){
//         //console.log(err || id);
//       });
//     }
//   });
//
//   Api.addRoute('updatereport/completed', {}, {
//     post: function(){
//       var report_id = this.bodyParams.report_id;
//       if (report_id != null){
//         return {success: false, message: "report_id or crew_id is null"}
//       }
//       Reports.update({_id: report_id}, {$set:{
//         crew_id: crew_id,
//         status: "c"
//       }},
//       function(err,id){
//         //console.log(err || id);
//       });
//     }
//   });
//
// }



/*
crewList = new Mongo.Collection("crew");

// Api.addRoute('crewList/:id', {}, {
//   get: function(){
//     var id = this.urlParams.id;
//     var crew = crewList.findOne({_id: id})
//     return crew == null ? {} : crew;
//   }
// });



if (Meteor.isServer){
    var Api = new Restivus({
        prettyJson: true
    })

    Api.addCollection(crewList);

    Api.addRoute('crewList/', {}, {
        get: function(){
            return crewList.find().fetch();
        },
        post: function(){
            var name = this.bodyParams.crewId;
            var lat = this.bodyParams.lat;
            var lng = this.bodyParams.lng;
            if (name != null || lat != null || lng != null)
                return {success: false, message: "name or lat or lng is null"}
            crewList.insert({name, lat, lng});
            return {name, lat, lng};
        }
    })

    Api.addRoute('crewList/:id', {}, {
        get: function(){
            var id = this.urlParams.id;
            var crew = crewList.findOne({_id: id})
            return crew == null ? {} : crew;
        }
    })

}
*/
