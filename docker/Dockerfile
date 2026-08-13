############################################################
# Image: blogdown-dev (2026 preservation toolchain)
#
# The 2017 toolchain (gulp 3, babel 6, browser-sync 2) requires an
# era-appropriate node: gulp 3's graceful-fs@3/natives dependency
# aborts the process on node >= 10, and node 8 has no native
# darwin-arm64 build, so the toolchain is containerized instead of
# pinned via .tool-versions. node 8 LTS is what the project shipped
# against in 2017.
#
# node:8.17.0-stretch (full, buildpack-deps based) is used instead of
# -slim/-alpine because debian stretch's apt repos are archived; the
# full image already ships the compilers (gcc, autoconf, libtool) that
# the imagemin-* postinstall scripts need to build jpegtran/gifsicle/
# optipng from source on linux/arm64, so no apt is needed.
############################################################

FROM node:8.17.0-stretch

WORKDIR /app

# debian stretch is EOL, so its packages live on archive.debian.org.
# optipng and jpegtran replace the x86-only binaries that imagemin's
# postinstall leaves behind on arm64 (see the symlinks below).
RUN printf 'deb http://archive.debian.org/debian stretch main\n' > /etc/apt/sources.list && \
    apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -y --no-install-recommends optipng libjpeg-progs && \
    rm -rf /var/lib/apt/lists/*

# --unsafe-perm: npm 6 drops privileges to `nobody` for lifecycle
# scripts when running as root, which breaks the imagemin postinstall
# binary builds inside their own package directories.
COPY package.json package-lock.json /app/
RUN npm ci --unsafe-perm --no-audit

# The optipng-bin/jpegtran-bin postinstalls have no arm64 prebuilt
# binaries and their from-source builds fail, leaving broken i386
# binaries in vendor/. Point them at the distro binaries instead —
# the same fix the original 2017 Dockerfile applied on alpine.
RUN ln -sf /usr/bin/optipng node_modules/optipng-bin/vendor/optipng && \
    ln -sf /usr/bin/jpegtran node_modules/jpegtran-bin/vendor/jpegtran

ENV PATH=/app/node_modules/.bin:$PATH

EXPOSE 8801

CMD ["npm", "start"]
