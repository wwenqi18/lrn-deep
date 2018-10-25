function init() {
    var $ = go.GraphObject.make;
    
    // canvas diagram 
    diagram = $(go.Diagram, "canvas-diagram", {
        allowDrop: true, // must be true to accept drops from the palette
        "ExternalObjectsDropped": function(e) {
                      if (warehouse.commandHandler.canDeleteSelection() &&
                          !(warehouse.lastInput.control || warehouse.lastInput.meta)) {
                        warehouse.commandHandler.deleteSelection();
                      }
                    }
    });
    
    diagram.model = $(go.GraphLinksModel, {
//        nodeDataArray: [
//            {key: 1, category: 'first'},
//            {key: 2, category: 'second'},
//        ], 
//        linkDataArray: [
//            {from: 1, to: 2},
//            {from: 2, to: 3},
//        ]
    });
    
    
    // canvas warehouse
    warehouse = $(go.Diagram, "canvas-warehouse", {
            allowDrop: true, // must be true to accept drops from the palette
            allowDragOut: true,
             "ExternalObjectsDropped": function(e) {
                      if (diagram.commandHandler.canDeleteSelection() &&
                          !(diagram.lastInput.control || diagram.lastInput.meta)) {
                        diagram.commandHandler.deleteSelection();
                      }
                    }
    });
    
    warehouse.model = $(go.GraphLinksModel, {
        nodeDataArray: [
            {key: 1, category: "first"},
        ]    
    });
    
    warehouse.nodeTemplate = $(go.Node, 'Auto', $(go.Shape, 'Trapezoid'));
    
    // diagram and warehouse share the same template and undo manager
    diagram.nodeTemplate = warehouse.nodeTemplate;
    diagram.model.undoManager = warehouse.model.undoManager;
    diagram.model.undoManager.isEnabled = true;
    
    // canvas palette
    palette = $(go.Diagram, "canvas-palette", {
            allowDrop: true, // must be true to accept drops from the palette
            "undoManager.isEnabled": true
    });
    
    palette.model = $(go.GraphLinksModel, {
        nodeDataArray: [
            {key: 1, category: "first"},
        ]    
    });
    
    palette.nodeTemplate = $(go.Node, 'Auto', $(go.Shape, 'Trapezoid'));
    
}




