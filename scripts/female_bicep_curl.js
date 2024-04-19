d3.csv("scripts/gym_data_female.csv").then(function(data) {
  // Converts string values to numbers and calculate sums and counts for averages
  var sumsAndCounts = {};
  data.forEach(function(d) {
    d['1rm_dumbell'] = +d['1rm_dumbell'];
    if (sumsAndCounts[d.college]) {
      sumsAndCounts[d.college].sum += d['1rm_dumbell'];
      sumsAndCounts[d.college].count += 1;
    } else {
      sumsAndCounts[d.college] = { sum: d['1rm_dumbell'], count: 1 };
    }
  });

  // Calculate averages
  var averages = [];
  for (var college in sumsAndCounts) {
    var average = sumsAndCounts[college].sum / sumsAndCounts[college].count;
    averages.push({ college: college, average: average });
  }

  // Sort by average descending
  averages.sort(function(a, b) {
    return b.average - a.average;
  });

  var svg = d3.select('#female-bicep-curl');

  var width = 960,
      height = 500;

  var margin = {
    top: 20,
    bottom: 100,
    left: 200,
    right: 40
  };

  // Scales
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(averages, function(d) { return d.average; })])
    .range([margin.left, width - margin.right]);

  var yScale = d3.scaleBand()
    .domain(averages.map(function(d) { return d.college; }))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  // Axes
  svg.append('g')
    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
    .call(d3.axisBottom(xScale));

  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .call(d3.axisLeft(yScale));

  // Bars
  svg.selectAll('.bar')
    .data(averages)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', margin.left)
    .attr('y', function(d) { return yScale(d.college); })
    .attr('width', function(d) { return xScale(d.average) - margin.left; })
    .attr('height', yScale.bandwidth())
    .attr('fill', '#4682b4')
    .on('click', function(event, d) {
      // Toggle the 'selected' class on click
      var isSelected = d3.select(this).classed('selected');
      d3.select(this).classed('selected', !isSelected);
    });

  // Style for the bars and selected bars
  d3.select('head')
    .append('style')
    .text('.bar { fill: #4682b4; } .selected { fill: #ff0000; }');
});