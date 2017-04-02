import { Template } from 'meteor/templating';
import { Crews } from '../../../collections/crews.js';
import { Session } from 'meteor/session';

import '../templates/login.html';

// Template.login.onRendered(
//
// );
//
Template.login.helpers({
  errorMessage : function () {
    return Session.get("errorMessage");
  },


});


Template.login.events({
  'submit .loginform'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const crew_id= target.crewid.value;
    const password = target.password.value;


    //get crew from collection
    var crew = Crews.findOne({
      "crew_id" : crew_id,
      "password" : password
    });

    if(crew !== undefined && crew["crew_id"] == crew_id && crew["password"] == password){
      Session.set("crew_id", crew["crew_id"]);
      console.log("session: " + Session.get("crew_id"))
      console.log("login successful");
      Session.set("errorMessage", undefined);

      FlowRouter.go("/home");
    }else{
      console.log("failed liao");
      Session.set("errorMessage", "Crew Id or Password Invalid");
      target.crewid.value = crew_id;
      target.password.value = '';
    }

  },
});
