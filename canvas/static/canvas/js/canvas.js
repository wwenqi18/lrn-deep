function init() {
  var $ = go.GraphObject.make;

  // diagram
  diagram = $(go.Diagram, "canvas-diagram", {
    allowDrop: true, // must be true to accept drops from the palette
    allowDragOut: true,
    allowVerticalScroll: false,
    allowHorizontalScroll: true,
    // "ExternalObjectsDropped": function (e) {
    //   if (diagram.commandHandler.canDeleteSelection() &&
    //     !(diagram.lastInput.control || diagram.lastInput.meta)) {
    //     diagram.commandHandler.deleteSelection();
    //   }
    // },
    // layout: $(go.GridLayout)
  });

  diagram.nodeTemplate = $(go.Node, 'Auto',
    $(go.Shape, 'Trapezoid',
      {
        "fill": "#999999",
        "stroke": "grey",
        "strokeWidth": 2,
        "angle": 90,
        "width": 120,
        "height": 50,
        portId: "",
        fromLinkable: true, toLinkable: true,
        //cursor: "pointer" 
      }),
    $(go.TextBlock,
      {
        margin: 10, angle: 90,
        font: "14px Varela Round", stroke: "white"
      },
      new go.Binding("text", "disp"))
  );

  // set diagram grid
  //diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 25);

  // enable link drawing between shapes
  diagram.toolManager.linkingTool.temporaryLink =
    $(go.Link,
      { layerName: "Tool" },
      $(go.Shape,
        { stroke: "#999999", strokeWidth: 2, strokeDashArray: [4, 2] })
    );

  var tempfromnode =
    $(go.Node,
      { layerName: "Tool" }
      //        $(go.Shape, "RoundedRectangle",
      //        { stroke: "cyan", strokeWidth: 3, fill: null,
      //         portId: "", width: 1, height: 1, angle: 90 })
    );
  diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
  diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

  var temptonode =
    $(go.Node,
      { layerName: "Tool" }
      //        $(go.Shape, "RoundedRectangle",
      //        { stroke: "cyan", strokeWidth: 3, fill: null,
      //          portId: "", width: 1, height: 1 })
    );
  diagram.toolManager.linkingTool.temporaryToNode = temptonode;
  diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

  // set link appearance
  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape,
        { strokeWidth: 2, stroke: "grey" }),  // the link shape
      $(go.Shape,   // the arrowhead
        { toArrow: "Triangle", stroke: "grey", fill: "grey" })
    );

  // diagram and diagram share the same template and undo manager
  // diagram.nodeTemplate = palette.nodeTemplate;
  // diagram.model.undoManager = diagram.model.undoManager;
  // diagram.model.undoManager.isEnabled = true;


  // palette
  // palette
  function mouseEnter(e, obj) {
    var shape = obj.findObject("SHAPE");
    shape.fill = "#C1D5E3";
    shape.stroke = null;
    var text = obj.findObject("TEXT");
    text.stroke = "#5f6366";
  };

  function mouseLeave(e, obj) {
    var shape = obj.findObject("SHAPE");
    // Return the Shape's fill and stroke to the defaults
    shape.fill = obj.data.color;
    shape.stroke = null;
    // Return the TextBlock's stroke to its default
    var text = obj.findObject("TEXT");
    text.stroke = "white";
  };

  var input = 0;
  var output = 0;
  var id = 0;
  function click() {
    var txt;
    input = prompt("Please enter input dimension: ", "100");
    output = prompt("Please enter output dimension: ", "100");
    if (input == null || input == "" || output == null || output == "") {
      alert("Please enter valid dimensions!");
    } else {
      id += 1;
      //diagram.model.addNodeData({key: input+", "+output, category: ""+output})
      diagram.model.addNodeData({ key: id, input: "" + input, output: "" + output, disp: input + ", " + output })
    }
    obj.findObject("SHAPE").innerHTML = txt;
  }

  palette = $(go.Diagram, "canvas-palette", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true, // must be true to accept drops from the palette
    allowVerticalScroll: false,
    allowHorizontalScroll: false,
    "undoManager.isEnabled": true,
  });

  palette.model = $(go.GraphLinksModel, {
    nodeDataArray: [
      { key: "add", color: "#86b3d1" },
    ]
  });

  palette.nodeTemplate =
    $(go.Node, 'Auto', {
      mouseEnter: mouseEnter,
      mouseLeave: mouseLeave,
      click: click
    },
      $(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50,
          cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { margin: 10, font: "bold 14px Varela Round", name: "TEXT", stroke: "white" },
        new go.Binding("text", "key"))
    );

  palette.isReadOnly = true;

  palette.add($(go.Part,
    { location: new go.Point(-40, 140) },
    $(go.TextBlock, "Fully connected layer",
      { font: "bold 14px Varela Round", stroke: "white" })
  ));

}




