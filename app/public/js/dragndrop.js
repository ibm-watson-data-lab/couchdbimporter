var infer = function(data) {
  var fields = [ ];
  for(var i in data[0]) {
    var obj = {
      name: i,
      type: "string"
    };

    var v = data[0][i];
    var vl = v.toLowerCase();
    if(vl === "true" || vl === "false") {
      obj.type = "boolean";
    } else if (v.match(/^[0-9\.]+$/)) {
      obj.type = "number";
    }
    fields.push(obj);
  }
  return fields
};

var findfield = function(f, flist) {
  for(var i in flist) {
    if (flist[i].name === f) {
      return flist[i];
    }
  }
  return null;
};

var transform = function(doc, fields) {
  for(var i in doc) {
    var v = doc[i];
    var f = findfield(i, fields);
    if (f) {
      switch (f.type) {
        
      case "number":
        if( v.match(/\./)) {
          var f = parseFloat(v);
          doc[i] = isNaN(f) ? v : f;
        } else {
          var f = parseInt(v);
          doc[i] = isNaN(f) ? v : f;
        }
        break;
        
      case "boolean": 
        doc[i] = (v.toLowerCase()==="true")?true:false;
        break;       
      
      default:
        // do nothing
        break;
      }
    }
    
    // support MSSQL \N to mean null - just the string not a real null
    if (typeof doc[i] === "string" &&  doc[i] === "\\N") {
      doc[i] = "null";
    }
  }
  return doc;
};
const Config = require('electron-config');
var couchimport = require('couchimport');
const config = new Config();

var uploadCSVFile = function(p) {
 
  $('#drag-file').removeClass('dragover');
  $('#uploadicon').removeClass('greenicon');
  $('#writecomplete').html('');
  $('#drag-file').hide();
  $('#upload-file').show();
  $('#dragfilename').html(p);
  $('#writesuccess').html('0');
  $('#writefail').html('0');
  
  couchimport.previewCSVFile(p,{}, function(err, data, delimiter) {
    var fields = infer(data);
    var opts = {
      COUCH_URL: config.get('COUCH_URL') || 'http://localhost:5984',
      COUCH_DATABASE: config.get('COUCH_DATABASE') || 'mydb',
      COUCH_DELIMITER: delimiter,
      COUCH_PARALLELISM: config.get('COUCH_PARALLELISM') || 1,
      COUCH_META: fields,
      COUCH_TRANSFORM: transform
    };
    couchimport.importFile(p, opts, function(err,data) {
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
};

(function () {
  var holder = document.getElementById('drag-file');

  holder.ondragover = () => {
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
    console.log('on drop');
    e.preventDefault();
    var p = null;
    for (let f of e.dataTransfer.files) {
      console.log('File(s) you dragged here: ', f.path)
      console.log(f.path);
      p = f.path;
      break;
    }
    console.log('path', p);
    if (p) {
      uploadCSVFile(p);
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
  });

  $('#alertclose').click(function() {
    $('#alert').hide();
  });

  $('#uploadbutton').click(function() {
    var app = require('electron').remote; 
    var dialog = app.dialog;
    dialog.showOpenDialog(function (fileNames) {
      // fileNames is an array that contains all the selected
      if (fileNames === undefined){
        console.log("No file selected");
      } else {
        uploadCSVFile(fileNames[0]);
        console.log(fileNames);
      }
    });
  });
  
})();

document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);