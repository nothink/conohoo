#!/bin/bash

PASS=conoha

PROGRESS_DIR=/progress
PROGRESS_PATH=/progress/progress

# boot http progress server
if [ ! -d $PROGRESS_DIR ]; then
    mkdir $PROGRESS_DIR
fi
cd /progress
echo 'boot Debian' > $PROGRESS_PATH
nohup python3 -m http.server 80 &
#################################################################################
cd /

# install bzip2
echo 'install bzip2' > $PROGRESS_PATH
apt-get --force-yes install bzip2

# save fstab temporary
echo 'save fstab temporary' > $PROGRESS_PATH
cp /etc/fstab /tmp/fstab

# change datetime of all files to epoch (withdout modprobe)
echo 'change all files datetime to epoch' > $PROGRESS_PATH
mv /sbin/modprobe /sbin/.modprobe
find / -print0 | xargs -0 touch -d "1970-01-01 00:00 +0000" -m
mv /sbin/.modprobe /sbin/modprobe

# download the gentoo stage tarball
echo 'download the gentoo stage tarball' > $PROGRESS_PATH
cd /tmp
# for Debian (not curl, but wget)
wget http://ftp.iij.ad.jp/pub/linux/gentoo/releases/amd64/autobuilds/latest-stage3-amd64.txt; cat latest-stage3-amd64.txt | grep stage3-amd64 | sed -e 's/^/http:\/\/ftp.iij.ad.jp\/pub\/linux\/gentoo\/releases\/amd64\/autobuilds\//g' | sed -e 's/ [0-9]*$//g' | xargs wget

# unpack the stage tarball
echo 'unpack the stage tarball' > $PROGRESS_PATH
tar xvjpf stage3-*.tar.bz2 --xattrs --numeric-owner -C /

# move lib dirs temporary, and regen symlinks
echo 'move lib dirs temporary, and regen symlinks' > $PROGRESS_PATH
mv /lib /lib_ && ln -s /lib64 /lib
mv /usr/lib /usr/lib_ && ln -s /usr/lib64 /usr/lib

# recover fstab
echo 'recover fstab' > $PROGRESS_PATH
cp /tmp/fstab /etc/fstab

# into Gentoo bash!
echo 'into Gentoo bash!' > $PROGRESS_PATH
source /etc/profile

#################################################################################

# change password root
echo 'change password root' > $PROGRESS_PATH
echo root:$PASS | /usr/sbin/chpasswd

# install an ebuild repository snapshot from the web
echo 'install an ebuild repository snapshot from the web' > $PROGRESS_PATH
emerge-webrsync

# set timezone
echo 'set timezone' > $PROGRESS_PATH
echo "Asia/Tokyo" > /etc/timezone

# configure locales
echo 'configure locales' > $PROGRESS_PATH
sed -i 's/^#en_US.UTF-8 UTF-8$/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/^#ja_JP.UTF-8 UTF-8$/ja_JP.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
env-update
source /etc/profile

# configure the network
echo 'configure the network' > $PROGRESS_PATH
echo config_eth0=\"dhcp\" >> /etc/conf.d/net
cd /etc/init.d
ln -s net.lo net.eth0
rc-update add net.eth0 default

# automatically start sshd at boot
echo 'automatically start sshd at boot' > $PROGRESS_PATH
rc-update add sshd default

# fix PermitRootLogin
echo 'fix PermitRootLogin' > $PROGRESS_PATH
sed -i 's/^#PermitRootLogin prohibit-password$/PermitRootLogin yes/' /etc/ssh/sshd_config

# install networking tools (dhcpcd)
echo 'install networking tools (dhcpcd)' > $PROGRESS_PATH
emerge net-misc/dhcpcd

# remove old setting files
echo 'remove old setting files' > $PROGRESS_PATH
find /etc ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
source /etc/profile

# set next cleanup script
cd /
wget https://raw.githubusercontent.com/nothink/conohoo/master/src/sh/replace/cleanup.sh
mv cleanup.sh /etc/local.d/cleanup.sh

sync; reboot -f
