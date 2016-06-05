var margin = {top: 30, right: 20, bottom: 30, left: 100},
    width = 550 - margin.left - margin.right,
    height = 950;

var canvas = d3.select("#area1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g");
d3.csv("Champions.csv", function(data){
    data.columns = [{
      head: 'Year',
      cl: 'year',
      html: function(d) {
 //<onclick="whatever d.Year">
          return d.Year;
      }
    }, {
      head: '',
      cl: 'logo',
      html: function(d) {
        var func = "updateData" + d.Year + "()";  
        var returner = d.Year + ".png";
        return "<a onclick = " + func + ">" + "<img src = " + returner + ">" + "</a>";
      }
    }, {
      head: 'Champion',
      cl: 'champs',
      html: function(d) {
        return d.Champion;
      }
    }, {
      head : '',
      cl: 'crests',
      html: function(d){
        var returner = d.Champion + ".jpg";
        returner = returner.toLowerCase();
        console.log(returner);
        return "<img src=" + returner + ">";
      }
    }, {
      head : 'Golden Ball',
      cl: 'best player',
      html: function(d){
        var returner = d.GoldenBall + ".jpg";
        console.log(returner);
        return "<img src=" + returner + ">";
      }
    },
    {
        head: 'Golden Boot',
        cl: 'goal',
        html: function(d){
            var returner = d.GoldenBoot + ".jpg";
            // return d.GoldenBoot;
            return "<img src=" + returner + ">";
        }
    },
    {
        head: 'Golden Glove',
        cl: 'saves',
        html: function(d){
            var returner = d.GoldenGlove + ".jpg";
            return "<img src=" + returner + ">";
            //return d.GoldenGlove; // get image and return image
        }
        
    }];
    var table = canvas.append("foreignObject")
      .attr("width", width)
      .attr("height", height)
      .append("xhtml:body")

    table.append("table")
      // append header row
    table.append('thead').append('tr')
      .selectAll('th')
      .data(data.columns).enter()
      .append('th')
      .attr('class', function(d) {
        return d.cl;
      })
      .text(function(d) {
        return d.head;
      });

    // append body rows
    table.append('tbody')
      .selectAll('tr')
      .data(data).enter()
      .append('tr')
      .selectAll('td')
      .data(function(row, i) {
        // evaluate column objects against the current row
        return data.columns.map(function(c) {
          var cell = {};
          d3.keys(c).forEach(function(k) {
            cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
          });
          return cell;
        });
      }).enter()
      .append('td')
      .html(function(d) {
        return d.html;
      })
      .attr('class', function(d) {
        return d.cl;
      });
});
    
    
// Make tree layout    
	
var i = 0;

var tree = d3.layout.tree()
	.size([height/2, width])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2); })
;
var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#area1").append("svg")
	.attr("width", 600)
	.attr("height", height + margin.top + margin.bottom)
    .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width)
    .attr("height", height);



// Updates data dynmaically to 2014 tournament    
function updateData2014() {
    
d3.csv("2014_tree.csv", function(error, data) {
svg.selectAll("*").remove(); 
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
    
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
}




var node_distance = 90;
function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);
  nodes.forEach(function(d) { d.y = d.depth * node_distance; });

  // Declare the nodes
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + d.y + "," + d.x + ")"; })
  // add tooltip
  .on("mouseover", function(d) {
        console.log(d);
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div .html(
            "" + d.name.substring(1) + "<br/>" +
            "Total Wins:" + d.Wins 
            )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
        });

  nodeEnter.append("circle")
	  .attr("r", 10)
	  .style("fill", "#fff");
   
/*    
 nodeEnter.append("g")
          .append("svg:image")
          .attr("xlink:href","http://www.clker.com/cliparts/1/4/5/a/1331068897296558865Sitting%20Racoon.svg")
        .attr("width", 30)
    .attr("height", 30)
*/

    
    
  nodeEnter.append("text")
	  .attr("x", function(d) { 
		  return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { 
		  return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name.substring(1); })
  	  .style("fill-opacity", 1);

// add the tool tip
  var div = d3.select("#area1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);    
   
    
  // Declare the links
  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", diagonal);
    
    }
    
    
    
// 2010 tourny
    
function updateData2010() {
d3.csv("2010_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
}    
 
//2006
    
function updateData2006() {
d3.csv("2006_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
}       

    
//2002 tourny
    
//2006
    
function updateData2002() {
d3.csv("2002_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
}           

//1998 touney
    
function updateData1998() {
d3.csv("1998_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
} 
    
//1994

function updateData1994() {
d3.csv("1994_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
} 
    
//1990
    
function updateData1990() {
d3.csv("1990_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
}  
    
//1986
    
function updateData1986() {
d3.csv("1986_tree.csv", function(error, data) {
svg.selectAll("*").remove();
// *********** Convert flat data into a nice tree ***************
// create a name: node map
var dataMap = data.reduce(function(map, node) {
	map[node.name] = node;
	return map;
}, {});

// create the tree array
var treeData = [];
data.forEach(function(node) {
	// add to parent
	var parent = dataMap[node.parent];
	if (parent) {
		// create child array if it doesn't exist
		(parent.children || (parent.children = []))
			// add node to child array
			.push(node);
	} else {
		// parent is null or missing
		treeData.push(node);
	}
});

  root = treeData[0];
  update(root);
});
    
    
}               