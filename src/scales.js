import {
  arc    as d3_arc,
  color  as d3_color,
  interpolateRainbow as d3_interpolateRainbow,
  path   as d3_path,
  range as d3_range,
  select as d3_select
} from 'd3';


// From: https://github.com/bahamas10/ryb/blob/gh-pages/js/RXB.js#L252-L330
var ryb2rgb = (function() {

  var MAGIC_COLORS = [
      [1,     1,     1],
      [1,     1,     0],
      [1,     0,     0],
      [1,     0.5,   0],
      [0.163, 0.373, 0.6],
      [0.0,   0.66,  0.2],
      [0.5,   0.0,   0.5],
      [0.2,   0.094, 0.0]
    ];

  // see http://threekings.tk/mirror/ryb_TR.pdf
  function cubicInt(t, A, B){
    var weight = t * t * (3 - 2 * t);
    return A + weight * (B - A);
  }

  function getR (iR, iY, iB) {
    var x0 = cubicInt(iB, MAGIC_COLORS[0][0], MAGIC_COLORS[4][0]);
    var x1 = cubicInt(iB, MAGIC_COLORS[1][0], MAGIC_COLORS[5][0]);
    var x2 = cubicInt(iB, MAGIC_COLORS[2][0], MAGIC_COLORS[6][0]);
    var x3 = cubicInt(iB, MAGIC_COLORS[3][0], MAGIC_COLORS[7][0]);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return cubicInt(iR, y0, y1);
  }

  function getG (iR, iY, iB) {
    var x0 = cubicInt(iB, MAGIC_COLORS[0][1], MAGIC_COLORS[4][1]);
    var x1 = cubicInt(iB, MAGIC_COLORS[1][1], MAGIC_COLORS[5][1]);
    var x2 = cubicInt(iB, MAGIC_COLORS[2][1], MAGIC_COLORS[6][1]);
    var x3 = cubicInt(iB, MAGIC_COLORS[3][1], MAGIC_COLORS[7][1]);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return cubicInt(iR, y0, y1);
  }

  function getB (iR, iY, iB) {
    var x0 = cubicInt(iB, MAGIC_COLORS[0][2], MAGIC_COLORS[4][2]);
    var x1 = cubicInt(iB, MAGIC_COLORS[1][2], MAGIC_COLORS[5][2]);
    var x2 = cubicInt(iB, MAGIC_COLORS[2][2], MAGIC_COLORS[6][2]);
    var x3 = cubicInt(iB, MAGIC_COLORS[3][2], MAGIC_COLORS[7][2]);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return cubicInt(iR, y0, y1);
  }

  function ryb2rgb (color, limit) {
    limit = limit || 255;
    var R = color[0] / limit;
    var Y = color[1] / limit;
    var B = color[2] / limit;
    var R1 = getR(R, Y, B, MAGIC_COLORS);
    var G1 = getG(R, Y, B, MAGIC_COLORS);
    var B1 = getB(R, Y, B, MAGIC_COLORS);
    return [
      Math.ceil(R1 * limit),
      Math.ceil(G1 * limit),
      Math.ceil(B1 * limit)
    ];
  }
  return ryb2rgb;
})();

function blendChannel (a, b) {
  return Math.sqrt(0.5*Math.pow(a, 2) + 0.5*Math.pow(b, 2));
}

function blend (a, b) {
  return [
    blendChannel(a[0], b[0]),
    blendChannel(a[1], b[1]),
    blendChannel(a[2], b[2])
  ];
}

function convert (ryb) {
  const rgb = ryb2rgb(ryb);
  return 'rgb(' + rgb.join(',') + ')';
}






(function () {

const SIZE = 400;
const HEX_WIDTH = SIZE / 10;

const svg = d3_select('#hex').append('svg')
  .attr('width', SIZE)
  .attr('height', SIZE)
  .append('g')
    .attr('transform', 'translate(' + (SIZE/2) + ',' + (SIZE/2) + ')');


const X_OFFSET = (HEX_WIDTH/2) * Math.cos(Math.PI / 6);
const Y_OFFSET = (HEX_WIDTH/2) * Math.sin(Math.PI / 6);

const path = d3_path();
path.moveTo(0, -HEX_WIDTH/2);
path.lineTo(X_OFFSET, -Y_OFFSET);
path.lineTo(X_OFFSET, Y_OFFSET);
path.lineTo(0, HEX_WIDTH/2);
path.lineTo(-X_OFFSET, Y_OFFSET);
path.lineTo(-X_OFFSET, -Y_OFFSET);
path.closePath();

const RED    = [255, 0, 0];
const YELLOW = [0, 255, 0];
const BLUE   = [0, 0, 255];


/*svg.selectAll('.hex').data([RED, YELLOW, BLUE])
  .enter()
  .append('path')
    .attr('fill', d => convert(d))
    .attr('transform', (d, i) =>
      'translate(' +
        ((HEX_WIDTH/2) * Math.sin(i*(2/3)*Math.PI)) + ',' +
        (-HEX_WIDTH + (i > 0 ? 1 : 0)*(HEX_WIDTH - Y_OFFSET)) +
      ')'
    )
    .attr('d', path.toString());*/

svg.append('path')
  .attr('fill', convert(RED))
  .attr('transform', 'translate(0,' + (-HEX_WIDTH) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(YELLOW))
  .attr('transform', 'translate(' + X_OFFSET + ',' + (-Y_OFFSET) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(BLUE))
  .attr('transform', 'translate(' + (-X_OFFSET) + ',' + (-Y_OFFSET) + ')')
  .attr('d', path.toString());


svg.append('path')
  .attr('fill', convert(blend(RED, YELLOW)))
  .attr('transform', 'translate(' + (2*X_OFFSET) + ',' + (-HEX_WIDTH) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(blend(YELLOW, BLUE)))
  .attr('transform', 'translate(0,' + (2*Y_OFFSET) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(blend(BLUE, RED)))
  .attr('transform', 'translate(' + (-2*X_OFFSET) + ',' + (-HEX_WIDTH) + ')')
  .attr('d', path.toString());



svg.append('path')
  .attr('fill', convert(blend(RED, blend(RED, YELLOW))))
  .attr('transform', 'translate(' + X_OFFSET + ',' + (-2*HEX_WIDTH + Y_OFFSET) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(blend(YELLOW, blend(RED, YELLOW))))
  .attr('transform', 'translate(' + (3*X_OFFSET) + ',' + (-Y_OFFSET) + ')')
  .attr('d', path.toString());


svg.append('path')
  .attr('fill', convert(blend(YELLOW, blend(YELLOW, BLUE))))
  .attr('transform', 'translate(' + (2*X_OFFSET) + ',' + (2*Y_OFFSET) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(blend(BLUE, blend(BLUE, YELLOW))))
  .attr('transform', 'translate(' + (-2*X_OFFSET) + ',' + (2*Y_OFFSET) + ')')
  .attr('d', path.toString());


svg.append('path')
  .attr('fill', convert(blend(BLUE, blend(BLUE, blend(BLUE, RED)))))
  .attr('transform', 'translate(' + (-3*X_OFFSET) + ',' + (-Y_OFFSET) + ')')
  .attr('d', path.toString());

svg.append('path')
  .attr('fill', convert(blend(RED, blend(RED, BLUE))))
  .attr('transform', 'translate(' + (-X_OFFSET) + ',' + (-2*HEX_WIDTH + Y_OFFSET) + ')')
  .attr('d', path.toString());


})();




(function () {

const SIZE         = 400;
const SIZE_INNER   = 70;
const BANDS        = 6;
const BAND_WIDTH   = (SIZE - SIZE_INNER) / BANDS;
const MIN_OPACITY  = 0.2;
const OPACITY_STEP = (1 - MIN_OPACITY) / BANDS;

/*const COLORS = [
  [219,55,50],   // Red
  [227,123,59],  // Red-orange
  [234,153,55],  // Orange
  [245,194,67],  // Orange-yellow
  [251,235,79],  // Yellow
  [185,221,70],  // Yellow-green
  [92,200,66],   // Green
  [77,177,192],  // Green-blue
  [13,83,203],   // Blue
  [61,19,139],   // Blue-purple
  [119,38,159],  // Purple
  [209,48,139]   // Purple red.
];*/
const COUNT = 12;
const COLORS = d3_range(COUNT).map( (d, i) => d3_interpolateRainbow(i/COUNT) );

const svg = d3_select('#circle').append('svg')
  .attr('width', SIZE)
  .attr('height', SIZE)
  .append('g')
    .attr('transform', 'translate(' + (SIZE/2) + ',' + (SIZE/2) + ')');

for (let i = 0; i < BANDS; i++) {

  const arc = d3_arc()
    .outerRadius((SIZE - i*BAND_WIDTH) / 2)
    .innerRadius((SIZE - (i+1)*BAND_WIDTH) / 2)
    .startAngle(0)
    .endAngle((2*Math.PI) / COUNT);

  svg.append('g')
    .attr('class', 'band band' + i)
    .selectAll('path').data(COLORS)
    .enter()
    .append('path')
      .attr('fill', d => {

        const c = d3_color(d);
        c.opacity = (1 - OPACITY_STEP * i);
        return c + '';
      })
      //.attr('fill', d => d3_color('rgba(' + d.join(',') + ',' + (1 - OPACITY_STEP*i) + ')') + '')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('transform', (d, i) => 'rotate(' + (i*(360/COUNT)) + ')')
      .attr('d', arc());

}

d3_select('#circle').append('button')
  .text('Scramble')
  .on('click', () => {

    svg.selectAll('.band')
      .transition().duration(1000)
      .attr('transform', () =>
        'rotate(' + (360/COUNT)*Math.floor(COUNT * Math.random()) + ')'
      );

  });

d3_select('#circle').append('button')
  .text('Restore')
  .on('click', () => {
    svg.selectAll('.band')
      .transition().duration(1000)
      .attr('transform', 'rotate(0)');
  });

})();


(function () {

const OUTER_SIZE = 400;
const INNER_SIZE = 0.7 * OUTER_SIZE;
const OUTER_R    = OUTER_SIZE / 2;
const INNER_R    = INNER_SIZE / 2;
const CX         = OUTER_SIZE / 2;
const CY         = OUTER_SIZE / 2;

const svg = d3_select('#triangle-wheel').append('svg')
  .attr('width', OUTER_SIZE)
  .attr('height', OUTER_SIZE)
  .append('g')
    .attr('transform', 'translate(' + CX + ',' + CY + ')');

const RED    = [255, 0, 0];
const YELLOW = [0, 255, 0];
const BLUE   = [0, 0, 255];

const ORANGE = blend(RED, YELLOW);
const GREEN  = blend(YELLOW, BLUE);
const PURPLE = blend(RED, BLUE);

const PRIMARY   = [RED, YELLOW, BLUE];
const SECONDARY = [ORANGE, GREEN, PURPLE];
const TERTIARY  = [
  RED,
  blend(RED, ORANGE),
  ORANGE,
  blend(ORANGE, YELLOW),
  YELLOW,
  blend(YELLOW, GREEN),
  GREEN,
  blend(GREEN, BLUE),
  BLUE,
  blend(BLUE, PURPLE),
  PURPLE,
  blend(PURPLE, RED)
];



const X_OFFSET = INNER_R * Math.cos(Math.PI/6);
const Y_OFFSET = INNER_R * Math.sin(Math.PI/6);


let path = d3_path();
path.moveTo(0, 0);
path.lineTo(X_OFFSET, Y_OFFSET);
path.lineTo(X_OFFSET, -Y_OFFSET);
path.lineTo(0, -INNER_R);
path.closePath();

//svg.selectAll('.secondary').data(['orange', 'green', 'purple'])
svg.selectAll('.secondary').data(SECONDARY)
  .enter()
  .append('path')
    .attr('class', 'secondary')
    .attr('fill', d => convert(d))
    .attr('transform', (d, i) => 'rotate(' + (i*120) + ')')
    .attr('d', path.toString());

path = d3_path();
path.moveTo(0, 0)
path.lineTo(-X_OFFSET / 2, -Y_OFFSET / 2);
path.lineTo(0, -INNER_R);
path.lineTo(X_OFFSET / 2, -Y_OFFSET / 2);
path.closePath();

svg.selectAll('.primary').data(PRIMARY)
  .enter()
  .append('path')
    .attr('class', 'primary')
    .attr('fill', d => convert(d))
    .attr('transform', (d, i) => 'rotate(' + (i*120) + ')')
    .attr('d', path.toString());


let arc = d3_arc()
  .innerRadius(INNER_R)
  .outerRadius(OUTER_R)
  .startAngle(0)
  .endAngle(Math.PI / 6);

const arcs = svg.append('g').attr('transform', 'rotate(' + (-360/24) + ')');

arcs.selectAll('.tertiary').data(TERTIARY)
  .enter()
  .append('path')
    .attr('fill', d => convert(d))
    .attr('transform', (d, i) => 'rotate(' + (i*30) + ')')
    .attr('d', arc());

})();
