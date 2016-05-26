var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var canvas = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
d3.csv("Champions.csv", function(data){
    data.columns = [{
      head: 'Year',
      cl: 'year',
      html: function(d) {
        return d.Year;
      }
    }, {
      head: 'Champion',
      cl: 'champs',
      html: function(d) {
        return d.Champion;
      }
    }, {
      head : 'Golden Ball Winner',
      cl: 'best player',
      html: function(d){
        return d.GoldenBall;
      }
    },
    {
        head: 'Golden Boot Winner',
        cl: 'goal',
        html: function(d){
        return d.GoldenBoot;
        }
    },
    {
        head: 'Golden Glove',
        cl: 'saves',
        html: function(d){
            
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
        console.log(d);
        return d.cl;
      })
      .text(function(d) {
        console.log(d);
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
          console.log(cell);
          return cell;
        });
      }).enter()
      .append('td')
      .html(function(d) {
        return d.html;
      })
      .attr('class', function(d) {
        return d.Champion;
      });
});


    

