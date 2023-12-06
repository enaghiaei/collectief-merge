FROM python:3.11.2

WORKDIR /app

# for now migrations are straight up copied in order to keep structure homogenous across all edge nodes
COPY ./requirements.txt /app/requirements.txt
# todo save the .tar file in a common volume for both
#COPY ./mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz /root/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz
RUN #tar -zxf /root/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz --strip-components=1 -C /usr
RUN #rm -rf /root/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz
RUN wget https://dlm.mariadb.com/2678574/Connectors/c/connector-c-3.3.3/mariadb-connector-c-3.3.3-debian-bullseye-amd64.tar.gz -O - | tar -zxf - --strip-components=1 -C /usr
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt
    # Note: we had to merge the two "pip install" package lists here, otherwise
    # the last "pip install" command in the OP may break dependency resolution…
COPY ./migration /app/migration
COPY ./__init__.py /app/__init__.py
COPY ./main.py /app/main.py
COPY ./models.py /app/models.py
COPY ./version_manager.py /app/version_manager.py
COPY ./hub_core_wrapper.py /app/hub_core_wrapper.py