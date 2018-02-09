import {
  scaleLinear as d3_scaleLinear,
  select      as d3_select,
  transition  as d3_transition
} from 'd3';

let index   = 0;
let srcImg  = document.getElementById('image' + index);
let svgMain = d3_select('#pixelated').append('svg');
let svg     = svgMain.append('g');


const canvas  = document.querySelector('canvas');
const context = canvas.getContext('2d');
const image   = new Image();
const count   = 4;


const slider = d3_select('#slider').append('input')
  .attr('type', 'range')
  .attr('min', 5)
  .attr('max', 40)
  .attr('value', 10)
  .style('display', 'block')
  .style('margin', '0 auto 1rem auto')
  .on('change', function () {
    pixelate(image, this.value);
  });

d3_select('#button').append('button')
  .text('Change')
  .on('click', () => {
    index++;
    if (index === count) {
      index = 0;
    }
    updateImage('image' + index);
  });

image.src    = srcImg.src;
image.onload = function () {
  d3_select(canvas).attr('width', image.width).attr('height', image.height);
  context.drawImage(image, 0, 0);
  pixelate(image, slider.attr('value'));
}

function updateImage (id) {
  drawSvg([], 0);
  srcImg = document.getElementById(id);
  image.src  = srcImg.src;
}

function pixelate (image, size) {

  const width  = image.width - (image.width % size);
  const height = image.height - (image.height % size);
  svgMain.attr('width', width).attr('height', height);

  // Number of squares left-to-right and top-to-bottom.
  const xSquares = width / size;
  const ySquares = height / size;

  let data = [];

  for (let x = 0; x < xSquares; x++) {
    for (let y = 0; y < ySquares; y++) {

      const rgba = context.getImageData(x*size, y*size, size, size).data;
      const len  = rgba.length;
      const num  = len / 4;

      let r = 0;
      let g = 0;
      let b = 0;

      // Sum the color values.
      for (let i = 0; i < len; i += 4) {
        r += rgba[i];
        g += rgba[i+1];
        b += rgba[i+2];
      }

      // Save the position and average color value.
      data.push({
        x   : x*size,
        y   : y*size,
        rgb : 'rgb(' + [
          Math.round(r / num),
          Math.round(g / num),
          Math.round(b / num)
        ].join(',') + ')'
      });
    }
  }

  drawSvg(data, size);
}

function drawSvg (colors, size) {

  const squares = svg.selectAll('.square').data(colors);

  squares.enter().append('rect')
    .attr('class', 'square')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', size)
    .attr('height', size)
    .attr('fill', d => d.rgb);

  squares
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', size)
    .attr('height', size)
    .attr('fill', d => d.rgb);

  squares.exit().remove();
}
