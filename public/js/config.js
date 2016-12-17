(function () {
  const Config = require('electron-config');
  const config = new Config();

  if (!config.get('COUCH_URL')) {
    config.set('COUCH_URL', 'http://localhost:5984');
  }

  if (!config.get('COUCH_DATABASE')) {
    config.set('COUCH_DATABASE', 'mydb');
  }

  $( "#cog" ).click(function() {
    console.log('click on cog');
    $('#couchurl').val(config.get('COUCH_URL'));
    $('#couchdatabase').val(config.get('COUCH_DATABASE'));
    $('#configmodal').modal('show');
  });

  $('#configsave').click(function() {
    config.set('COUCH_URL', $('#couchurl').val());
    config.set('COUCH_DATABASE', $('#couchdatabase').val());
    $('#configmodal').modal('hide');
  });

  $('#configcancel').click(function() {
    $('#configmodal').modal('hide');
  });

  $('#configform').submit(function(e) {
    e.preventDefault();
    console.log('config submit');
    return false;
  })

})();