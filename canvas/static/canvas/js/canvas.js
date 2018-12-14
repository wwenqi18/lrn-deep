function init() {
  var $ = go.GraphObject.make;

  // diagram
  diagram = $(go.Diagram, "canvas-diagram", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true, // must be true to accept drops from the palette
    allowMove: false,
    // allowDragOut: true,
    allowVerticalScroll: false,
    allowHorizontalScroll: true,
    // "ExternalObjectsDropped": function (e) {
    //   if (diagram.commandHandler.canDeleteSelection() &&
    //     !(diagram.lastInput.control || diagram.lastInput.meta)) {
    //     diagram.commandHandler.deleteSelection();
    //   }
    // },
    layout: $(go.GridLayout)
  });

  // node template for fully connected layer
  var fcDiagram =
    $(go.Node, 'Auto',
      $(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50
        },
        new go.Binding("figure", "desc"),
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for cnn
  var cnnDiagram =
    $(go.Node, 'Auto',
      $(go.Shape, 'Rectangle',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for lstm
  var lstmDiagram =
    $(go.Node, 'Auto',
      $(go.Shape, 'MultiProcess',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for activation
  var actDiagram =
    $(go.Node, 'Auto',
      $(go.Shape, 'Ellipse',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // define template map
  var templateMapDiagram = new go.Map("string", go.Node);
  templateMapDiagram.add("fc", fcDiagram);
  templateMapDiagram.add("cnn", cnnDiagram);
  templateMapDiagram.add("lstm", lstmDiagram);
  templateMapDiagram.add("act", actDiagram);
  diagram.nodeTemplateMap = templateMapDiagram;

  // set diagram grid
  //diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 25);



  /**
   *  palette
   */

  // define palette
  palette = $(go.Diagram, "canvas-palette", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true, // must be true to accept drops from the palette
    allowVerticalScroll: false,
    allowHorizontalScroll: false,
    isReadOnly: true,
    "undoManager.isEnabled": true,
    layout: $(go.GridLayout),
    padding: new go.Margin(10, 5, 5, 5)
  });

  // palette.nodeTemplate =
  //   $(go.Node, 'Auto', {
  //     mouseEnter: mouseEnter,
  //     mouseLeave: mouseLeave,
  //     click: click
  //   },
  //     $(go.Shape, 'Trapezoid',
  //       {
  //         "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50,
  //         cursor: "pointer"
  //       },
  //       new go.Binding("fill", "color")),
  //     $(go.TextBlock,
  //       { margin: 10, font: "bold 14px Varela Round", name: "TEXT", stroke: "white" },
  //       new go.Binding("text", "key"))
  //   );

  // node template for fully connected layer
  var fc = 
    $(go.Node, 'Vertical', 
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50, cursor: "pointer"
        },
        new go.Binding("figure", "desc"),
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { 
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366" 
        },
        new go.Binding("text", "desc"))
    );
  
  // node template for cnn
  var cnn = 
    $(go.Node, 'Vertical', 
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'Rectangle',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for lstm
  var lstm =
    $(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'MultiProcess',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for activation
  var act =
    $(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'Ellipse',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // define template map
  var templateMap = new go.Map("string", go.Node);
  templateMap.add("fc", fc);
  templateMap.add("cnn", cnn);
  templateMap.add("lstm", lstm);
  templateMap.add("act", act);
  palette.nodeTemplateMap = templateMap;

  // display shapes
  palette.model = $(go.GraphLinksModel, {
    nodeDataArray: [
      { key: "1", desc: "Fully Connected Layer", color: "#86b3d1", category: "fc" },
      { key: "2", desc: "CNN", color: "#86b3d1", category: "cnn" },
      { key: "3", desc: "LSTM", color: "#86b3d1", category: "lstm" },
      { key: "4", desc: "Activation", color: "#86b3d1", category: "act" },
    ]
  });

  // palette shape text
  // palette.add($(go.Part,
  //   { location: new go.Point(-500, 500) },
  //   $(go.TextBlock, "Fully connected layer",
  //     { font: "bold 14px Varela Round", stroke: "white" })
  // ));

  // palette shape mouse enter effect
  function mouseEnter(e, obj) {
    var shape = obj.findObject("SHAPE");
    shape.fill = "#C1D5E3";
    shape.stroke = "#4d6d9a";
    var text = obj.findObject("TEXT");
    text.stroke = "white";
  };

  // palette shape mouse leave effect
  function mouseLeave(e, obj) {
    var shape = obj.findObject("SHAPE");
    // Return the Shape's fill and stroke to the defaults
    shape.fill = obj.data.color;
    shape.stroke = "#4d6d9a";
    // Return the TextBlock's stroke to its default
    var text = obj.findObject("TEXT");
    text.stroke = "#5f6366";
  };

  // palette shape mouse click 
  var input = 0;
  var output = 0;
  var id = 0;
  function click(e, obj) {
    var cat = obj.data.category;
    switch(cat) {
      case "fc":
      case "cnn":
      case "lstm":
      case "activation":
    };
    input = prompt("Please enter input dimension: ", "100");
    output = prompt("Please enter output dimension: ", "100");
    if (input == null || input == "" || output == null || output == "") {
      alert("Please enter valid dimensions!");
    } else {
      diagram.model.addNodeData(
        { key: id++, input: "" + input, output: "" + output, disp: input + ", " + output, color: "#86b3d1", category: cat }
      )
    }
  }

}

  // enable link drawing between shapes
  // diagram.toolManager.linkingTool.temporaryLink =
  //   $(go.Link,
  //     { layerName: "Tool" },
  //     $(go.Shape,
  //       { stroke: "#999999", strokeWidth: 2, strokeDashArray: [4, 2] })
  //   );

  // var tempfromnode =
  //   $(go.Node,
  //     { layerName: "Tool" }
  //     //        $(go.Shape, "RoundedRectangle",
  //     //        { stroke: "cyan", strokeWidth: 3, fill: null,
  //     //         portId: "", width: 1, height: 1, angle: 90 })
  //   );
  // diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
  // diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

  // var temptonode =
  //   $(go.Node,
  //     { layerName: "Tool" }
  //     //        $(go.Shape, "RoundedRectangle",
  //     //        { stroke: "cyan", strokeWidth: 3, fill: null,
  //     //          portId: "", width: 1, height: 1 })
  //   );
  // diagram.toolManager.linkingTool.temporaryToNode = temptonode;
  // diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

  // // set link appearance
  // diagram.linkTemplate =
  //   $(go.Link,
  //     $(go.Shape,
  //       { strokeWidth: 2, stroke: "grey" }),  // the link shape
  //     $(go.Shape,   // the arrowhead
  //       { toArrow: "Triangle", stroke: "grey", fill: "grey" })
  //   );

  // diagram and diagram share the same template and undo manager
  // diagram.nodeTemplate = palette.nodeTemplate;
  // diagram.model.undoManager = diagram.model.undoManager;
  // diagram.model.undoManager.isEnabled = true;

  




