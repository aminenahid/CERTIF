FROM seegno/bitcoind:0.13-alpine
MAINTAINER Kim Duffy "kimhd@mit.edu"

RUN apk add --update \
        bash \
        ca-certificates \
        curl \
        gcc \
        gmp-dev \
        libffi-dev \
        libressl-dev \
        linux-headers \
        make \
        musl-dev \
        python \
        python3 \
        python3-dev \
        tar \
    && mkdir ~/.bitcoin \
    && echo $'rpcuser=foo\nrpcpassword=bar\nrpcport=8332\nregtest=1\nrelaypriority=0\nrpcallowip=127.0.0.1\nrpcconnect=127.0.0.1\n' > /root/.bitcoin/bitcoin.conf

ENTRYPOINT bitcoind -daemon && bash