FlowRouter.route('/', {
  action(){
    BlazeLayout.render('login');
  }
});

FlowRouter.route('/home', {
  action(){
    BlazeLayout.render('home');
  }
});
