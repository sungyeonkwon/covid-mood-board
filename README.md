# CovidMoodBoard

## Development server

FE: localhost:4200

FE build

# production

on frontend/
`npm run build`

on root
`gcloud app deploy`

## stack

angular
flask
postgres server on digital ocean
webserver on digital ocean

- covid-mood.world

d3

<!-- http://bl.ocks.org/tlfrd/df1f1f705c7940a6a7c0dca47041fec8 -->

deploy

<!-- https://www.digitalocean.com/community/questions/how-to-use-the-postgresql-droplet-with-nodejs -->

https://www.digitalocean.com/docs/databases/postgresql/how-to/import-databases/

TIL:
gunicorn
diff between 0.0.0.0 host?
ports?
wsgi

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

sudo systemctl restart nginx
sudo systemctl restart covid-mood-board

# TODO

env: if local, use external ip for databse

if prod, use interal ip for database
