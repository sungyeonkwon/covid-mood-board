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
        return {
          type: 'Feature', properties: {
            message: user.message,
            name: user.name,
            gender: user.gender,
            age: user.age,
            profession: user.profession,
            is_anonymous: user.is_anonymous,
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
const INITIAL_SCALE = 700;
const SCALE_SPEED = 200;
const MIN_SCALE = 100;
const MAX_SCALE = 2500;

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
  tooltip: any;

  v0: any;
  r0: any;
  q0: any;
  v1: any;
  r1: any;
  q1: any;

  scale = INITIAL_SCALE;

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
    if (isZoomingIn) {
      if (this.scale + SCALE_SPEED <= MAX_SCALE) {
        this.scale += SCALE_SPEED;
      }
    } else {
      if (this.scale - SCALE_SPEED >= MIN_SCALE) {
        this.scale -= SCALE_SPEED;
      }
    }
    this.projection.scale(this.scale);
    this.svg.selectAll('circle').attr('r', this.projection.scale());
    this.refresh();
  }

  init() {
    this.projection = d3.geoOrthographic()
                          .scale(this.scale)
                          .translate([this.viewWidth / 2, this.viewHeight / 2])
                          .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection).pointRadius(8);

    var graticule = d3.geoGraticule();


    this.tooltip = d3.select('body')
                       .append('div')
                       .attr('class', 'tooltip')
                       .style('opacity', 0);

    this.svg = d3.select('#map-container')
                   .append('svg')
                   .style('fill', 'none')
                   .attr('width', this.viewWidth)
                   .attr('height', this.viewHeight);

    this.svg.call(
        d3.drag().on('start', this.dragstarted).on('drag', this.dragged));

    const ready = (_error, world, places, users) => {
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
          .attr('fill', (d) => d.properties.color)
          .on('mouseover',
              (d) => {
                const loc = this.projection(d.geometry.coordinates);
                const x = loc[0];
                const y = loc[1];

                const user = d.properties.is_anonymous ?
                    'Anonymous' :
                    `${d.properties.user}, ${d.properties.gender}, ${
                        d.properties.age}, ${d.properties.profession}`;

                this.tooltip.transition().duration(400).style('opacity', 1);
                this.tooltip
                    .html(`
                <p>${d.properties.message}</p>
                <span>${user}</span>
                `)
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .style('background', d.properties.color)
                    .style('opacity', 1);
                console.log('mosueoverr');
              })
          .on('mouseout', (d) => {
            this.tooltip.transition().duration(400).style('opacity', 0);
          });

      this.svg.append('g')
          .attr('class', 'labels')
          .selectAll('text')
          .data(places.features)
          .enter()
          .append('text')
          .attr('class', 'label')
          .text(function(d) {
            return d.properties.name
          });

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

  position_labels = () => {
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
  };

  refresh = () => {
    this.svg.selectAll('.land').attr('d', this.path);
    this.svg.selectAll('.graticule').attr('d', this.path);
    this.svg.selectAll('.point').attr('d', this.path);
    this.position_labels();
  };

  dragstarted = () => {
    const svg = document.querySelector('svg');
    this.timer.stop();
    this.v0 = versor.cartesian(this.projection.invert(d3.mouse(svg)));
    this.r0 = this.projection.rotate();
    this.q0 = versor(this.r0);
  };

  dragged = () => {
    const svg = document.querySelector('svg');
    this.v1 =
        versor.cartesian(this.projection.rotate(this.r0).invert(d3.mouse(svg)));
    this.q1 = versor.multiply(this.q0, versor.delta(this.v0, this.v1));
    this.r1 = versor.rotation(this.q1);
    this.projection.rotate(this.r1);
    this.refresh();
  };
}
