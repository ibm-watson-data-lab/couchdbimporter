(function () {
  const Config = require('electron-config');
  const config = new Config();

  var holder = document.getElementById('drag-file');

  holder.ondragover = () => {
    console.log('drag over');
    $('#drag-file').addClass('dragover');
    $('#uploadicon').addClass('greenicon');
    return false;
  };

  holder.ondragleave = () => {
    $('#drag-file').removeClass('dragover');
    $('#uploadicon').removeClass('greenicon');
      return false;
  };

  holder.ondragend = () => {
    $('#drag-file').removeClass('dragover');
    $('#uploadicon').removeClass('greenicon');
    return false;
  };

  holder.ondrop = (e) => {
    $('#drag-file').removeClass('dragover');
    $('#uploadicon').removeClass('greenicon');
      e.preventDefault();
      var couchimport = require('couchimport');
      console.log(e.dataTransfer.files);
      var path = null;
      for (let f of e.dataTransfer.files) {
          console.log('File(s) you dragged here: ', f.path)
          console.log(f.path);
          path = f.path;
          break;
      }
      if (path) {
        $('#writecomplete').html('');
        $('#drag-file').hide();
        $('#upload-file').show();
        $('#dragfilename').html(path);
        $('#writesuccess').html('0');
        $('#writefail').html('0');
        couchimport.previewCSVFile(path,{}, function(err, data, delimiter) {
          var opts = {
            COUCH_URL: config.get('COUCH_URL') || 'http://localhost:5984',
            COUCH_DATABASE: config.get('COUCH_DATABASE') || 'mydb',
            COUCH_DELIMITER: delimiter,
            COUCH_PARALLELISM: config.get('COUCH_PARALLELISM') || 1
          };
          console.log('opts', opts);
          couchimport.importFile(path, opts, function(err,data) {
            console.log('Complete', err, data);
            $('#writecomplete').html("Import Complete!");
            $('#reset').show();
          }).on('written', function(data) {
            $('#writesuccess').html(data.total);
            $('#writefail').html(data.totalfailed);
            console.log(data);
          });


          console.log("done", err, data, "DELIM",delimiter);
        });
      }

      
      return false;
  };

  $('#reset').click(function() {
    $('#drag-file').show();
    $('#upload-file').hide();
    $('#reset').hide();
    $('#writecomplete').html('');
  });

  $('#couchimportlink').click(function() {
    const {shell} = require('electron')
    shell.openExternal('https://www.npmjs.com/package/couchimport');
  })
  
})();
