jQuery(function($) {
  $("#topbar-save").click(function() {
    function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    var csrftoken = getCookie('csrftoken')
    function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
      crossDomain: false, // obviates need for sameOrigin test
      beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });

    function convertGraph() {
      // convert canvas graph into JSON
      var nodes = diagram.model.nodeDataArray;
      var nodeData = [];
      for (let node of nodes) {
        var obj = {};
        for (let attr in node) {
          if (attr !== "color" && attr !== "__gohashid") {
            obj[attr] = node[attr];
          }
        }
        nodeData.push(obj);
      }
      return nodeData;
    }

    // prompt user to enter graph name
	  // TODO should we use while here?
    var graphName = prompt("Enter a name for the current workspace: ")
    if (graphName == null || graphName == "") {
      alert("You must enter a name to save your workspace!")
    } else {
      var $btn = $(this);
      var nodeData = convertGraph();
      var myJSON = JSON.stringify({ graph_name: graphName, data: JSON.stringify(nodeData) });

      console.log($btn.attr('action'))
      $.ajax({
        type: $btn.attr('method'),
        url: $btn.attr('action'),
        data: { 'graph_name' : graphName, 'data' : myJSON },
        traditional: true,
        success: function(ret) {
          console.log(ret);
          alert("Your workspace " + graphName + " has been saved!");
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert(thrownError);
        }
      });
    }
  });
});
