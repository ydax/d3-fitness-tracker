////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////// canvas declaration and settings can go above the update fcn, b / c no data is req'd /////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const margin = {
    top: 40,
    right: 20,
    bottom: 50, // leave room for axes
    left: 100 // leave room for axes
}

// graph dimensions
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

// get a reference to the canvas div in the HTML file
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// setup the scales that my graph group will use
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

// build the axes
const xAxisGroup = graph.append('g')
    // give this a class in case I want to style it later
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Firestore <> Graph Interactivity //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tell the app what to do when data is updated
const update = (data) => {
    // set my scale domains
    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d => d.distance)]);

    // create circles that join with my data to create points on the graph
    const circles = graph.selectAll('circle')
        .data(data)

    // pop any exit selections from the graph
    circles.exit().remove();
    
    // update current points if they're edited
    circles
        .attr('cx', d => x(new Date(d.date))) // x coordinate of the circle
        .attr('cy', d => y(d.distance)) // y coordinate of the circle
    
    circles.enter()
        .append('circle')
            .attr('r', 4) // set the radius of the circle
            .attr('cx', d => x(new Date(d.date))) // x coordinate of the circle
            .attr('cy', d => y(d.distance)) // y coordinate of the circle
            .attr('fill', '#ccc');
    


    // create the axes shapes based on our scales
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat('%b %d'));
    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + ' miles');
    
    // place the axes I just created into my axis groups
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate the axis text
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate (-40)')
        .attr('text-anchor', 'end');
}

// this serves as the current Firestore data array for index.js / html
var data = [];

// setup realtime listener
db.collection('activities').onSnapshot(res => {
    // retreive all the document changes
    res.docChanges().forEach(change => {
        
        // create a document that stores each change
        const doc = {
            // the spread (...) will take the Firestore doc data and "spread" each element in it into its own property within the object
            ...change.doc.data(),
            id: change.doc.id
        };

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    });

    update(data);

})