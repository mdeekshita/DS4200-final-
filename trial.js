// Load data from CSV
d3.csv('updated_dataset.csv').then(function(data) {
    // Filter for complaints and count by quarter
    let processedData = d3.rollups(
        data.filter(d => d["Commendation or Complaint"] === "Complaint"),
        v => v.length,
        d => d.Quarter
    ).map(([quarter, count]) => ({ quarter: `Q${quarter}`, complaints: count }));

    // Create SVG
    let width = 600, height = 400;

    let margin = {
        top: 40,
        bottom: 50,
        left: 50,
        right: 30
    };

    let svg = d3
        .select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#e9f7f2');

    // Define Scales
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.complaints)])
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
        .domain(processedData.map(d => d.quarter))
        .range([margin.left, width - margin.right])
        .padding(0.5);

    // Draw Axes
    let yAxis = svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    yAxis
        .append('text')
        .attr('x', -30)
        .attr('y', 20)
        .style('fill', 'black')
        .text('Complaints');

    let xAxis = svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    xAxis
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .style('fill', 'black')
        .text('Quarter');

    // Draw Bars
    let bar = svg
        .selectAll('rect')
        .data(processedData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.quarter))
        .attr('y', d => yScale(d.complaints))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d.complaints))
        .attr('fill', 'steelblue');

    // Add Hover Interactions
    bar
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .delay(200)
                .duration(500)
                .style('fill', 'red');
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .delay(200)
                .duration(500)
                .style('fill', 'steelblue');
        });
});
