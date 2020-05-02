FROM ubuntu:latest
LABEL MAINTAINER="Arthur Tavares Bezerra <atbezerra@stefanini.com>"

##Install SSH 
RUN apt-get update
RUN apt-get install unzip
RUN apt-get install sudo
RUN apt-get install -y openssh-server 

#Setup SSH
RUN mkdir /var/run/sshd  
RUN echo 'root:root' |chpasswd  
RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config 
RUN sed -ri 's/^#?PermitUserEnvironment\s+.*/PermitUserEnvironment yes/' /etc/ssh/sshd_config 
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config  
RUN mkdir /root/.ssh
RUN apt-get clean 
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*  

#install Node 
RUN apt-get update
RUN apt-get install curl  -y 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install nodejs  -y 
RUN node -v
RUN npm -v

#Install PM2
RUN npm install pm2 -g


COPY ./ /artifacts/ 
ENV PORT 80
EXPOSE 22 80 5000

COPY ./run.sh .
RUN chmod 755 ./run.sh
CMD [ "./run.sh" ]