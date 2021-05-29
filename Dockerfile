FROM python:2.7-buster
RUN apt-get install default-libmysqlclient-dev libcurl4-openssl-dev
# fix mysql error: ‘MYSQL {aka struct st_mysql}’ has no member named ‘reconnect’
RUN sed '/st_mysql_options options;/a unsigned int reconnect;' /usr/include/mysql/mysql.h -i.bkp

RUN useradd -ms /bin/bash app_runner
USER app_runner

ENV PYTHONBUFFERED=1
ENV PATH "$PATH:/home/app_runner/.local/bin"

WORKDIR /home/app_runner/code

COPY requirements.txt /home/app_runner/code/
RUN pip install -r requirements.txt
COPY . /home/app_runner/code/
USER root
RUN chown -R app_runner:app_runner *
USER app_runner
