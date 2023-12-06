FROM python:3.11.2

WORKDIR /hub_core

COPY ./hub_core /hub_core
COPY ./mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz /root/
RUN tar -zxf /root/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz --strip-components=1 -C /usr
RUN rm -rf /root/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz
#RUN wget https://dlm.mariadb.com/2678574/Connectors/c/connector-c-3.3.3/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz -O - | tar -zxf - --strip-components=1 -C /usr
COPY ./requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
