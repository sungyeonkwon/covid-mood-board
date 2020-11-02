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
  let v1: any;
  let r1: any;
  let q1: any;
  let proj: any;
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

function delayedUsers(users, callback) {
  const serializedUsers = serialize(users);
  callback(null, serializedUsers);
}

const ROTATE = [39.666666666666664, -30];
const VELOCITY = [.005, -0];

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.scss']
})
export class MapViewComponent implements OnInit {
  private users: User[];

  projection: any;

  viewHeight = 0;
  viewWidth = 0;
  svg: any;
  path: any;
  time = Date.now();
  timer: any;

  v0: any;
  r0: any;
  q0: any;
  v1: any;
  r1: any;
  q1: any;

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

  zoom(isZoomingIn = true) {
    console.log('proj', this.projection);
    if (isZoomingIn) {
      // this.projection
    } else {
    }
  }

  init() {
    var v0, r0, q0, v1, r1, q1;

    this.projection = d3.geoOrthographic()
                          .scale(730)
                          .translate([this.viewWidth / 2, this.viewHeight / 2])
                          .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection).pointRadius(8);

    var graticule = d3.geoGraticule();

    this.svg = d3.select('#map-container')
                   .append('svg')
                   .attr('width', this.viewWidth)
                   .attr('height', this.viewHeight);

    this.svg.call(d3.drag()
                      .on('start', this.dragstarted.bind(this))
                      .on('drag', this.dragged.bind(this)));

    const ready = (error, world, places, users) => {
      var ocean_fill = this.svg.append('defs')
                           .append('radialGradient')
                           .attr('id', 'ocean_fill')
                           .attr('cx', '75%')
                           .attr('cy', '25%');
      ocean_fill.append('stop')
          .attr('offset', '5%')
          .attr('stop-color', 'lightgrey');
      ocean_fill.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#9ab');

      var globe_highlight = this.svg.append('defs')
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

      this.svg.append('circle')
          .attr('cx', this.viewWidth / 2)
          .attr('cy', this.viewHeight / 2)
          .attr('r', this.projection.scale())  // here
          .attr('class', 'noclicks')
          .style('fill', 'url(#ocean_fill)');

      this.svg.append('path')
          .datum(topojson.object(world, world.objects.land))
          .attr('class', 'land')
          .attr('d', this.path);

      this.svg.append('path')
          .datum(graticule)
          .attr('class', 'graticule noclicks')
          .attr('d', this.path);

      this.svg.append('circle')
          .attr('cx', this.viewWidth / 2)
          .attr('cy', this.viewHeight / 2)
          .attr('r', this.projection.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_highlight)');

      this.svg.append('circle')
          .attr('cx', this.viewWidth / 2)
          .attr('cy', this.viewHeight / 2)
          .attr('r', this.projection.scale())
          .attr('class', 'noclicks')
          .style('fill', 'url(#globe_shading)');

      this.svg.append('g')
          .attr('class', 'points')
          .selectAll('text')
          .data(users)
          .enter()
          .append('path')
          .attr('class', 'point')
          .attr('d', this.path)
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

      this.svg.append('g')
          .attr('class', 'labels')
          .selectAll('text')
          .data(places.features)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text(function(d) {
            return d.properties.name
          })

              this.position_labels();
      this.refresh();
      this.spin();
    };

    queue()
        .defer(d3.json, 'assets/world-110m.json')
        .defer(d3.json, 'assets/places.json')
        .defer(delayedUsers, this.users)
        .await(ready);  // await callback to be called when all of the tasks
                        // complete
  }

  spin = () => {
    this.timer = d3.timer(() => {
      var dt = Date.now() - this.time;

      this.projection.rotate(
          [ROTATE[0] + VELOCITY[0] * dt, ROTATE[1] + VELOCITY[1] * dt]);

      this.refresh();
    });
  };

  position_labels() {
    var centerPos =
        this.projection.invert([this.viewWidth / 2, this.viewHeight / 2]);

    this.svg.selectAll('.label')
        .attr(
            'text-anchor',
            (d) => {
              var x = this.projection(d.geometry.coordinates)[0];
              return x < this.viewWidth / 2 - 20 ?
                  'end' :
                  x < this.viewWidth / 2 + 20 ? 'middle' : 'start'
            })
        .attr(
            'transform',
            (d) => {
              var loc = this.projection(d.geometry.coordinates), x = loc[0],
                  y = loc[1];
              var offset = x < this.viewWidth / 2 ? -5 : 5;
              return 'translate(' + (x + offset) + ',' + (y - 2) + ')'
            })
        .style('display', (d) => {
          var d = d3.geoDistance(d.geometry.coordinates, centerPos);
          return (d > 1.57) ? 'none' : 'inline';
        })
  }

  refresh = () => {
    this.svg.selectAll('.land').attr('d', this.path);
    this.svg.selectAll('.graticule').attr('d', this.path);
    this.svg.selectAll('.point').attr('d', this.path);
    this.position_labels();
  };


  dragstarted = () => {
    console.log('dragstarted', this);

    this.timer.stop();
    console.log('1');
    v0 = versor.cartesian(this.projection.invert(d3.mouse(this)));
    console.log('2');
    r0 = this.projection.rotate();
    q0 = versor(r0);
    console.log('v0', v0);
    console.log('r0', r0);
    console.log('q0', q0);
  };

  dragged = () => {
    console.log('dragged');

    v1 = versor.cartesian(this.projection.rotate(r0).invert(d3.mouse(this)));
    q1 = versor.multiply(q0, versor.delta(v0, v1));
    r1 = versor.rotation(q1);
    this.projection.rotate(r1);
    this.refresh();
  };
}
