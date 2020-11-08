# CovidMoodBoard

## Development server

FE: localhost:4200
FE build

# production

on frontend/
`npm run build`

`sudo systemctl restart nginx`
`sudo systemctl restart covid-mood-board`

# trouble shtting

502 Bad Gateway

# TODO

FE TODO: change api so that it doesn'

## stack

angular
flask
postgres server on digital ocean
webserver on digital ocean

`https://covid-mood.world`

d3

<!-- http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8 -->

deploy

<!-- https://www.digitalocean.com/community/questions/how-to-use-the-postgresql-droplet-with-nodejs -->

https://www.digitalocean.com/docs/databases/postgresql/how-to/import-databases/

# TIL:

gunicorn wsgi
diff between 0.0.0.0 host?
ports?

WorkingDirectory=/home/sung/covid-mood-board
Environment="PATH=/home/sung/covid-mood-board/venv/bin"
ExecStart=/home/sung/covid-mood-board/venv/bin/gunicorn --workers 3 --bind unix:covid-mood-board.sock -m 007 wsgi:app

sudo vim /etc/nginx/sites-available/covid-mood-board

sudo certbot --nginx -d covid-mood.world -d www.covid-mood.world
sudo vim /etc/nginx/sites-available/covid-mood.world

sudo mkdir -p /var/www/covid-mood.world/html

sudo chown -R $USER:$USER /var/www/covid-mood.world/html
sudo chmod -R 755 /var/www/covid-mood.world

vi /var/www/covid-mood.world/html/index.html
sudo vi /etc/nginx/sites-available/covid-mood.world

        server_name covid-mood.world www.covid-mood.world;

sudo certbot --nginx -d covid-mood.world -d www.covid-mood.world

# DIGITAL OCEAN DROPLET

sudo reboot
login: root
pass: pass

ssh sung@ip

trouble shotting
sudo tail -30 /var/log/nginx/error.log

# TODO

## MUST

NICE TO HAVEs

[x] make percentage info in list view
[x] make filtering in list view
[x] make that mobile compatible

- update social media picture
- update point on zoom

- spain, russia promotion

----------\

- mobile button size adjustment
- update map on resize
- already submitted today. try again in 24 hours. [ok button]
- drag around instruction element

- Deploy
- reddit / twitter annoucement

Friday

- Set up sungkwon.info on digital ocean (should be just an hour)
- sungkwon github io take down? (secret)
- 2 posts
- Git pro / git alias sort out
- linux journey book

Sunday

- birth and death of meaning

## NICE TO HAVE

http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8
