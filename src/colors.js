import {
  arc as d3_arc,
  interpolateRainbow as d3_interpolateRainbow,
  range as d3_range,
  select as d3_select
} from 'd3';


const SIZE       = 400;
const SIZE_INNER = 70;
const BANDS      = 12;
const BAND_WIDTH = (SIZE - SIZE_INNER) / BANDS;
const COUNT      = 22;
const data       = d3_range(COUNT).map( (d, i) => d3_interpolateRainbow(i / COUNT) );

const svg = d3_select('#colors').append('svg')
  .attr('width', SIZE+2)
  .attr('height', SIZE+2)
  .append('g')
    .attr('transform', 'translate(' + ((SIZE+2)/2) + ',' + ((SIZE+2)/2) + ')');


const even = svg.append('g');
const odd  = svg.append('g');

for (let k = 0; k < BANDS; k++) {


  const arc = d3_arc()
    .outerRadius((SIZE - k*BAND_WIDTH) / 2)
    .innerRadius((SIZE - (k+1)*BAND_WIDTH) / 2)
    .startAngle(0)
    .endAngle((2*Math.PI) / COUNT);

  const parent = (k%2 === 0) ? even : odd;

  parent.append('g')
    .selectAll('path').data(data)
    .enter()
    .append('path')
      //.attr('fill', d => d3_interpolateRainbow(Math.random()))
      .attr('fill', (d, i) => i%2 === 0 ? '#000' : d3_interpolateRainbow(Math.random()))
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('transform', (d, i) => 'rotate(' + (i*(360/COUNT)) + ')')
      .attr('d', arc());

}

let nextOdd = 0;
let nextEven;

function update () {
  if (nextOdd === 0) {
    nextOdd = 180;
    nextEven = 90;
  }
  else {
    nextOdd = 0;
    nextEven = 180;
  }
  even.transition().duration(3000)
    .attr('transform', 'rotate(' + nextEven + ')');
  odd.transition().duration(3000)
    .attr('transform', 'rotate(' + nextOdd + ')')
    .on('end', update);
}

update();



/*svg.selectAll('rect').data(data)
  .enter()
  .append('rect')
    .attr('stroke', d => d)
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('width', (d, i) => SIZE * (i/COUNT))
    .attr('height', (d, i) => SIZE * (i/COUNT));*/

/*svg.selectAll('line').data(data)
  .enter()
  .append('line')
    .attr('stroke', d => d)
    .attr('stroke-width', 1)
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', SIZE/2)
    .attr('transform', (d, i) => 'rotate(' + 360*(i/COUNT) + ')');

svg.selectAll('circle').data(data)
  .enter()
  .append('circle')
    .attr('fill', 'none')
    .style('opacity', 0.5)
    .attr('stroke', d => d)
    .attr('stroke-width', 1)
    .attr('r', (d, i) => SIZE/2 * (1 - i/COUNT));*/
