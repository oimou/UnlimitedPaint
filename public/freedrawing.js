(function() {
  var $ = function(id){return document.getElementById(id)};

  var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true
  });

  fabric.Object.prototype.transparentCorners = false;

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.shadowBlur = 0;
  }

  canvas.on("path:created", function () {
	  var svg = canvas.toSVG();
	  var $lastPath = jQuery(svg).find("path").last();
	  var lastPath = $lastPath.attr("d");

	  lastPath.match(/^M ([\d\.]+) ([\d\.]+) /);
	  var from = [+RegExp.$1, +RegExp.$2];
	  lastPath.match(/L ([\d\.]+) ([\d\.]+)$/);
	  var to = [+RegExp.$1, +RegExp.$2];

	  draw({
		  from: from,
		  to: to
	  });
  });
})();
