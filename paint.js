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