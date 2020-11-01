import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {User} from '../constants/constants';

declare global {
  let d3: any;
  let queue: any;
  let topojson: any;
}

// function delayedHello(name, delay, callback) {
//   setTimeout(function() {
//     console.log('Hello, ' + name + '!');
//     callback(null);
//   }, delay);
// }

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.scss']
})
export class MapViewComponent implements OnInit {
  private users: User[];
  readonly users$ =
      (this.activatedRoute.data as Observable<User[]>)
          .pipe(
              map(data => data.users),
              tap((users) => this.users =
                      users));  // TODO: add interface for users data

  constructor(
      private readonly activatedRoute: ActivatedRoute,
  ) {
    this.users$.subscribe((users) => console.log('users', users));
  }

  ngOnInit() {
    this.init();
  }

  init() {
    d3.select(window).on('mousemove', mousemove).on('mouseup', mouseup);

    var width = 1200, height = 800;

    var proj = d3.geo.orthographic()
                   .scale(350)
                   .translate([width / 2, height / 2])
                   .clipAngle(90);


    var path = d3.geo.path().projection(proj).pointRadius(1.5);

    var graticule = d3.geo.graticule();

    var svg = d3.select('#map-container')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .on('mousedown', mousedown);

    queue()
        .defer(d3.json, 'assets/world-110m.json')
        .defer(d3.json, 'assets/places.json')
        // .defer(delayedHello, 'Alice', 250)
        .await(ready);  // await callback to be called when all of the tasks
                        // complete

    function ready(error, world, places) {
      var ocean_fill = svg.append('defs')
                           .append('radialGradient')
                           .attr('id', 'ocean_fill')
                           .attr('cx', '75%')
                           .attr('cy', '25%');
      ocean_fill.append('stop').attr('offset', '5%').attr('stop-color', '#ddf');
      ocean_fill.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#9ab');

      var globe_highlight = svg.append('defs')
                                .append('radialGradient')
                                .attr('id', 'globe_highlight')
                                .attr('cx', '75%')
                                .attr('cy', '25%');
      globe_highlight.append('stop')
          .attr('offset', '5%')
          .attr('stop-color', '#ffd')
          .attr('stop-opacity', '0.6');
      globe_highlight.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#ba9')
          .attr('stop-opacity', '0.2');

      var globe_shading = svg.append('defs')
                              .append('radialGradient')
                              .attr('id', 'globe_shading')
                              .attr('cx', '50%')
                              .attr('cy', '40%');
      globe_shading.append('stop')
          .attr('offset', '50%')
          .attr('stop-color', '#9ab')
          .attr('stop-opacity', '0')
      globe_shading.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#3e6184')
          .attr('stop-opacity', '0.3')

      svg.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#ocean_fill)');

      svg.append('path')
          .datum(topojson.object(world, world.objects.land))
          .attr('class', 'land')
          .attr('d', path);

      svg.append('path')
          .datum(graticule)
          .attr('class', 'graticule noclicks')
          .attr('d', path);

      svg.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_highlight)');

      svg.append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', proj.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_shading)');

      svg.append('g')
          .attr('class', 'points')
          .selectAll('text')
          .data(places.features)
          .enter()
          .append('path')
          .attr('class', 'point')
          .attr('d', path);

      // svg.append('g')
      //     .attr('class', 'points')
      //     .selectAll('text')
      //     .data(this.users.features)
      //     .enter()
      //     .append('path')
      //     .attr('class', 'point')
      //     .attr('d', path);

      svg.append('g')
          .attr('class', 'labels')
          .selectAll('text')
          .data(places.features)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text(function(d) {
            return d.properties.name
          })

      position_labels();
    }

    function position_labels() {
      var centerPos = proj.invert([width / 2, height / 2]);

      var arc = d3.geo.greatArc();

      svg.selectAll('.label')
          .attr(
              'text-anchor',
              function(d) {
                var x = proj(d.geometry.coordinates)[0];
                return x < width / 2 - 20 ?
                    'end' :
                    x < width / 2 + 20 ? 'middle' : 'start'
              })
          .attr(
              'transform',
              function(d) {
                var loc = proj(d.geometry.coordinates), x = loc[0], y = loc[1];
                var offset = x < width / 2 ? -5 : 5;
                return 'translate(' + (x + offset) + ',' + (y - 2) + ')'
              })
          .style('display', function(d) {
            var d = arc.distance(
                {source: d.geometry.coordinates, target: centerPos});
            return (d > 1.57) ? 'none' : 'inline';
          })
    }

    var m0, o0;
    function mousedown() {
      d3.event.preventDefault();
      m0 = [d3.event.pageX, d3.event.pageY];
      o0 = proj.rotate();
    }
    function mousemove() {
      if (m0) {
        var m1 = [d3.event.pageX, d3.event.pageY],
            o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
        o1[1] = o1[1] > 30 ? 30 : o1[1] < -30 ? -30 : o1[1];
        proj.rotate(o1);
        refresh();
      }
    }
    function mouseup() {
      if (m0) {
        mousemove();
        m0 = null;
      }
    }

    function refresh() {
      svg.selectAll('.land').attr('d', path);
      svg.selectAll('.countries path').attr('d', path);
      svg.selectAll('.graticule').attr('d', path);
      svg.selectAll('.point').attr('d', path);
      position_labels();
    }
  }
}
