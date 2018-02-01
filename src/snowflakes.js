import {
  scaleLinear as d3_scaleLinear,
  select as d3_select,
  transition as d3_transition,
  values as d3_values
} from "d3";

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;
const svg = d3_select('body').append('svg').append('g');

const x     = d3_scaleLinear().domain([0, 1]).range([0, width]);
const drift = d3_scaleLinear().domain([0, 1]).range([-width / 10, width / 10]);
const scale = d3_scaleLinear().domain([0, 1]).range([0.1, 1]);
const blur  = d3_scaleLinear().domain(scale.range()).range([0, 5]);
const t     = d3_transition().duration(10000);

let nextId = 0;
let flakes = {};


function addFlake () {
  const newScale = Math.random();
  flakes[++nextId] = {
    id       : nextId,
    x        : x(Math.random()),
    drift    : drift(Math.random()),
    scale    : newScale,
    duration : 5000 + 10000*Math.random(),
    blur     : blur(newScale)
  };
}

for (let i = 0; i < 10; i++) {
  addFlake();
}

svg.append('defs')
  .append('g')
    .attr('id', 'snowflake')
    .attr('viewBox', '0 0 1792 1792')
    .attr('transform', 'scale(0.05)')
    .append('path')
      .attr('fill', '#fff')
      .attr('d', "M1630 1117l-167 33 186 107q23 13 29.5 38.5t-6.5 48.5q-14 23-39 29.5t-48-6.5l-186-106 55 160q13 38-12 63.5t-60.5 20.5-48.5-42l-102-300-271-156v313l208 238q16 18 17 39t-11 36.5-28.5 25-37 5.5-36.5-22l-112-128v214q0 26-19 45t-45 19-45-19-19-45v-214l-112 128q-16 18-36.5 22t-37-5.5-28.5-25-11-36.5 17-39l208-238v-313l-271 156-102 300q-13 37-48.5 42t-60.5-20.5-12-63.5l55-160-186 106q-23 13-48 6.5t-39-29.5q-13-23-6.5-48.5t29.5-38.5l186-107-167-33q-29-6-42-29t-8.5-46.5 25.5-40 50-10.5l310 62 271-157-271-157-310 62q-4 1-13 1-27 0-44-18t-19-40 11-43 40-26l167-33-186-107q-23-13-29.5-38.5t6.5-48.5 39-30 48 7l186 106-55-160q-13-38 12-63.5t60.5-20.5 48.5 42l102 300 271 156v-313l-208-238q-16-18-17-39t11-36.5 28.5-25 37-5.5 36.5 22l112 128v-214q0-26 19-45t45-19 45 19 19 45v214l112-128q16-18 36.5-22t37 5.5 28.5 25 11 36.5-17 39l-208 238v313l271-156 102-300q13-37 48.5-42t60.5 20.5 12 63.5l-55 160 186-106q23-13 48-6.5t39 29.5q13 23 6.5 48.5t-29.5 38.5l-186 107 167 33q27 5 40 26t11 43-19 40-44 18q-9 0-13-1l-310-62-271 157 271 157 310-62q29-6 50 10.5t25.5 40-8.5 46.5-42 29z");

svg.append('filter')
  .attr('id', 'blur')
  .append('feGaussianBlur')
    .attr('stdDeviation', 25);

function update () {

  addFlake();

  const els = svg.selectAll('.flake').data(d3_values(flakes));

  els.enter()
    .append('g')
      .attr('class', 'flake')
      .attr('transform', d => 'translate(' + d.x + ',-100)')
      .append('filter')
        .attr('id', (d, i) => 'blur' + d.id)
        .append('feGaussianBlur').attr('stdDeviation', d => d.blur)
        .select(function () { return this.parentNode.parentNode; })
      .append('use')
        .attr('xlink:href', '#snowflake')
        .attr('filter', (d, i) => 'url(#blur' + d.id + ')')
        .attr('transform', d => 'scale(' + scale(d.scale) + ')')
        .select(function () { return this.parentNode; })
      .transition().ease(t => t).duration( d => d.duration)
        .attr('transform', d => 'translate(' + (d.x + d.drift) + ',' + height + ')')
        .on('end', function (d, i) {
          delete flakes[d.id];
          this.remove();
        });

  window.setTimeout(update, 800 * Math.random());
}

update();
