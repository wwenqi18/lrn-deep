function init() {
    var $ = go.GraphObject.make;
    diagram = $(go.Diagram, "canvas-diagram", {
        allowDrop: true, // must be true to accept drops from the palette
        "undoManager.isEnabled": true
    });

    diagram.model = $(go.GraphLinksModel, {
        nodeDataArray: [
            {key: 1},
            {key: 2}
        ], 
        linkDataArray: [
            {from: 1, to: 2}
        ]
    });
}
