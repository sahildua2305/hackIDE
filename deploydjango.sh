sudo apt-get -y install python-pip
sudo apt-get -y install nginx
sudo apt-get -y install wget
sudo pip install gunicorn 
wget https://raw.githubusercontent.com/yask123/nginx-conf/master/nginx.conf
sudo cp nginx.conf /etc/nginx/nginx.conf
sed -i -e 's?{{staticfilepath}}?'$PWD'/'$1'/collectstatic?g' nginx.conf
sudo service nginx restart
./manage.py collectstatic
gunicorn "$1.wsgi"
