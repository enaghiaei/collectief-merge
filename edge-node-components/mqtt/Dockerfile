FROM eclipse-mosquitto:2.0.15

EXPOSE 1883

VOLUME ["/mosquitto/config"]
COPY set_pass.sh /set_pass.sh

RUN apk add expect
CMD ./set_pass.sh

EXPOSE 1883
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]