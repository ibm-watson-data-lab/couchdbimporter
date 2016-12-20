

(function () {
  const Config = require('electron-config');
  const config = new Config();

  var displayURL = function() {
    var db = config.get('COUCH_DATABASE');
    $('#couchurldisplay').html(config.get('COUCH_URL').replace(/\/\/(.*)@/,'//') + '/' + db) ;
  };

  if (!config.get('COUCH_URL')) {
    config.set('COUCH_URL', 'http://localhost:5984');
  }

  if (!config.get('COUCH_DATABASE')) {
    config.set('COUCH_DATABASE', 'mydb');
  }

  if (!config.get('COUCH_PARALLELISM')) {
    config.set('COUCH_PARALLELISM', 'mydb');
  }

  $( "#cog" ).click(function() {
    $('#alert').hide();
    $('#couchurl').val(config.get('COUCH_URL'));
    $('#couchdatabase').val(config.get('COUCH_DATABASE'));
    $('#parallelism').val(config.get('COUCH_PARALLELISM'))
    $('#configmodal').modal('show');
  });

  $('#configsave').click(function() {
    var url = $('#couchurl').val();
    var db = $('#couchdatabase').val();
    config.set('COUCH_URL', url);
    config.set('COUCH_DATABASE', $('#couchdatabase').val());
    config.set('COUCH_PARALLELISM', $('#parallelism').val());
    $('#configmodal').modal('hide');
    displayURL();

    $.ajax({
      method: 'PUT',
      url: url + '/' + db,
      dataType: 'json'
    }).done(function(d) {
    }).fail(function(e) {
      if (e.status !== 412) {
        $('#alerttxt').html('Could not contact CouchDB server');
        $('#alert').show();
      }
    });
  });

  $('#configcancel').click(function() {
    $('#configmodal').modal('hide');
  });

  $('#configform').submit(function(e) {
    e.preventDefault();
    console.log('config submit');
    return false;
  });

  displayURL();

})();