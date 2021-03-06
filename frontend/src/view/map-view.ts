import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {animationFrameScheduler, BehaviorSubject, fromEvent, Observable, of, ReplaySubject} from 'rxjs';
import {map, repeat, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {UserService} from 'src/shared/user_service';

import {Mood, MoodColourMap, User} from '../constants/constants';
import {getPercentage} from '../shared/helpers';
import {StyleService} from '../shared/style_service';

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
      return users.reverse().map((user) => {
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
const VELOCITY = [.0065, -0];
const SCALE_POINTS = [150, 200, 250, 350, 500, 630, 1400, 2500, 3800];
const POINT_MAX = 22;
const POINT_MIN = 10;
const BAR_SCALAR = 5;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);
  readonly BAR_SCALAR = BAR_SCALAR;
  readonly moodList =
      Object.values(Mood).filter((mood) => mood !== 'undefined');

  getPercentage = getPercentage;
  moodRef = Mood;

  users: User[];

  scaleIndex = 5;
  projection: any;

  viewHeight = 0;
  viewWidth = 0;
  svg: any;
  path: any;
  time = Date.now();
  isSpinning$ = new ReplaySubject<void>(1)
  timer$ = of(null, animationFrameScheduler)
               .pipe(repeat(), takeUntil(this.isSpinning$))
  tooltip: any;

  v0: any;
  r0: any;
  q0: any;
  v1: any;
  r1: any;
  q1: any;
  dt: number;

  scale = SCALE_POINTS[this.scaleIndex];

  constructor(
      private readonly activatedRoute: ActivatedRoute,
      private readonly userService: UserService,
  ) {
    (this.activatedRoute.data as Observable<any>)  // TODO: type
        .pipe(
            map(data => data.users.filter(
                    users => !!users.latitude && !!users.longitude)),
            tap((users) => {
              this.users = users;
              this.userService.loaded$.next(true);
            }))
        .subscribe();  // TODO: add interface for users data
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.isSpinning$.next();
    this.svg.on('mouseover', null);
    this.svg.on('mouseout', null);
    d3.drag().on('start', null);
    d3.drag().on('drag', null);
  }

  private initScale() {
    if (this.viewWidth < 400) {
      this.scaleIndex = 1;
    } else if (this.viewWidth < 800) {
      this.scaleIndex = 2;
    }
    this.scale = SCALE_POINTS[this.scaleIndex];
  }

  ngOnInit() {
    this.viewHeight = document.documentElement.clientHeight;
    this.viewWidth = document.documentElement.clientWidth;
    this.initScale();
    this.init();

    fromEvent(window, 'resize').pipe(throttleTime(30)).subscribe(() => {
      this.viewHeight = document.documentElement.clientHeight;
      this.viewWidth = document.documentElement.clientWidth;

      this.projection.translate([this.viewWidth / 2, this.viewHeight / 2]);
      this.svg.attr('width', this.viewWidth).attr('height', this.viewHeight);
      d3.selectAll('.noclicks')
          .attr('cx', this.viewWidth / 2)
          .attr('cy', this.viewHeight / 2);
      this.position_labels();
      this.refresh();
    })
  }

  zoom(isZoomingIn = true) {
    if (isZoomingIn) {
      if (this.scaleIndex < SCALE_POINTS.length - 1) {
        this.scaleIndex += 1;
        this.scale = SCALE_POINTS[this.scaleIndex];
      }
    } else {
      if (this.scaleIndex >= 1) {
        this.scaleIndex -= 1;
        this.scale = SCALE_POINTS[this.scaleIndex];
      }
    }
    this.projection.scale(this.scale);
    this.path.pointRadius(this.getPointScale(this.scale));
    this.svg.selectAll('circle').attr('r', this.projection.scale());
    this.refresh();
  }

  getPointScale(x: number) {
    const end = SCALE_POINTS[SCALE_POINTS.length - 1];
    const start = SCALE_POINTS[0];
    const pos = (x - start) / (end - start);
    return Math.floor(pos * (POINT_MAX - POINT_MIN) + POINT_MIN);
  }

  init() {
    this.projection = d3.geoOrthographic()
                          .scale(this.scale)
                          .translate([this.viewWidth / 2, this.viewHeight / 2])
                          .clipAngle(90);

    this.path = d3.geoPath()
                    .projection(this.projection)
                    .pointRadius(this.getPointScale(this.scale));

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
          .attr('offset', '100%')
          .attr('stop-color', 'black');

      var globe_highlight = this.svg.append('defs')
                                .append('radialGradient')
                                .attr('id', 'globe_highlight')
                                .attr('cx', '75%')
                                .attr('cy', '25%');
      globe_highlight.append('stop')
          .attr('offset', '20%')
          .attr('stop-color', '#fff')
          .attr('stop-opacity', '0.4');
      globe_highlight.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#66687a')
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
          .attr('stroke', 'white')
          .on('mouseover',
              (d) => {
                const loc = this.projection(d.geometry.coordinates);
                const x = loc[0];
                const y = loc[1];

                const user = d.properties.is_anonymous ?
                    'Anonymous' :
                    `${d.properties.name}, ${d.properties.gender}, ${
                        d.properties.age}, ${d.properties.profession}`;

                this.tooltip.transition().duration(400).style('opacity', 1);

                this.tooltip
                    .html(`
                <p>${d.properties.message}</p>
                <span>${user}</span>
                `)
                    .style('top', y + 'px')
                    .style('background', d.properties.color)
                    .style('opacity', 1);

                // if it's on the right hand side reposition tooltip
                const isRight = x >= this.viewWidth / 2;
                const PADDING = 40;

                if (isRight) {
                  this.tooltip.style('right', this.viewWidth - x + 'px')
                      .style('left', 'unset')
                      .style('width', x - PADDING + 'px');
                } else {
                  this.tooltip.style('left', x + 'px')
                      .style('right', 'unset')
                      .style('width', this.viewWidth - x - PADDING + 'px');
                }

                const {height} = this.tooltip.node().getBoundingClientRect();
                if (height > this.viewHeight - y) {
                  this.tooltip.style('top', this.viewHeight - height + 'px');
                }
              })
          .on('mouseout', () => {
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
    this.timer$.subscribe(() => {
      this.dt = Date.now() - this.time;

      this.projection.rotate([
        ROTATE[0] + VELOCITY[0] * this.dt, ROTATE[1] + VELOCITY[1] * this.dt
      ]);

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
    this.isSpinning$.next();
    this.v0 = versor.cartesian(this.projection.invert(d3.mouse(svg)));
    this.r0 = this.projection.rotate();
    this.q0 = versor(this.r0);

    this.tooltip.transition().duration(400).style('opacity', 0);
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
