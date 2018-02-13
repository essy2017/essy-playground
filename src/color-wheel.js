import {
  arc                as d3_arc,
  color              as d3_color,
  interpolateRainbow as d3_interpolateRainbow,
  range              as d3_range,
  select             as d3_select
} from 'd3';

const SIZE         = 400;
const SIZE_INNER   = 70;
const BANDS        = 6;
const BAND_WIDTH   = (SIZE - SIZE_INNER) / BANDS;
const MIN_OPACITY  = 0.1;
const OPACITY_STEP = (1 - MIN_OPACITY) / BANDS;
const COUNT        = 12;
const COLORS       = d3_range(COUNT).map( (d, i) => d3_interpolateRainbow(i/COUNT) );

const svg = d3_select('#color-wheel').append('svg')
  .attr('width', SIZE)
  .attr('height', SIZE)
  .append('g')
    .attr('transform', 'translate(' + (SIZE/2) + ',' + (SIZE/2) + ')');


for (let k = 0; k < BANDS; k++) {

  const arc = d3_arc()
    .outerRadius((SIZE - k*BAND_WIDTH) / 2)
    .innerRadius((SIZE - (k+1)*BAND_WIDTH) / 2)
    .startAngle(0)
    .endAngle((2*Math.PI) / COUNT);

  svg.append('g')
    .attr('class', 'band')
    .selectAll('path').data(COLORS)
    .enter()
    .append('path')
      .attr('fill', d => {
        const c = d3_color(d);
        c.opacity = (1 - OPACITY_STEP * k);
        return c + '';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('transform', (d, i) => 'rotate(' + (i*(360/COUNT)) + ')')
      .attr('d', arc());

}


d3_select('#buttons').append('button')
  .text('Scramble')
  .on('click', () => {
    svg.selectAll('.band')
      .transition().duration(1000)
      .attr('transform', () =>
        'rotate(' + (360/COUNT)*Math.floor(COUNT * Math.random()) + ')'
      );
  });

d3_select('#buttons').append('button')
  .text('Restore')
  .on('click', () => {
    svg.selectAll('.band')
      .transition().duration(1000)
      .attr('transform', 'rotate(0)');
  });
