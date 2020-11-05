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

Thursday

- fix mobile logo on submit page
- radio button / check styling (30 mins)

- dialog modal functionality
- alert component making (not the page, but modal?) -> for different things
  > initial map loading [no click]
  > already submitted today. try again in 24 hours. [ok button]
  > when being submitted -> wait. [no click]
  > geo location added: [ok to proceed] [not ok]
- handle geo location not getting the values -> use promise instead of await
- drag around instruction element
- get updatedUsers after submittion (new method?)

- dialog modal design
- All view complete
- Deploy

Satuday

- Set up sungkwon.info on digital ocean (should be just an hour)
- sungkwon github io take down? (secret)
- 2 posts
- Git pro / git alias sort out
- linux journey book

Sunday

- birth and death of meaning

## NICE TO HAVE

http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8
