function init() {
  var $ = go.GraphObject.make;

  /**
   *  diagram
   */

  // define diagram
  diagram = $(go.Diagram, "canvas-diagram", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true, // must be true to accept drops from the palette
    allowMove: false,
    allowVerticalScroll: false,
    allowHorizontalScroll: true,
    layout: $(go.GridLayout)
  });

  // node template for fully connected layer
  var fcDiagram =
    $(go.Node, 'Auto',
    {
      locationSpot: go.Spot.Center
    },
      $(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp"))
    );

  // node template for cnn
  var cnnDiagram =
    $(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center
      },
      $(go.Shape, 'Rectangle',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp"))
    );

  // node template for lstm
  var lstmDiagram =
    $(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center
      },
      $(go.Shape, 'MultiProcess',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp"))
    );

  // node template for activation
  var actDiagram =
    $(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center
      },
      $(go.Shape, 'Ellipse',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp"))
    );

  // node template for residual
  var residualDiagram =
    $(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center
      },
      $(go.Shape, 'Collate',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp"))
    );

  // node template for residual
  var batchDiagram =
    $(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center
      },
      $(go.Shape, 'PaperTape',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", angle: 90, "width": 120, "height": 50, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "disp"))
    );

  // define template map
  var templateMapDiagram = new go.Map("string", go.Node);
  templateMapDiagram.add("fc", fcDiagram);
  templateMapDiagram.add("cnn", cnnDiagram);
  templateMapDiagram.add("lstm", lstmDiagram);
  templateMapDiagram.add("act", actDiagram);
  templateMapDiagram.add("res", residualDiagram);
  templateMapDiagram.add("batch", batchDiagram);
  diagram.nodeTemplateMap = templateMapDiagram;

  // set diagram grid
  //diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 25);

  // diagram supplementary text
  // diagram.add($(go.Part,
  //   { location: new go.Point(0, 0) },
  //   $(go.TextBlock, "Note",
  //     { font: "bold 14px Varela Round", stroke: "black" })
  // ));


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
        // new go.Binding("figure", "desc"),
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

  // node template for residual
  var residual =
    $(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'Collate',
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

  // node template for batch norm
  var batch =
    $(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      $(go.Shape, 'PaperTape',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", angle: 90, "width": 120, "height": 50, cursor: "pointer"
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
  templateMap.add("res", residual);
  templateMap.add("batch", batch);
  palette.nodeTemplateMap = templateMap;

  // display shapes
  palette.model = $(go.GraphLinksModel, {
    nodeDataArray: [
      { key: "1", desc: "Fully Connected Layer", color: "#86b3d1", category: "fc" },
      { key: "2", desc: "CNN", color: "#86b3d1", category: "cnn" },
      { key: "3", desc: "LSTM", color: "#86b3d1", category: "lstm" },
      { key: "4", desc: "Activation", color: "#86b3d1", category: "act" },
      { key: "5", desc: "Residual", color: "#86b3d1", category: "res" },
      { key: "6", desc: "Batch Norm", color: "#86b3d1", category: "batch" },
    ]
  });

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
  var id = 0;
  function click(e, obj) {
    var cat = obj.data.category;
    switch(cat) {
      case "fc":
        var output = prompt("Output size: ", "100");
        if (output == null) {
          alert("Please enter a valid value!");
        } else {
          diagram.model.addNodeData(
            { key: id++, output: "" + output, disp: output, color: "#86b3d1", category: cat }
          );
        }
        break;
      case "cnn":
        var kernelSize = prompt("Kernel size: ", "3");
        var inChannel = prompt("Input channels: ", 3);
        var outChannel = prompt("Output channels: ", 3);
        if (kernelSize == null || inChannel == null || outChannel == null) {
          alert("Please enter a valid value!");  
        } else {
          diagram.model.addNodeData(
            { key: id++, kernel: "" + kernelSize, in: "" + inChannel, out: "" + outChannel, 
              color: "#86b3d1", disp: inChannel + ", " + outChannel, category: cat }
          );
        }
        break;
      case "lstm":
        // check if it's the first layer
        if (diagram.model.nodeDataArray.length != 0) {
          alert("Error: LSTM must be the first layer of the network!")
        } else {
          var stateSize = prompt("State size: ", 100);
          var biDirectional = prompt("Bi-directional? Enter yes/no: ", "yes");
          if (stateSize == null || (biDirectional != "yes" && biDirectional != "no")) {
            alert("Please enter a valid value!");
          } else {
            biDirectional = "yes" ? true : false;
            diagram.model.addNodeData(
              {
                key: id++, state: "" + stateSize, bi: "" + biDirectional,
                color: "#86b3d1", disp: stateSize, category: cat
              }
            ); 
          }
        }
        break;
      case "act":
        if (diagram.model.nodeDataArray.length == 0) {
          alert("Error: Activation cannot be the first layer of the network!")  
        } else {
          var type = prompt("Activation type? Enter sigmoid/tanh/relu: ", "sigmoid");
          if (type == null || (type != "sigmoid" && type != "tanh" && type != "relu")) {
            alert("Please enter a valid value!");
          } else {
            diagram.model.addNodeData(
              {
                key: id++, type: "" + type,
                color: "#86b3d1", disp: type, category: cat
              }
            );
          }
        }
        break;
      case "res":
        if (diagram.model.nodeDataArray.length == 0) {
          alert("Error: Residual cannot be the first layer of the network!")
        } else {
          var prev = prompt("Previous layer? Enter 1/2: ", "1");
          if (prev == null || (prev != "1" && prev != "2")) {
            alert("Please enter a valid value!");
          } else {
            diagram.model.addNodeData(
              {
                key: id++, prev: "" + prev,
                color: "#86b3d1", disp: prev, category: cat
              }
            );
          }
        }
        break; 
      case "batch":
        diagram.model.addNodeData(
          {
            key: id++, color: "#86b3d1", category: cat
          });
        break;
      default: 
        break;
    };
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

  




