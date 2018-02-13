import {
  line        as d3_line,
  range       as d3_range,
  select      as d3_select,
  scaleLinear as d3_scaleLinear
} from 'd3';

(function () {

const WIDTH      = 200;
const HEIGHT     = 30;
const DATA_MAX   = 50;
const DATA_MIN   = -50;
const DATA_COUNT = 40;
const BAR_WIDTH = (WIDTH - DATA_COUNT) / DATA_COUNT;

const data = d3_range(DATA_COUNT).map( d => DATA_MIN + (DATA_MAX - DATA_MIN) * Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, WIDTH]);
const y    = d3_scaleLinear().domain([DATA_MIN, DATA_MAX]).range([HEIGHT, 0]);


const svg = d3_select('#sparklines1').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g');

svg.selectAll('.bar').data(data)
  .enter()
  .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(i))
    .attr('y', d => d > 0 ? y(d) : y(0))
    .attr('width', BAR_WIDTH)
    .attr('height', d => Math.abs(y(d) - y(0)))
    .attr('fill', d => d > 0 ? 'steelblue' : 'tomato');


})();


(function () {

const WIDTH      = 200;
const HEIGHT     = 30;
const DATA_MAX   = 50;
const DATA_MIN   = -50;
const DATA_COUNT = 40;
const BAR_WIDTH  = (WIDTH - DATA_COUNT) / DATA_COUNT;

const data = d3_range(DATA_COUNT).map( d => DATA_MIN + (DATA_MAX - DATA_MIN) * Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, WIDTH]);
const y    = d3_scaleLinear().domain([DATA_MIN, DATA_MAX]).range([HEIGHT, 0]);


const svg = d3_select('#sparklines5').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g');

svg.selectAll('.bar').data(data)
  .enter()
  .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(i))
    .attr('y', d => d > 0 ? y(d) : y(0))
    .attr('width', BAR_WIDTH)
    .attr('height', d => Math.abs(y(d) - y(0)))
    .attr('fill', d => d > 0 ? 'steelblue' : 'tomato');


})();

(function () {

const WIDTH      = 160;
const HEIGHT     = 30;
const DATA_COUNT = 40;
const BAR_WIDTH  = (WIDTH - DATA_COUNT) / DATA_COUNT;

const data = d3_range(DATA_COUNT).map( d => Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, WIDTH]);
const y    = d3_scaleLinear().domain([0, 1]).range([HEIGHT, 0]);

const svg = d3_select('#sparklines2').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g');

svg.selectAll('.bar').data(data)
  .enter()
  .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(i))
    .attr('y', d => HEIGHT - y(d))
    .attr('width', BAR_WIDTH)
    .attr('height', d => y(d))
    .attr('fill', 'MediumSeaGreen');


})();

(function () {

const WIDTH        = 200;
const HEIGHT       = 30;
const MARGIN       = { top: 5, right: 5, bottom: 5, left: 5 };
const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const DATA_COUNT   = 40;

const data = d3_range(DATA_COUNT).map( d => Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, INNER_WIDTH]);
const y    = d3_scaleLinear().domain([0, 1]).range([INNER_HEIGHT, 0]);

const svg = d3_select('#sparklines3').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

const line = d3_line()
  .x((d, i) => x(i))
  .y(d => y(d));

svg.append('path').datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#bbb')
  .attr('stroke-width', 1)
  .attr('d', line);

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(0))
  .attr('cy', y(data[0]))
  .attr('fill', 'steelblue');

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(DATA_COUNT - 1))
  .attr('cy', y(data[DATA_COUNT - 1]))
  .attr('fill', 'tomato');

})();

(function () {

const WIDTH        = 200;
const HEIGHT       = 30;
const MARGIN       = { top: 5, right: 5, bottom: 5, left: 5 };
const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const DATA_COUNT   = 40;

const data = d3_range(DATA_COUNT).map( d => Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, INNER_WIDTH]);
const y    = d3_scaleLinear().domain([0, 1]).range([INNER_HEIGHT, 0]);

const svg = d3_select('#sparklines4').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

const line = d3_line()
  .x((d, i) => x(i))
  .y(d => y(d));

svg.append('path').datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#bbb')
  .attr('stroke-width', 1)
  .attr('d', line);

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(0))
  .attr('cy', y(data[0]))
  .attr('fill', 'steelblue');

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(DATA_COUNT - 1))
  .attr('cy', y(data[DATA_COUNT - 1]))
  .attr('fill', 'tomato');

})();

(function () {

const WIDTH        = 200;
const HEIGHT       = 30;
const MARGIN       = { top: 5, right: 5, bottom: 5, left: 5 };
const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const DATA_COUNT   = 40;

const data = d3_range(DATA_COUNT).map( d => Math.random() );
const x    = d3_scaleLinear().domain([0, DATA_COUNT]).range([0, INNER_WIDTH]);
const y    = d3_scaleLinear().domain([0, 1]).range([INNER_HEIGHT, 0]);

const svg = d3_select('#sparklines6').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

const line = d3_line()
  .x((d, i) => x(i))
  .y(d => y(d));

svg.append('path').datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#bbb')
  .attr('stroke-width', 1)
  .attr('d', line);

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(0))
  .attr('cy', y(data[0]))
  .attr('fill', 'steelblue');

svg.append('circle')
  .attr('r', 2)
  .attr('cx', x(DATA_COUNT - 1))
  .attr('cy', y(data[DATA_COUNT - 1]))
  .attr('fill', 'tomato');

})();
