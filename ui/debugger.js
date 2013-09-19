function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}

function Debugger () {

	this.threads = [];
	this.frames = [];
	this.variables = [];
	this._threadsGrid = null;
	this.framesGrid = null;
	this.variablesGrid = null;

	// Attach widgets to HTML elements, eventually we should pass in just a div
	// and create the DOM tree programmaticaly
	this.createWidgets = function() {

	  	var options = {
		    enableCellNavigation: true,
		    enableColumnReorder: false,
		    forceFitColumns: true,
		    showHeaderRow: false,
		  };

	    for (var i = 0; i < 500; i++) {
	      this.threads[i] = { title: "Threads " + i };
	      this.frames[i] = { title: "Frames " + i };
	      this.variables[i] = { title: "Variables " + i };
	    }

	    this.threadsGrid = new Slick.Grid(
	    	"#threadsGrid",
	    	this.threads,
	    	[ {id: "title", name: "Thread", field: "title"} ],
	    	options);
//	    this.threadsGrid.setSelectionModel(new Slick.RowSelectionModel());

	    this.framesGrid = new Slick.Grid(
	    	"#framesGrid",
	    	this.frames,
	    	[ {id: "title", name: "Frame", field: "title"} ],
	    	options);
//		this.framesGrid.setSelectionModel(new Slick.RowSelectionModel());

	    variablesGrid = new Slick.Grid(
	    	"#variablesGrid",
	    	this.variables,
	    	[ {id: "title", name: "Variable", field: "title"} ],
	    	options);
	 };

}

$(function () {
	var rubyDebugger = new Debugger();
	rubyDebugger.createWidgets();
});
