function init() {
  $("#fcdialog").dialog({
    autoOpen: false,
    title: "Add component: Fully Connected Layer"
  });

  $("#fcdialog-btn").click(function () {
    var inputOutputSize = document.getElementById("fc_output_size");
    var output = inputOutputSize.value;
    if (output == null || output == "") {
      alert("Please enter a valid value!");
    } else {
      diagram.model.addNodeData(
        { key: id++, output_size: "" + output, disp: output, color: "#86b3d1", category: "fc",
          tooltip: "Fully Connected\n" + "output size: " + output }
      );
      // Clear inputs
      inputOutputSize.value = "";
      $("#fcdialog").dialog("close");
    }
  }); // End fcdialog-btn click

  $("#cnndialog").dialog({
    autoOpen: false,
    title: "Add component: CNN"
  });

  $("#cnndialog-btn").click(function () {
    var inputKernelSize = document.getElementById("cnn_kernel_size");
    var inputOutChannel = document.getElementById("cnn_out_channels");
    var kernelSize = inputKernelSize.value;
    var outChannel = inputOutChannel.value;
    if (kernelSize == null || outChannel == null || kernelSize == "" || outChannel == "") {
      alert("Please enter a valid value!");  
    } else {
      diagram.model.addNodeData(
        { key: id++, kernel_size: "" + kernelSize, out_channels: "" + outChannel, 
          color: "#86b3d1", disp: outChannel, category: "cnn", 
          tooltip: "CNN\n" + "kernel size: [" + kernelSize + ", " + kernelSize + "]\n output channels: " + outChannel }
      );
      // Clear inputs
      inputKernelSize.value = "";
      inputOutChannel.value = "";
      $("#cnndialog").dialog("close");
    }
  }); // End cnndialog-btn click

  $("#lstmdialog").dialog({
    autoOpen: false,
    title: "Add component: LSTM"
  });

  $("#lstmdialog-btn").click(function () {
    var inputStateSize = document.getElementById("lstm_state_size");
    var stateSize = inputStateSize.value;
    var biDirectional = $("input[name='bidirectional']:checked").value;
    if (stateSize == null || stateSize == "") {
      alert("Please enter a valid value!");  
    } else {
      biDirectional = "Yes" ? true : false;
      diagram.model.addNodeData(
        {
          key: id++, state_size: "" + stateSize, bi_directional: "" + biDirectional,
          color: "#86b3d1", disp: stateSize, category: "lstm",
          tooltip: "LSTM\n" + "state size: " + stateSize + "\n bi-directional: " + biDirectional
        }
      );
      // Clear inputs
      inputStateSize.value = "";
      $("#lstmdialog").dialog("close");
    }
  }); // End lstmdialog-btn click

  $("#actdialog").dialog({
    autoOpen: false,
    title: "Add component: Activation Layer"
  });

  $("#actdialog-btn").click(function () {
    // find current selected graph
    type = $("#select-act-type").find("option:selected").text();
    if (type == null || (type != "sigmoid" && type != "tanh" && type != "relu")) {
      alert("Please enter a valid value!");  
    } else {
      diagram.model.addNodeData(
        {
          key: id++, type: "" + type,
          color: "#86b3d1", disp: type, category: "act",
          tooltip: "Activation\n" + "type: " + type
        }
      );
      $("#actdialog").dialog("close");
    }
  }); // End actdialog-btn click

  $("#maxpooldialog").dialog({
    autoOpen: false,
    title: "Add component: Max Pooling 2D"
  });

  $("#maxpooldialog-btn").click(function () {
    var inputPoolSize = document.getElementById("maxpool_pool_size");
    var size = inputPoolSize.value;
    if (size == null || size == "") {
      alert("Please enter a valid value!");
    } else {
      diagram.model.addNodeData(
        {
          key: id++, pool_size: "" + size,
          color: "#86b3d1", disp: size, category: "maxpool",
          tooltip: "Max Pooling 2D\n" + "pool size: [" + size + ", " + size + "]"
        }
      );
      // Clear inputs
      inputPoolSize.value = "";
      $("#maxpooldialog").dialog("close");
    }
  }); // End maxpooldialog-btn click

  var goo = go.GraphObject.make;

  /**
   *  diagram
   */

  // define diagram
  diagram = goo(go.Diagram, "canvas-diagram", {
    initialContentAlignment: go.Spot.MiddleLeft,
    allowDrop: true, // must be true to accept drops from the palette
    allowMove: false,
    allowVerticalScroll: true,
    allowHorizontalScroll: true,
    layout: goo(go.GridLayout)
  });

  // diagram.model.nodeKeyProperty = function (nodeData, id) {
  //   id && (nodeData.id = id);// enabling it will fix the issue.
  //   return nodeData.id;
  // };

  // node template for fully connected layer
  var fcDiagram =
    goo(go.Node, 'Auto',
    {
      locationSpot: go.Spot.Center,
      mouseEnter: mouseEnter,
      mouseLeave: mouseLeave,
    },
      goo(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // node template for cnn
  var cnnDiagram =
    goo(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
      },
      goo(go.Shape, 'Rectangle',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // node template for lstm
  var lstmDiagram =
    goo(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
      },
      goo(go.Shape, 'MultiProcess',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // node template for activation
  var actDiagram =
    goo(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
      },
      goo(go.Shape, 'Ellipse',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // node template for residual
  // var residualDiagram =
  //   goo(go.Node, 'Auto',
  //     {
  //       locationSpot: go.Spot.Center,
  //       mouseEnter: mouseEnter,
  //       mouseLeave: mouseLeave,
  //     },
  //     goo(go.Shape, 'Collate',
  //       {
  //         "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
  //       },
  //       new go.Binding("fill", "color")),
  //     goo(go.TextBlock,
  //       {
  //         margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
  //       },
  //       new go.Binding("text", "disp")),
  //     {
  //       toolTip:  // define a tooltip for each node that displays the color as text
  //         goo(go.Adornment, "Auto",
  //           goo(go.Shape, { fill: "white" }),
  //           goo(go.TextBlock, { margin: 4 },
  //             new go.Binding("text", "tooltip"))
  //         )  // end of Adornment
  //     }
  //   );

  // node template for batch norm
  var batchDiagram =
    goo(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
      },
      goo(go.Shape, 'PaperTape',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", angle: 90, "width": 120, "height": 50
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // node template for max pooling 2d
  var maxpoolDiagram =
    goo(go.Node, 'Auto',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
      },
      goo(go.Shape, 'SquareArrow',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366", angle: 90
        },
        new go.Binding("text", "disp")),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
          goo(go.Adornment, "Auto",
            goo(go.Shape, { fill: "white" }),
            goo(go.TextBlock, { margin: 4 },
              new go.Binding("text", "tooltip"))
          )  // end of Adornment
      }
    );

  // define template map
  var templateMapDiagram = new go.Map("string", go.Node);
  templateMapDiagram.add("fc", fcDiagram);
  templateMapDiagram.add("cnn", cnnDiagram);
  templateMapDiagram.add("lstm", lstmDiagram);
  templateMapDiagram.add("act", actDiagram);
  // templateMapDiagram.add("res", residualDiagram);
  templateMapDiagram.add("batch", batchDiagram);
  templateMapDiagram.add("maxpool", maxpoolDiagram);
  diagram.nodeTemplateMap = templateMapDiagram;

  // set diagram grid
  //diagram.grid.visible = true;
  diagram.toolManager.draggingTool.isGridSnapEnabled = true;
  diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 25);

  // diagram supplementary text
  // diagram.add(goo(go.Part,
  //   { location: new go.Point(0, 0) },
  //   goo(go.TextBlock, "Note",
  //     { font: "bold 14px Varela Round", stroke: "black" })
  // ));


  /**
   *  palette
   */

  // define palette
  palette = goo(go.Diagram, "canvas-palette", {
    initialContentAlignment: go.Spot.Center,
    allowDrop: true, // must be true to accept drops from the palette
    allowVerticalScroll: false,
    allowHorizontalScroll: false,
    isReadOnly: true,
    "undoManager.isEnabled": true,
    layout: goo(go.GridLayout),
    padding: new go.Margin(10, 5, 5, 5)
  });

  // node template for fully connected layer
  var fc = 
    goo(go.Node, 'Vertical', 
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'Trapezoid',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "angle": 90, "width": 120, "height": 50, cursor: "pointer"
        },
        // new go.Binding("figure", "desc"),
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        { 
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366" 
        },
        new go.Binding("text", "desc"))
    );
  
  // node template for cnn
  var cnn = 
    goo(go.Node, 'Vertical', 
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'Rectangle',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for lstm
  var lstm =
    goo(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'MultiProcess',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for activation
  var act =
    goo(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'Ellipse',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );

  // node template for residual
  // var residual =
  //   goo(go.Node, 'Vertical',
  //     {
  //       locationSpot: go.Spot.Center,
  //       mouseEnter: mouseEnter,
  //       mouseLeave: mouseLeave,
  //       click: click
  //     },
  //     goo(go.Shape, 'Collate',
  //       {
  //         "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
  //       },
  //       new go.Binding("fill", "color")),
  //     goo(go.TextBlock,
  //       {
  //         margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
  //       },
  //       new go.Binding("text", "desc"))
  //   );

  // node template for batch norm
  var batch =
    goo(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'PaperTape',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", angle: 90, "width": 120, "height": 50, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
        {
          margin: 5, font: "bold 14px Varela Round", name: "TEXT", stroke: "#5f6366"
        },
        new go.Binding("text", "desc"))
    );


  // node template for max pooling 2d
  var maxpool =
    goo(go.Node, 'Vertical',
      {
        locationSpot: go.Spot.Center,
        mouseEnter: mouseEnter,
        mouseLeave: mouseLeave,
        click: click
      },
      goo(go.Shape, 'SquareArrow',
        {
          "name": "SHAPE", "stroke": "#4d6d9a", "width": 50, "height": 120, cursor: "pointer"
        },
        new go.Binding("fill", "color")),
      goo(go.TextBlock,
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
  // templateMap.add("res", residual);
  templateMap.add("batch", batch);
  templateMap.add("maxpool", maxpool);
  palette.nodeTemplateMap = templateMap;

  // display shapes
  palette.model = goo(go.GraphLinksModel, {
    nodeDataArray: [
      { key: "1", desc: "Fully Connected", color: "#86b3d1", category: "fc" },
      { key: "2", desc: "CNN", color: "#86b3d1", category: "cnn" },
      { key: "3", desc: "LSTM", color: "#86b3d1", category: "lstm" },
      { key: "4", desc: "Activation", color: "#86b3d1", category: "act" },
      // { key: "5", desc: "Residual", color: "#86b3d1", category: "res" },
      { key: "6", desc: "Batch Norm", color: "#86b3d1", category: "batch" },
      { key: "7", desc: "Max Pooling 2D", color: "#86b3d1", category: "maxpool" },
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

      // fully connected layer
      case "fc":
        $("#fcdialog").dialog("open");
        $("#fcdialog-btn").button();
        // var output = prompt("Output size: ", "100");
        // if (output == null) {
        //   alert("Please enter a valid value!");
        // } else {
        //   diagram.model.addNodeData(
        //     { key: id++, output_size: "" + output, disp: output, color: "#86b3d1", category: cat,
        //       tooltip: "Fully Connected\n" + "output size: " + output }
        //   );
        // }
        break;

      // CNN
      case "cnn":
        $("#cnndialog").dialog("open");
        $("#cnndialog-btn").button();
        // var kernelSize = prompt("Kernel size: ", "3");
        // var inChannel = prompt("Input channels: ", 3);
        // var outChannel = prompt("Output channels: ", 3);
        // if (kernelSize == null || outChannel == null) {
        //   alert("Please enter a valid value!");  
        // } else {
        //   diagram.model.addNodeData(
        //     { key: id++, kernel_size: "" + kernelSize, out_channels: "" + outChannel, 
        //       color: "#86b3d1", disp: outChannel, category: cat, 
        //       tooltip: "CNN\n" + "kernel size: [" + kernelSize + ", " + kernelSize + "]\n output channels: " + outChannel }
        //   );
        // }
        break;

      // LSTM
      case "lstm":
        // check if it's the first layer
        $("#lstmdialog").dialog("open");
        $("#bidirectional-yes").checkboxradio();
        $("#bidirectional-no").checkboxradio();
        $("#lstmdialog-btn").button();
        // var stateSize = prompt("State size: ", 100);
        // var biDirectional = prompt("Bi-directional? Enter yes/no: ", "yes");
        // if (stateSize == null || (biDirectional != "yes" && biDirectional != "no")) {
        //   alert("Please enter a valid value!");
        // } else {
        //   biDirectional = "yes" ? true : false;
        //   diagram.model.addNodeData(
        //     {
        //       key: id++, state_size: "" + stateSize, bi_directional: "" + biDirectional,
        //       color: "#86b3d1", disp: stateSize, category: cat,
        //       tooltip: "LSTM\n" + "state size: " + stateSize + "\n bi-directional: " + biDirectional
        //     }
        //   ); 
        // }
        break;
      
      // Activation
      case "act":
        if (diagram.model.nodeDataArray.length == 0) {
          alert("Error: Activation cannot be the first layer of the network!")  
        } else {
          $("#actdialog").dialog("open");
          $("#select-act-type").selectmenu();
          $("#actdialog-btn").button();
          // var type = prompt("Activation type? Enter sigmoid/tanh/relu: ", "sigmoid");
          // if (type == null || (type != "sigmoid" && type != "tanh" && type != "relu")) {
          //   alert("Please enter a valid value!");
          // } else {
          //   diagram.model.addNodeData(
          //     {
          //       key: id++, type: "" + type,
          //       color: "#86b3d1", disp: type, category: cat,
          //       tooltip: "Activation\n" + "type: " + type
          //     }
          //   );
          // }
        }
        break;
      
      // Residual
      // case "res":
      //   if (diagram.model.nodeDataArray.length == 0) {
      //     alert("Error: Residual cannot be the first layer of the network!")
      //   } else {
      //     var prev = prompt("Previous layer? Enter 1/2: ", "1");
      //     if (prev == null || (prev != "1" && prev != "2")) {
      //       alert("Please enter a valid value!");
      //     } else {
      //       diagram.model.addNodeData(
      //         {
      //           key: id++, prev_layer: "" + prev,
      //           color: "#86b3d1", disp: prev, category: cat,
      //           tooltip: "Residual\n" + "previous layer: " + prev
      //         }
      //       );
      //     }
      //   }
      //   break; 
      
      // Batch Norm
      case "batch":
        diagram.model.addNodeData(
          {
            key: id++, color: "#86b3d1", category: cat,
            tooltip: "Batch Norm"
          });
        break;
      
      // Max Pooling 2D
      case "maxpool":
        var arr = diagram.model.nodeDataArray;
        if (arr.length > 0) {
          var node = arr[arr.length - 1];
          console.log(arr);
          console.log(node);
          if (node["category"] !== "cnn") {
            alert("Error: Max Pooling 2D should always follow a CNN layer!");
          }
          else {
            $("#maxpooldialog").dialog("open");
            $("#maxpooldialog-btn").button();
            // var size = prompt("Pool size: ", "2");
            // if (size == null || size == "") {
            //   alert("Please enter a valid value!");  
            // } else {
            //   diagram.model.addNodeData(
            //     {
            //       key: id++, pool_size: "" + size,
            //       color: "#86b3d1", disp: size, category: cat,
            //       tooltip: "Max Pooling 2D\n" + "pool size: [" + size + ", " + size + "]"
            //     }
            //   );
            // }
          }
        } else {
          alert("Error: Max Pooling 2D should always follow a CNN layer!");  
        }

      default: 
        break;
    };
  }

}

// enable link drawing between shapes
// diagram.toolManager.linkingTool.temporaryLink =
//   goo(go.Link,
//     { layerName: "Tool" },
//     goo(go.Shape,
//       { stroke: "#999999", strokeWidth: 2, strokeDashArray: [4, 2] })
//   );

// var tempfromnode =
//   goo(go.Node,
//     { layerName: "Tool" }
//     //        goo(go.Shape, "RoundedRectangle",
//     //        { stroke: "cyan", strokeWidth: 3, fill: null,
//     //         portId: "", width: 1, height: 1, angle: 90 })
//   );
// diagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
// diagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;

// var temptonode =
//   goo(go.Node,
//     { layerName: "Tool" }
//     //        goo(go.Shape, "RoundedRectangle",
//     //        { stroke: "cyan", strokeWidth: 3, fill: null,
//     //          portId: "", width: 1, height: 1 })
//   );
// diagram.toolManager.linkingTool.temporaryToNode = temptonode;
// diagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

// // set link appearance
// diagram.linkTemplate =
//   goo(go.Link,
//     goo(go.Shape,
//       { strokeWidth: 2, stroke: "grey" }),  // the link shape
//     goo(go.Shape,   // the arrowhead
//       { toArrow: "Triangle", stroke: "grey", fill: "grey" })
//   );

  




