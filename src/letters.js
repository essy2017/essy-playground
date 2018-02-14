import {
  select  as d3_select,
  shuffle as d3_shuffle
} from 'd3';

let data = 'Does this make any sense?'.split('').map( (d, i) => ({
  letter  : d,
  index   : i,
  pos     : i,
  y       : 0
}));

const LETTER_WIDTH = 22;
const WIDTH        = LETTER_WIDTH * data.length;
const HEIGHT       = 80;

const svg = d3_select('#letters').append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .append('g')
    .attr('transform', 'translate(0,' + (HEIGHT/2) + ')');

function update (data) {

  const text = svg.selectAll('text').data(data, d => d.index);

  text.enter().append('text')
    .attr('fill', d => d.letter === '?' ? 'tomato' : '#000')
    .attr('x', (d, i) => LETTER_WIDTH*d.pos)
    .style('font-size', '40px')
    .style('font-family', 'monospace')
    .text(d => d.letter)
    .merge(text)
      .transition().duration(1000)
      .attr('x', (d, i) => LETTER_WIDTH*d.pos);

}

function loop () {

  update(data);

  window.setTimeout(function () {

    data = d3_shuffle(data).map( (d, i) => {
      d.pos = i;
      return d;
    });
    update(data);

    window.setTimeout(function () {
      data = data.map( (d, i) => {
        d.pos = d.index;
        return d;
      });
      loop();
    }, 2000);

  }, 2000);
}
loop();
