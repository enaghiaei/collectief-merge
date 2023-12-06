FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN apt-get update && apt-get install wget
RUN apt-get -y install nano
RUN apt-get -y install htop
RUN apt-get -y install cron
RUN touch /var/log/cron.log
CMD cron && tail -f /var/log/cron.log
RUN export EDITOR="/usr/bin/nano"
RUN (crontab -l ; echo "*/7 * * * * curl api:3002/temperature_per_hour_quarter") | crontab
RUN (crontab -l ; echo "*/3 * * * * curl api:3002/check_notifications") | crontab
RUN (crontab -l ; echo "*/5 * * * * curl api:3002/check_sensors") | crontab
RUN (crontab -l ; echo "*/1 * * * * curl api:3002/test_connection >> /var/log/cron.log 2>&1") | crontab
RUN (crontab -l ; echo "*/1 * * * * curl api:3002/update_sensor_list") | crontab
RUN (crontab -l ; echo "*/1 * * * * curl api:3002/check_get_from_qpe") | crontab
