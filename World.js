var margin = {top: 30, right: 20, bottom: 30, left: 10},
    width = 1000 - margin.left - margin.right,
   // height = 500 - margin.top - margin.bottom;
    height = 950;

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
      head : '',
      cl: 'flag',
      html: function(d){
        var returner = d.Champion + ".jpg";
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


    

