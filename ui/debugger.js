
function Debugger () {

	this.threads = [];
	this.frames = [];
	this.variables = [];

	// Attach widgets to HTML elements, eventually we should pass in just a div
	// and create the DOM tree programmaticaly
	this.createWidgets = function() 
	{
    var _this = this;

    var options = {
      enableCellNavigation: true,
      enableColumnReorder: false,
      forceFitColumns: true,
      showHeaderRow: false,
    };

    this.threadsGrid = new Slick.Grid(
      "#threadsGrid",
      this.threads,
      [ {id: "title", name: "Thread", field: "title"} ],
      {
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns: true,
        showHeaderRow: false,
        multiSelect: false,
      }
    );
    this.threadsGrid.setSelectionModel(new Slick.RowSelectionModel());

    this.framesGrid = new Slick.Grid(
      "#framesGrid",
      this.frames,
      [ {id: "title", name: "Frame", field: "title"} ],
      {
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns: true,
        showHeaderRow: false,
        multiSelect: false,
      }
    );
    this.framesGrid.setSelectionModel(new Slick.RowSelectionModel());

    this.variablesGrid = new Slick.Grid(
      "#variablesGrid",
      this.variables,
      [ {id: "title", name: "Variable", field: "title"} ],
      {
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns: true,
        showHeaderRow: false,
      }
    );
    this.variablesGrid.setSelectionModel(new Slick.RowSelectionModel());

    this.methodTextView = orion.editor.edit({parent: "methodText"});
    this.variablesTextView = orion.editor.edit({parent: "variablesText"});

    // register handlers for thread change
    var _this = this;
    this.threadsGrid.onSelectedRowsChanged.subscribe(function (e) {
      _this.updateStackFrames([0]);
      _this.updateVariables();
    });

  	// register handlers for frame change
    this.framesGrid.onSelectedRowsChanged.subscribe(function (e) {
      var selection = _this.framesGrid.getSelectedRows();
      if (selection.length == 1) {
        $debugInterface.selectFrame(
            selection[0],
            function (data) {
              _this.updateVariables();
              _this.updateSource();
            }
          );
      } else {
        _this.updateVariables();
        _this.updateSource();        
      }
    });

  	// register handlers for variable change
    this.variablesGrid.onSelectedRowsChanged.subscribe(function (e) {
      _this.updateVariablesText();
    });

  };

  // Helper to return the selected thread (may be null)
  this.getSelectedThread = function() {
    var selection = this.threadsGrid.getSelectedRows();
    if (selection.length == 0) 
      return null;
    return this.threads[selection[0]];
  }

  // Helper to return the selected method (may be null)
  this.getSelectedFrame = function() {
    var selection = this.framesGrid.getSelectedRows();
    if (selection.length == 0) 
      return null;
    return this.frames[selection[0]];
  }

  // Helper to return the selected method (may be null)
  this.getSelectedVariables = function() {
    var selection = this.variablesGrid.getSelectedRows();
    var result = [];
    for (var i=0; i < selection.length; i++) {
      result[i] = this.variables[i];
    }
    return result;
  }

  // Update stack frames from the currently selected thread
  var _this = this;
  this.updateThreads = function() {
    $debugInterface.getThreads( function(replyData) {
      _this.threads = [];
      for (var i = 0; i < replyData.length; i++) {
        var threadInfo = { "title": replyData[i] };
       _this.threads[i] = threadInfo;
      }
      _this.threadsGrid.setData(_this.threads);
      _this.threadsGrid.setSelectedRows([]);
      _this.threadsGrid.invalidate();
    });
  }

  // Update stack frames from the currently selected thread
  this.updateStackFrames = function( newSelection ) {
    var selectedRows = _this.threadsGrid.getSelectedRows();
    var threadNumber = selectedRows[0];

    this.frames = [];
    $debugInterface.getFrames( function(replyData) {
      for (var i = 0; i < replyData.length; i++) {
        var info = { "title": replyData[i] };
       _this.frames[i] = info;
      }
      _this.framesGrid.setData(_this.frames, true);

      var selection = newSelection || [];
      _this.framesGrid.setSelectedRows(selection);
      _this.framesGrid.invalidate();
    });
  }

  // Update update variables for the currently selected method
  this.updateVariables = function() {
    this.variables = [];
    var selectedFrame = this.getSelectedFrame();

    if (null != selectedFrame) {
      for (var i = 0; i < 500; i++) {
       this.variables[i] = { title: selectedFrame.title + "-var-" + i };
      }
    }

   this.variablesGrid.setData(this.variables, true);
   this.variablesGrid.setSelectedRows([]);
   this.variablesGrid.invalidate();
   console.log("updateVariables");
 }

  // Update update source for the currently selected method
  this.updateSource = function() {

    $debugInterface.getSource( function (data) {
      var newText = "";
      for (var i=0; i < data.length; i++) {
        newText += data[i];
      }
      _this.methodTextView.setText(newText);
    });
  }

  // Update update source for the currently selected method
  this.updateVariablesText = function() {
    var text = ""
    var selection = this.getSelectedVariables();
    for (var i=0; i < selection.length; i++) {
      text += selection[i]
      text += "\n"
    }
    this.variablesTextView.setText(text);
    console.log("updateVariablesText");
  }

  // Step into the next method
  this.stepInto = function() {
    $debugInterface.genericCommand('step', function(data) {
      _this.updateStackFrames([0]);
    });
  }

  // Step into the next method
  this.stepOver = function() {
    $debugInterface.genericCommand('next', function(data) {
      _this.updateStackFrames([0]);
    });
  }

  // Step into the next method
  this.restart = function() {
    alert("this will restart the session and spawn an new page")
    $debugInterface.genericCommand('restart', function(data) {
      open(location, '_self').close();
    });
  }

	// Force a repaint to deal with SlickGrid issues
	this.resizeCanvas = function() {
   this.threadsGrid.resizeCanvas();
   this.variablesGrid.resizeCanvas();
   this.framesGrid.resizeCanvas();	
  };

  // Automatically select to make life easier
  this.setInitialSelection = function() {
    if (0 == this.threads.length) {
      return;
    }
    this.threadsGrid.setSelectedRows([0]);
  };

}

$(function () {
	var rubyDebugger = new Debugger();
	window.rubyDebugger = rubyDebugger;

	rubyDebugger.createWidgets();
  rubyDebugger.setInitialSelection();

	$(window).resize(function() {
		rubyDebugger.resizeCanvas();
});
});
