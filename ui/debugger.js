  var threadsGrid;
  var framesGrid;
  var variablesGrid;

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
    forceFitColumns: true
  };

  $(function () {
    var threads = [];
    var frames = [];
    var variables = [];

    for (var i = 0; i < 500; i++) {
      threads[i] = { title: "Threads " + i };
      frames[i] = { title: "Frames " + i };
      variables[i] = { title: "Variables " + i };
    }

    threadsGrid = new Slick.Grid(
    	"#threadsGrid",
    	threads,
    	[ {id: "title", name: "Thread", field: "title"} ],
    	options);

    framesGrid = new Slick.Grid(
    	"#framesGrid",
    	frames,
    	[ {id: "title", name: "Frame", field: "title"} ],
    	options);

    variablesGrid = new Slick.Grid(
    	"#variablesGrid",
    	variables,
    	[ {id: "title", name: "Variable", field: "title"} ],
    	options);

  })
