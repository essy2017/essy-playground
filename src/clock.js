import {
  range       as d3_range,
  scaleLinear as d3_scaleLinear,
  select      as d3_select,
  transition  as d3_transition
} from 'd3';

const size          = 300;
const margin        = 20;
const innerSize     = size - 2 * margin;
const radiusOuter   = innerSize / 2;
const radiusInner   = radiusOuter - 8;
const radiusTicks   = radiusInner - 5;
const radiusNumbers = radiusTicks - 18;
const radiusHands   = radiusNumbers - 20;
const scale         = d3_scaleLinear().domain([0, 11]).range([0, (11/6)*Math.PI]);
const radians       = d3_scaleLinear().domain([0, 1]).range([-0.5*Math.PI, 1.5*Math.PI]);


// Main element.
const svg = d3_select('body').append('svg')
  .attr('width', size)
  .attr('height', size)
    .append('g')
      .attr('transform', 'translate(' + margin + ',' + margin + ')');

// Create the frame.
const frame = svg.append('g')
  .attr('transform', 'translate(' + radiusInner + ',' + radiusInner + ')');
frame.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', radiusOuter)
  .attr('fill', '#000');
frame.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', radiusInner)
  .attr('fill', '#f1f7fd');

// Create numbers.
svg.append('g')
  .attr('transform', 'translate(' + radiusInner + ',' + radiusInner + ')')
  .selectAll('.number').data(d3_range(12))
  .enter()
  .append('text')
    .attr('class', 'number')
    .style('font-size', '18px')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.3em')
    .attr('x', (d, i) => radiusNumbers*Math.cos(scale(i) - Math.PI/2))
    .attr('y', (d, i) => radiusNumbers*Math.sin(scale(i) - Math.PI/2))
    .text( d =>
      d === 0 ? 12 : d
    );

// Create tick marks.
svg.append('g')
  .attr('transform', 'translate(' + radiusInner + ',' + radiusInner + ')')
  .selectAll('.tick').data(d3_range(60))
  .enter()
  .append('line')
    .attr('class', 'tick')
    .attr('stroke-width', d => (d % 5) === 0 ? 2 : 1)
    .attr('stroke', '#000')
    .attr('x1', d => (d % 5 === 0 ? radiusTicks - 3 : radiusTicks)*Math.cos(2*Math.PI*(d/60)))
    .attr('y1', d => (d % 5 === 0 ? radiusTicks - 3 : radiusTicks)*Math.sin(2*Math.PI*(d/60)))
    .attr('x2', d => radiusInner*Math.cos(2*Math.PI*(d/60)))
    .attr('y2', d => radiusInner*Math.sin(2*Math.PI*(d/60)));

/**
 * Makes circle for hand.
 * @method makeHandCircle
 * @param fill {String} Fill color.
 * @param radius {Number} Circle radius.
 * @return {d3.selection}
 */
function makeHandCircle (fill, radius) {
  return hands.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', radius)
    .attr('fill', fill);
}

/**
 * Makes line for hand.
 * @method makeHandLine
 * @param stroke {String} Stroke color for line.
 * @param strokeWidth {Number} Stroke width for line.
 * @return {d3.selection}
 */
function makeHandLine (stroke, strokeWidth) {
  return hands.append('line')
    .attr('stroke-width', strokeWidth)
    .attr('stroke', stroke)
    .attr('x1', 0)
    .attr('y1', 0);
}

const hands = svg.append('g')
  .attr('transform', 'translate(' + radiusInner + ',' + radiusInner + ')');
const circleHours   = makeHandCircle('#000', radiusInner / 30);
const hours         = makeHandLine('#000', 3);
const minutes       = makeHandLine('#000', 2);
const circleSeconds = makeHandCircle('#b44', radiusInner / 50);
const seconds       = makeHandLine('#b44', 2);

/**
 * Updates hand positions.
 * @method update
 */
function update () {

  const d = new Date();
  const h = d.getHours() % 12;
  const m = d.getMinutes();
  const s = d.getSeconds();
  const t = d3_transition().duration(100);

  hours.datum(radians((d.getHours() % 12 + (m / 60)) / 12 ))
    .transition(t)
    .attr('x2', d => (radiusHands / 2)*Math.cos(d))
    .attr('y2', d => (radiusHands / 2)*Math.sin(d));

  minutes.datum(radians((m + s / 60) / 60))
    .transition(t)
    .attr('x2', d => radiusHands*Math.cos(d))
    .attr('y2', d => radiusHands*Math.sin(d));

  seconds.datum(radians((s + d.getMilliseconds() / 1000) / 60))
    .transition(t)
    .attr('x2', d => radiusHands*Math.cos(d))
    .attr('y2', d => radiusHands*Math.sin(d));

  window.setTimeout(update, 100);
}

update();
