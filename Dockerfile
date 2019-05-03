FROM hex4404/certif_back:1.4
MAINTAINER Hex4404

COPY /Blockcert_linker /blockcert
COPY /certificatif /certificatif

RUN apk --update add postgresql-dev \
	&& pip3 install -r /certificatif/requirements.txt \
	&& sed -i.bak s/'\.\.\/Blockcert_linker\/'/'\/blockcert\/'/g /certificatif/certificatif/views.py \
	&& pip3 install django-cors-headers
	
EXPOSE 5432
EXPOSE 8000

ENTRYPOINT bitcoind -daemon && bash
