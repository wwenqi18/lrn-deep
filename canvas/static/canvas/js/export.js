function makeBlob() {
  console.log("makeBlob() called");
  var blob = diagram.makeImageData({ background: "white", returnType: "blob", callback: myCallback });
}

function myCallback(blob) {
  console.log("myCallback() called");
  var url = window.URL.createObjectURL(blob);
  var filename = "canvas.png";

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  // IE 11
  if (window.navigator.msSaveBlob !== undefined) {
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  document.body.appendChild(a);
  requestAnimationFrame(function () {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}