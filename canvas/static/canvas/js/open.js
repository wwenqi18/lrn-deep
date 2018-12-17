jQuery(function ($) {
  $("#opendialog").dialog({
    autoOpen: false,
    title: "Open"
  });

  $("#topbar-open").click(function () {
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

    // prompt user to select a graph name
    function getGraphName(names) {
      if (names == null || names.length == 0) {
        name = null;
        alert("You have no saved canvases!")
      } else {
        $("#opendialog").dialog("open");
        $("#select-canvas").selectmenu();
        $("#opendialog-btn").button();
        selectcanvas = document.getElementById("select-canvas");
        // var str = "Your canvases: \n";
        for (let name of names) {
          // str = str + name + "\n";
          selectcanvas.add(new Option(name));
        }
        name = null;
        // console.log(selectcanvas.options);
        // str = str + "Please enter the name of the canvas you want to open: "
      }
      // var name = prompt(str);
      // if (name != null && name != "" && names.includes(name)) {
      //   alert("Your canvas " + name + " is opened!");  
		  //   console.log(name);
      // } else {
		  //   name = null;
      //   alert("Please enter a valid value!");
      // }
	    return name;
    }

    // render graph with graph data
    function renderGraph(myJSON) {
      var data = JSON.parse(myJSON["data"]);
      diagram.clear();
      for (let node of data) {
        node["color"] = "#86b3d1";
        diagram.model.addNodeData(node);
      }
    }

    // test getGraphName() and renderGraph()
    // var graphNameList = ["1", "2", "3"];
    // getGraphName(graphNameList);
    // var myJSON = { "graph_name": "1", "data": [{ "key": 0, "category": "batch" }, { "key": 1, "category": "batch" }, { "key": 2, "category": "batch" }] };
    // renderGraph(myJSON);

    var $btn = $(this);

    // request for list of graph names
    $.ajax({
      type: $btn.attr('method'),
      url: $btn.attr('action_list'),
      // data: { 'graph_name': graphName, 'data': myJSON },
      // traditional: true,
      success: function (ret) {
        // console.log(ret);
        var name = getGraphName(ret);
        //console.log(name)
            
        // if (name != null && name != "") {
          // ajaxCall2(name);
        // }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError);
      }
    });

    // request for graph data
    // function ajaxCall2(name) {
    //   $.ajax({
    //     type: $btn.attr('method'),
    //     url: $btn.attr('action_graph'),
    //     data: { 'graph_name': name },
    //     success: function (ret) {
    //       renderGraph(ret);
    //       alert("Your canvas " + name + " will be opened!");  
    //     },
    //     error: function (xhr, ajaxOptions, thrownError) {
    //       alert(thrownError);
    //     }
    //   });
    // }

  }); // End topbar-open click

  $("#opendialog-btn").click(function () {
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

    // render graph with graph data
    function renderGraph(myJSON) {
      var data = JSON.parse(myJSON["data"]);
      diagram.clear();
      for (let node of data) {
        node["color"] = "#86b3d1";
        diagram.model.addNodeData(node);
      }
    }

    // test getGraphName() and renderGraph()
    // var graphNameList = ["1", "2", "3"];
    // getGraphName(graphNameList);
    // var myJSON = { "graph_name": "1", "data": [{ "key": 0, "category": "batch" }, { "key": 1, "category": "batch" }, { "key": 2, "category": "batch" }] };
    // renderGraph(myJSON);

    var $btn = $(this);

    // find current selected graph
    name = $("#select-canvas").find("option:selected").text();
    // console.log(name);
    ajaxCall2(name);
    $("#opendialog").dialog("close");

    // request for graph data
    function ajaxCall2(name) {
      $.ajax({
        type: $btn.attr('method'),
        url: $btn.attr('action_graph'),
        data: { 'graph_name': name },
        success: function (ret) {
          renderGraph(ret);
          alert("Your canvas " + name + " will be opened!");  
        },
        error: function (xhr, ajaxOptions, thrownError) {
          alert(thrownError);
        }
      });
    }

  }); // End opendialog-btn click
});
