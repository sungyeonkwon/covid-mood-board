import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {MoodColourMap, User} from '../constants/constants';

declare global {
  let d3: any;
  let queue: any;
  let topojson: any;
  let versor: any;
  let v0: any;
  let r0: any;
  let q0: any;
}

const serialize =
    (users) => {
      return users.map((user) => {
        console.log('user.mood', user.mood);
        console.log('u', MoodColourMap[user.mood]);
        return {
          type: 'Feature', properties: {
            message: user.message,
            color: MoodColourMap[user.mood],
          },
              geometry: {
                type: 'Point',
                coordinates:
                    [
                      user.longitude,
                      user.latitude,
                    ]
              },
        }
      });
    }

function
delayedUsers(users, callback) {
  const serializedUsers = serialize(users);
  callback(null, serializedUsers);
}

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.scss']
}) export class MapViewComponent implements OnInit {
  private users: User[];

  viewHeight = 0;
  viewWidth = 0;

  readonly users$ =
      (this.activatedRoute.data as Observable<any>)  // TODO: type
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
    this.viewHeight = document.documentElement.clientHeight;
    this.viewWidth = document.documentElement.clientWidth;
    this.init();
  }

  init() {
    var time = Date.now();
    var v0;
    var r0;
    var q0;
    var width = this.viewWidth, height = this.viewHeight;
    var rotate = [39.666666666666664, -30];
    var velocity = [.005, -0];

    var proj = d3.geoOrthographic()
                   .scale(730)
                   .translate([width / 2, height / 2])
                   .clipAngle(90);

    var path = d3.geoPath().projection(proj).pointRadius(3);

    var graticule = d3.geoGraticule();

    var svg = d3.select('#map-container')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    svg.call(d3.drag().on('start', dragstarted).on('drag', dragged));

    queue()
        .defer(d3.json, 'assets/world-110m.json')
        .defer(d3.json, 'assets/places.json')
        .defer(delayedUsers, this.users)
        .await(ready);  // await callback to be called when all of the tasks
                        // complete

    function ready(error, world, places, users) {
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
          .data(users)
          .enter()
          .append('path')
          .attr('class', 'point')
          .attr('d', path)
          .attr('fill', function(d) {
            return d.properties.color;
          });

      // svg.append('g')
      //     .attr('class', 'messages')
      //     .selectAll('text')
      //     .data(users)
      //     .enter()
      //     .append('text')
      //     .attr('class', 'label')
      //     .text(function(data) {
      //       return data.properties.message
      //     })
      //     .attr('fill', function(d) {
      //       return d.properties.color;
      //     });

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
      refresh();
      spin();
    }

    function position_labels() {
      var centerPos = proj.invert([width / 2, height / 2]);

      svg.selectAll('.label')
          .attr(
              'text-anchor',
              (d) => {
                var x = proj(d.geometry.coordinates)[0];
                return x < width / 2 - 20 ?
                    'end' :
                    x < width / 2 + 20 ? 'middle' : 'start'
              })
          .attr(
              'transform',
              (d) => {
                var loc = proj(d.geometry.coordinates), x = loc[0], y = loc[1];
                var offset = x < width / 2 ? -5 : 5;
                return 'translate(' + (x + offset) + ',' + (y - 2) + ')'
              })
          .style('display', (d) => {
            var d = d3.geoDistance(d.geometry.coordinates, centerPos);
            return (d > 1.57) ? 'none' : 'inline';
          })
    }

    function refresh() {
      svg.selectAll('.land').attr('d', path);
      svg.selectAll('.countries path').attr('d', path);
      svg.selectAll('.graticule').attr('d', path);
      svg.selectAll('.point').attr('d', path);
      position_labels();
    }

    var timer;
    function spin() {
      timer = d3.timer(function() {
        var dt = Date.now() - time;

        proj.rotate(
            [rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);

        refresh();
      });
    }

    function dragstarted() {
      timer.stop();
      v0 = versor.cartesian(proj.invert(d3.mouse(this)));
      r0 = proj.rotate();
      q0 = versor(r0);
    }

    function dragged() {
      var v1 = versor.cartesian(proj.rotate(r0).invert(d3.mouse(this))),
          q1 = versor.multiply(q0, versor.delta(v0, v1)),
          r1 = versor.rotation(q1);
      proj.rotate(r1);
      refresh();
    }
  }
}
