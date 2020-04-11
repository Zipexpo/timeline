


var svgWidth = 1000;
var svgHeight = 400;
var x = d3.scaleTime();
var margin = ({top: 100, right: 50, bottom: 10, left: 200});
var colors =d3.schemeCategory10;
$(document).ready(function () {
    main();
    legendmaker();
});
var startDate = "Aug 1 2019";
var endDate = new Date();
function main(){
    d3.queue()
    // .defer(d3.json,"src/data/twittwaterv2.json")
        .defer(d3.json,"src/data/data.json")
        .await(ready);
}
function ready (error, data) {
    //spinner = new Spinner(opts).spin(document.getElementById('timelinewImg'));
    if (error) throw error;

    y= d3.scaleBand()
        .domain(data.map(d=>d.name))
        .range([0, svgHeight-margin.top-margin.bottom])
        .padding(0.1);
    smals = y.bandwidth();
    var numDays = Math.floor((new Date(endDate) - new Date(startDate))/1000/60/60/24);
    svgWidth = smals*numDays;
    x.domain([new Date(startDate),new Date(endDate)]).range([0, svgWidth - margin.right-margin.left]);
    var timeline = d3.select("#table").append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var timeline_axis = d3.select("#table_axis").append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    shadowdrop(timeline);
    var svg = timeline.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id","areaplot");
    timeline_axis_g = timeline_axis.append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g").attr("class","axisg");

    var svgaxis = svg.append("g").attr("class","axisg");
    var stackg = svg.selectAll(".stackg")
        .data(data,d=>d.timeline)
        .enter().append("g")
        .attr("class","stackg")
        .attr("transform",(d,i)=> "translate(" + 0 + "," + y(d.name) + ")");
    var keys = data.map(d=>d.name);
    stackg.selectAll(".timearea")
        .data(d => d.timeline)
        .enter().append("rect")
        .attr("class",'timearea')
      .attr("fill", (d, i) => colors[0])
        .attr("x", (d, i) => x(new Date(d.start)))
        .attr("y", (d,i) => 0)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", d => x(new Date(d.end)) - x(new Date(d.start)))
        .attr("height", y.bandwidth());
    mil = stackg.selectAll(".milestone")
        .data(d => d.milestone)
        .enter().append('g').attr("class",'milestone')
        .attr("transform",(d,i)=> "translate(" + x(new Date(d)) + "," + smals/2 + ")");
    mil.append("circle")
        .style("fill", 'none')
        .style("stroke", colors[1])
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", smals/2)
        .style("filter", "url(#glow)");
    mil.append("circle")
        .style("fill", colors[1])
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", smals/4)
        .style("filter", "url(#glow)");
        // .attr("x", (d, i) => (x(new Date(d))- (y.bandwidth()/2)))
        // .attr("y", (y.bandwidth()/2))
        // .attr("width", y.bandwidth())
        // .attr("height", y.bandwidth())
        // .attr("transform",d=> "rotate(-45 "+(x(new Date(d))- (y.bandwidth()/2))+" "+(y.bandwidth()/2)+")");

    svgaxis.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisTop(x)
            .tickFormat(d3.timeFormat("%d %b, %Y"))
            .ticks(d3.timeMonday.every(1)))
        .selectAll("text")
        //.attr("transform", "rotate(-40)")
        .style("text-anchor", "start")
        .style("transform", "rotate(-15deg)")
        .attr("dx", ".8em")
        .attr("dy", "-.15em");
    yaxis = svgaxis.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + svgHeight + ")")
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickSize(-svgHeight)
            .ticks(d3.timeMonday.every(1))
            .tickFormat("")
        );
    yaxis.select(".domain").remove();
    svgaxis.append("g")
        .attr("class", "grid")
        .attr("transform", "translate("+(svgWidth-margin.left-margin.right)+",0)")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(svgWidth-margin.left-margin.right)
            .tickFormat("")
        );
    // svgaxis.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0," + 0 + ")")
    //     .call(d3.axisLeft(y))
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".1em");
    timeline_axis_g.append("rect")
        .attr('width',margin.left)
        .attr('height',svgHeight)
        .attr('x',-margin.left)
        .attr('y',-margin.top)
        .attr('fill','white');
    timeline_axis_g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".1em");
}
function legendmaker(){
    legendval = [{id:'process',color:0},{id:'milstone',color:1}];
    yl= d3.scaleBand()
        .domain(legendval.map(d=>d.id))
        .range([0, 50])
        .padding(0.1);
    legendg = d3.select("#legend").append('svg')
        .attr('width',200)
        .attr('height',50);
    lig = legendg.selectAll('.legenditem')
        .data(legendval).enter()
        .append('g')
        .attr('class','legend')
        .attr("transform",d=> "translate(0,"+yl(d.id)+")");
    d3.select(lig.node()).append('rect').attr("fill", (d, i) => colors[d.color])
        .attr("x", 70)
        .attr("y", 0)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", 60)
        .attr("height", yl.bandwidth());
    mill = d3.select(lig.nodes()[1]).append('g').attr("class",'milestonel')
        .attr("transform",(d,i)=> "translate(" + 100 + "," + yl.bandwidth()/2 + ")");
    mill.append("circle")
        .style("fill", 'none')
        .style("stroke", colors[1])
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", yl.bandwidth()/2)
        .style("filter", "url(#glow)");
    mill.append("circle")
        .style("fill", colors[1])
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", yl.bandwidth()/4)
        .style("filter", "url(#glow)");
    lig.append('text') .style("text-anchor", "start").text(d=>d.id).attr("dy", "1em");
}
//http://bl.ocks.org/cpbotha/5200394
function shadowdrop(g) {
    // filters go in defs element
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow2'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '1').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}