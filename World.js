/*d3.csv("/Users/Octavio/Desktop/cs/cs165/World_Cup-cs165", function (data){
    var canvas = d3.select("body").append("svg")
                   .attr("width",500)
                   .attr("height", 500)
    
        canvas.selectAll("rect")
        .data(data)
        .enter()
            .append("rect")
            .attr("width", 75)
            .attr("height", 48)
            .attr("y", 75)
            .attr("fill", "blue");
    
    canvas.selectAll("rect")
        .data(data)
        .enter()
            .append("text")
            .attr("fill", "black")
            .attr("y", 75)
            .text(function (d){ return d.year;})   
})*/

d3.csv("Champions.csv", function(rows){
    
   console.log(rows); 
});


