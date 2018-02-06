import {
  path   as d3_path,
  select as d3_select
} from 'd3';


const DIGIT_WIDTH   = 160;
const DIGIT_PADDING = 0.15 * DIGIT_WIDTH;
const BAR_HEIGHT    = 0.2 * (DIGIT_WIDTH - 2*DIGIT_PADDING);
const BAR_SPACE     = 0.1 * BAR_HEIGHT;
const BAR_WIDTH     = DIGIT_WIDTH - 2*DIGIT_PADDING - BAR_HEIGHT;
const DIGIT_HEIGHT  = 2*DIGIT_PADDING + 2*BAR_WIDTH + BAR_HEIGHT + 4*BAR_SPACE;
const DOT_WIDTH     = 2*DIGIT_PADDING + BAR_HEIGHT;
const DOT_SPACE     = (DIGIT_HEIGHT - 2*DIGIT_PADDING - 2*BAR_HEIGHT) / 3;
const PADDING       = 100;
const PADDING_H     = 150;
const PADDING_V     = 100;
const LINE_EXTEND   = 20;
const COLOR_ON      = '#eee';
const COLOR_OFF     = '#bbb';

const DASH_ARRAY    = '2,1';
const LINE_COLOR    = '#555';
const FONT_SIZE     = '10px';
const FONT_FAMILY   = 'Helvetica,arial,sans-serif';


// Path string for bars.
const barPath = (() => {
  const p = d3_path();
  p.moveTo(0, BAR_HEIGHT / 2);
  p.lineTo(BAR_HEIGHT / 2, 0);
  p.lineTo(BAR_WIDTH - BAR_HEIGHT / 2, 0);
  p.lineTo(BAR_WIDTH, BAR_HEIGHT / 2);
  p.lineTo(BAR_WIDTH - BAR_HEIGHT / 2, BAR_HEIGHT);
  p.lineTo(BAR_HEIGHT / 2, BAR_HEIGHT);
  p.closePath();
  return p.toString();
})();

// Returns data for bars within digit, passed numerical value.
function barData (v) {
  return [
    { // top
      x   : BAR_HEIGHT/2,
      y   : 0,
      rot : 0,
      on  : [0, 2, 3, 5, 6, 7, 8, 9].indexOf(v) > -1
    },
    { // top left
      x   : BAR_HEIGHT - BAR_SPACE,
      y   : BAR_HEIGHT/2 + BAR_SPACE,
      rot : 90,
      on  : [0, 4, 5, 6, 8, 9].indexOf(v) > -1
    },
    { // top right
      x   : BAR_WIDTH + BAR_HEIGHT + BAR_SPACE,
      y   : BAR_HEIGHT/2 + BAR_SPACE,
      rot : 90,
      on  : [0, 1, 2, 3, 4, 7, 8, 9].indexOf(v) > -1
    },
    { // middle
      x   : BAR_HEIGHT/2,
      y   : BAR_WIDTH + 2*BAR_SPACE,
      rot : 0,
      on  : [2, 3, 4, 5, 6, 8, 9].indexOf(v) > -1
    },
    { // bottom left
      x   : BAR_HEIGHT - BAR_SPACE,
      y   : BAR_WIDTH + BAR_HEIGHT/2 + 3*BAR_SPACE,
      rot : 90,
      on  : [0, 2, 6, 8].indexOf(v) > -1
    },
    { // bottom right
      x   : BAR_WIDTH + BAR_HEIGHT + BAR_SPACE,
      y   : BAR_WIDTH + BAR_HEIGHT/2 + 3*BAR_SPACE,
      rot : 90,
      on  : [0, 1, 3, 4, 5, 6, 7, 8, 9].indexOf(v) > -1
    },
    { // bottom
      x   : BAR_HEIGHT/2,
      y   : 2*BAR_WIDTH + 4*BAR_SPACE,
      rot : 0,
      on  : [0, 2, 3, 5, 6, 8, 9].indexOf(v) > -1
    }
  ];
}

// Create main element.
const svg = d3_select('body').append('svg')
  .attr('width', 2*PADDING_H + DIGIT_WIDTH)
  .attr('height', 2*PADDING_V + DIGIT_HEIGHT)
  .append('g');

// Create background.
svg.append('rect')
  .attr('x', PADDING_H)
  .attr('y', PADDING_V)
  .attr('width', DIGIT_WIDTH)
  .attr('height', DIGIT_HEIGHT)
  .attr('fill', '#bbb');

// Create clock.
const clock = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H + DIGIT_PADDING) + ',' + (PADDING_V + DIGIT_PADDING) + ')');

// Create digits.
const digits = clock.selectAll('.digit').data([3])
  .enter()
  .append('g')
    .attr('class', 'digit')
    .attr('transform', (d, i) => 'translate(' + (i*DIGIT_WIDTH + Math.floor(i/2)*DOT_WIDTH) + ',0)');

// Create bars for each digit.
digits.selectAll('.bar').data(d => barData(d))
  .enter()
  .append('path')
    .attr('class', 'bar')
    .attr('d', barPath)
    .attr('fill', d => d.on ? COLOR_ON : COLOR_OFF)
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ') rotate(' + d.rot + ')');


const defs = svg.append('defs');

defs.append('marker')
  .attr('id', 'arrow-right')
  .attr('markerWidth', 6)
  .attr('markerHeight', 6)
  .attr('refX', 9)
  .attr('refY', 5)
  .attr('viewBox', '0 0 10 10')
  .append('path')
    .attr('d', 'M0,0 L10,5 L0,10Z')
    .attr('fill', LINE_COLOR);

defs.append('marker')
  .attr('id', 'arrow-left')
  .attr('markerWidth', 8)
  .attr('markerHeight', 6)
  .attr('refX', 0)
  .attr('refY', 5)
  .attr('viewBox', '0 0 10 10')
  .append('path')
    .attr('d', 'M0,5 L10,0 L10,10Z')
    .attr('fill', LINE_COLOR);

defs.append('marker')
  .attr('id', 'arrow-up')
  .attr('markerWidth', 6)
  .attr('markerHeight', 8)
  .attr('refX', 5)
  .attr('refY', 0)
  .attr('viewBox', '0 0 10 10')
  .append('path')
    .attr('d', 'M0,10 L5,0 L10,10Z')
    .attr('fill', LINE_COLOR);

defs.append('marker')
  .attr('id', 'arrow-down')
  .attr('markerWidth', 6)
  .attr('markerHeight', 8)
  .attr('refX', 5)
  .attr('refY', 9)
  .attr('viewBox', '0 0 10 10')
  .append('path')
    .attr('d', 'M0,0 L5,10 L10,0Z')
    .attr('fill', LINE_COLOR);


// BAR_WIDTH.
const bw = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H + DIGIT_PADDING + BAR_HEIGHT/2) + ',' + (PADDING_V - LINE_EXTEND) + ')');

bw.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT/2);

bw.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', BAR_WIDTH)
  .attr('y1', 0)
  .attr('x2', BAR_WIDTH)
  .attr('y2', LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT/2);

bw.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 12)
  .attr('y2', 0)
  .attr('marker-start', 'url(#arrow-left)');

bw.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', BAR_WIDTH - 12)
  .attr('y1', 0)
  .attr('x2', BAR_WIDTH)
  .attr('y2', 0)
  .attr('marker-end', 'url(#arrow-right)');

bw.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', BAR_WIDTH / 2)
  .attr('y', 0)
  .attr('dy', '0.3em')
  .style('font-family', FONT_FAMILY)
  .style('font-size', FONT_SIZE)
  .text('BAR_WIDTH');

// BAR_HEIGHT.
const bh = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H - LINE_EXTEND) + ',' + (PADDING_V + DIGIT_PADDING + BAR_WIDTH + 2*BAR_SPACE) + ')');

bh.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT)
  .attr('y2', 0);

bh.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', BAR_HEIGHT)
  .attr('x2', LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT)
  .attr('y2', BAR_HEIGHT);

bh.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', BAR_HEIGHT)
  .attr('marker-start', 'url(#arrow-up)')
  .attr('marker-end', 'url(#arrow-down)');

bh.append('text')
  .attr('text-anchor', 'end')
  .attr('x', 0)
  .attr('y', BAR_HEIGHT/2)
  .attr('dx', '-1em')
  .attr('dy', '0.3em')
  .attr('font-size', FONT_SIZE)
  .attr('font-family', FONT_FAMILY)
  .text('BAR_HEIGHT');

// DIGIT_WIDTH
const dw = svg.append('g')
  .attr('transform', 'translate(' + PADDING_H + ',' + (PADDING_V + DIGIT_HEIGHT) + ')');

dw.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 1)
  .attr('y1', 0)
  .attr('x2', 1)
  .attr('y2', LINE_EXTEND);

dw.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', DIGIT_WIDTH - 1)
  .attr('y1', 0)
  .attr('x2', DIGIT_WIDTH - 1)
  .attr('y2', LINE_EXTEND);

dw.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', 1)
  .attr('y1', LINE_EXTEND)
  .attr('x2', 42)
  .attr('y2', LINE_EXTEND)
  .attr('marker-start', 'url(#arrow-left)');

dw.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', DIGIT_WIDTH - 42)
  .attr('y1', LINE_EXTEND)
  .attr('x2', DIGIT_WIDTH - 1)
  .attr('y2', LINE_EXTEND)
  .attr('marker-end', 'url(#arrow-right)');

dw.append('text')
  .attr('text-anchor', 'middle')
  .attr('x', DIGIT_WIDTH / 2)
  .attr('y', LINE_EXTEND)
  .attr('dy', '0.3em')
  .style('font-family', FONT_FAMILY)
  .style('font-size', FONT_SIZE)
  .text('DIGIT_WIDTH');

// DIGIT_HEIGHT.
const dh = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H + DIGIT_WIDTH) + ',' + PADDING_V + ')');

dh.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 1)
  .attr('x2', LINE_EXTEND)
  .attr('y2', 1);

dh.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', DIGIT_HEIGHT - 1)
  .attr('x2', LINE_EXTEND)
  .attr('y2', DIGIT_HEIGHT - 1);

dh.append('text')
  .attr('text-anchor', 'start')
  .attr('font-size', FONT_SIZE)
  .attr('font-family', FONT_FAMILY)
  .attr('x', LINE_EXTEND / 2)
  .attr('y', DIGIT_HEIGHT / 2)
  .attr('dy', '0.3em')
  .text('DIGIT_HEIGHT');

dh.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', LINE_EXTEND)
  .attr('y1', 0)
  .attr('x2', LINE_EXTEND)
  .attr('y2', DIGIT_HEIGHT/2 - 10)
  .attr('marker-start', 'url(#arrow-up)');

dh.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', LINE_EXTEND)
  .attr('y1', DIGIT_HEIGHT/2 + 10)
  .attr('x2', LINE_EXTEND)
  .attr('y2', DIGIT_HEIGHT)
  .attr('marker-end', 'url(#arrow-down)');

// DIGIT_PADDING
const dp = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H - LINE_EXTEND) + ',' + (PADDING_V + DIGIT_HEIGHT - DIGIT_PADDING) + ')');

dp.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT)
  .attr('y2', 0);

dp.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', DIGIT_PADDING - 1)
  .attr('x2', LINE_EXTEND)
  .attr('y2', DIGIT_PADDING - 1);

dp.append('text')
  .attr('text-anchor', 'end')
  .attr('font-size', FONT_SIZE)
  .attr('font-family', FONT_FAMILY)
  .attr('x', 0)
  .attr('y', DIGIT_PADDING / 2)
  .attr('dx', '-1em')
  .attr('dy', '0.3em')
  .text('DIGIT_PADDING');

dp.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', DIGIT_PADDING - 1)
  .attr('marker-start', 'url(#arrow-up)')
  .attr('marker-end', 'url(#arrow-down)');

// DIGIT_PADDING vertical.
const dp2 = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H + DIGIT_WIDTH - DIGIT_PADDING + BAR_SPACE) + ',' + (PADDING_V - 2*LINE_EXTEND) + ')');

dp2.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', 2*LINE_EXTEND + DIGIT_PADDING + BAR_HEIGHT);

dp2.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', DIGIT_PADDING - 3)
  .attr('y1', 0)
  .attr('x2', DIGIT_PADDING - 3)
  .attr('y2', 2*LINE_EXTEND);

dp2.append('text')
  .attr('text-anchor', 'middle')
  .attr('font-size', FONT_SIZE)
  .attr('font-family', FONT_FAMILY)
  .attr('x', (DIGIT_PADDING - 3) / 2)
  .attr('y', 0)
  .attr('dy', '-1em')
  .text('DIGIT_PADDING');

dp2.append('line')
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', DIGIT_PADDING - 3)
  .attr('y2', 0)
  .attr('marker-start', 'url(#arrow-left)')
  .attr('marker-end', 'url(#arrow-right)');

// BAR_SPACE
const bs = svg.append('g')
  .attr('transform', 'translate(' + (PADDING_H - LINE_EXTEND) + ',' + (PADDING_V + DIGIT_PADDING + (BAR_HEIGHT + BAR_WIDTH)/2) + ')');

bs.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', LINE_EXTEND + DIGIT_PADDING + (BAR_HEIGHT + BAR_WIDTH)/2 + BAR_SPACE)
  .attr('y2', 0);
bs.append('line')
  .attr('stroke-dasharray', DASH_ARRAY)
  .attr('stroke', LINE_COLOR)
  .attr('x1', LINE_EXTEND + DIGIT_PADDING + (BAR_HEIGHT + BAR_WIDTH)/2 + BAR_SPACE)
  .attr('y1', 0)
  .attr('x2', LINE_EXTEND + DIGIT_WIDTH - DIGIT_PADDING - BAR_HEIGHT + BAR_SPACE)
  .attr('y2', -BAR_WIDTH/2 + BAR_HEIGHT/2);
bs.append('text')
  .attr('text-anchor', 'end')
  .attr('font-size', FONT_SIZE)
  .attr('font-family', FONT_FAMILY)
  .attr('x', 0)
  .attr('y', 0)
  .attr('dx', '-1em')
  .attr('dy', '0.3em')
  .text('BAR_SPACE');
