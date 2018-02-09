import {
  axisBottom  as d3_axisBottom,
  axisLeft    as d3_axisLeft,
  line        as d3_line,
  scaleLinear as d3_scaleLinear,
  select      as d3_select
} from 'd3';

const WIDTH        = 400;
const HEIGHT       = 300;
const MARGIN       = { top: 10, right: 10, bottom: 20, left: 30 };
const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

const svg = d3_select('#grid').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);


const x         = d3_scaleLinear().domain([0, 10]).range([0, INNER_WIDTH]);
const y         = d3_scaleLinear().domain([0, 1]).range([INNER_HEIGHT, 0]);
const xAxis     = d3_axisBottom(x).ticks(10);
const yAxis     = d3_axisLeft(y).ticks(10);
const xAxisGrid = d3_axisBottom(x).tickSize(-INNER_HEIGHT).tickFormat('').ticks(10);
const yAxisGrid = d3_axisLeft(y).tickSize(-INNER_WIDTH).tickFormat('').ticks(10);


// Create grids.
svg.append('g')
  .attr('class', 'x axis-grid')
  .attr('transform', `translate(0, ${INNER_HEIGHT})`)
  .call(xAxisGrid);

svg.append('g')
  .attr('class', 'y axis-grid')
  .call(yAxisGrid);

// Create axes.
svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${INNER_HEIGHT})`)
  .call(xAxis);

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

const data = [0.3, 0.5, 0.4, 0.7, 0.4, 0.5, 0.4, 0.8, 0.6, 0.5, 0.9];
const line = d3_line()
  .x((d, i) => x(i))
  .y(d => y(d));

svg.append('path')
  .attr('fill', 'none')
  .attr('stroke', '#b44')
  .attr('stroke-width', 3)
  .attr('d', line(data));
