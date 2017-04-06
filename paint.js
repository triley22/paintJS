//Paint Program Chapter 19 Eloquent Javascript

//helper function, creates an element with given name and attributes
//and appends all further arguments it gets as child nodes, automatically
//converting strings to text nodes

//this function allows easy creation of elements

function elt(name, attributes) {
	var node = document.createElement(name);
	if (attributes) {
		for (var attr in attributes)
			if (attributes.hasOwnProperty(attr))
				node.setAttribute(attr, attributes[attr]);
	}
	for (var i = 2; i < arguments.length; i++) {
		var child = arguments[i];
		if (typeof child == "string")
			child = document.createTextNode(child);
		node.appendChild(child);
	}
	return node;
}

//Foundation

//core of program is the createPaint function, appends the paint interface
//to the DOM element as an argument 

//define object called controls, which will hold functions to initialize the various controls below the image

var controls = Object.create(null);

function createPaint(parent) {
	var canvas = elt("canvas", {width: 500, height: 300});
	var cx = canvas.getContext("2d");
	var toolbar = elt("div", {class: "toolbar"});
	for (var name in controls)
		toolbar.appendChild(controls[name](cx));

	var panel = elt("div", {class: "picturepanel"}, canvas);
	parent.appendChild(elt("div", null, panel, toolbar));
}

//Tool Selection

//as with controls, object to collect various tools and add more later

var tools = Object.create(null);

controls.tool = function(cx) {
	var select = elt("select");
	for (var name in tools)
		select.appendChild(elt("option", null, name));

	cx.canvas.addEventListener("mousedown", function(event) {
		if (event.which == 1) {
			tools[select.value](event, cx);
			event.preventDefault();
		}
	});

	return elt("span", null, "Tool: ", select);
};

//clientX and clientY properties on mouse events are also relative to top-left corner

function relativePos(event, element) {
	var rect = element.getBoundingClientRect();
	return {x: Math.floor(event.clientX - rect.left),
					y: Math.floor(event.clientY - rect.top)};
}

//function takes two arguments
//one calls for each mousemove event and other when released

function trackDrag(onMove, onEnd) {
	function end(event) {
		removeEventListener("mousemove", onMove);
		removeEventListener("mouseup", end);
		if (onEnd)
			oneEnd(event);
	}
	addEventListener("mousemove", onMove);
	addEventListener("mouseup", end);
}


//line tool uses two helpers to do the actual drawing
//"mousemove" line segment is drawn between the mouse's old and new position

tools.Line = function(event, cx, onEnd) {		//lineCap property to round instead of square
	cx.lineCap = "round";											//trick to make sure separate lines look like a single coherent line

	var pos = relativePos(event, cx.canvas);
	trackDrag(function(event) {
		cx.beginPath();
		cx.moveTo(pos.x, pos.y);
		pos = relativePos(event, cx.canvas);
		cx.lineTo(pos.x, pos.y);
		cx.stroke();
	}, onEnd);
};

//globalCompositeOperation property influences drawing operations on a canvas change
//change the color of the pixels they touch

tools.Erase = function(event, cx) {
	cx.globalCompositeOperation = "destination-out";
	tools.Line(event, cx, function() {
		cx.globalCompositeOperation = "source-over";
	});
};

//Colors and Brush Size

controls.color = function(cx) {
	var input = elt("input", {type: "color"});
	input.addEventListener("change", function() {
		cx.fillStyle = input.value;
		cx.strokeStyle = input.value;
	});
	return elt("span", null, "Color: ", input);
};

//code generates options from an array of brush sizes, lineWidth updates when brush size is chosen

contols.brushSize = function(cx) {
	var select = elt("select");
	var sizes = [1, 2, 3, 5, 8, 12, 25, 35, 50, 75, 100];
	sizes.forEach(function(size) {
		select.appendChild(elet("option", {value: size}, size + " pixels"));
	});
	select.addEventListener("change", function() {
		cx.lineWidth = select.value;
	});
	return elt("span", null, "Brush size: ", select);
};

























