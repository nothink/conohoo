#!/bin/bash

PASS=conoha_hinnyuu

PROGRESS_DIR=/progress
PROGRESS_PATH=$PROGRESS_DIR/progress

# Boot http progress server
if [ ! -d $PROGRESS_DIR ]; then
    mkdir $PROGRESS_DIR
fi
cd $PROGRESS_DIR
echo '1/24: Booting Debian' > $PROGRESS_PATH
nohup python3 -m http.server 80 &
#################################################################################
cd /

# install bzip2
apt-get --force-yes install bzip2

# save fstab temporary
cp /etc/fstab /tmp/fstab

# change datetime of all files to epoch (withdout modprobe)
echo '2/24: Changing datetime of all files to epoch' > $PROGRESS_PATH
mv /sbin/modprobe /sbin/.modprobe
find / -print0 | xargs -0 touch -d "1970-01-01 00:00 +0000" -m
mv /sbin/.modprobe /sbin/modprobe

# get next cleanup script
cd /
wget https://raw.githubusercontent.com/nothink/conohoo/master/src/sh/replace/cleanup.sh -O /cleanup.sh

# download the gentoo stage tarball
echo '3/24: Downloading the gentoo stage tarball' > $PROGRESS_PATH
cd /tmp
# for Debian (not curl, but wget)
wget http://ftp.iij.ad.jp/pub/linux/gentoo/releases/amd64/autobuilds/latest-stage3-amd64.txt; cat latest-stage3-amd64.txt | grep stage3-amd64 | sed -e 's/^/http:\/\/ftp.iij.ad.jp\/pub\/linux\/gentoo\/releases\/amd64\/autobuilds\//g' | sed -e 's/ [0-9]*$//g' | xargs wget

# unpack the stage tarball
echo '4/24: Unpacking the stage3 tarball' > $PROGRESS_PATH
tar xvjpf stage3-*.tar.bz2 --xattrs --numeric-owner -C /

# move lib dirs temporary, and regen symlinks
echo '5/24: Moving lib dirs temporary, and regen symlinks' > $PROGRESS_PATH
mv /lib /lib_ && ln -s /lib64 /lib
mv /usr/lib /usr/lib_ && ln -s /usr/lib64 /usr/lib

# recover fstab
cp /tmp/fstab /etc/fstab

# into Gentoo bash!
echo '6/24: Into Gentoo bash!' > $PROGRESS_PATH
source /etc/profile

#################################################################################

# change password root
echo root:$PASS | /usr/sbin/chpasswd

# install an ebuild repository snapshot from the web
echo '7/24: Installing an ebuild repository snapshot from the web' > $PROGRESS_PATH
emerge-webrsync

# set timezone
echo "Asia/Tokyo" > /etc/timezone

# configure locales
echo '8/24: Configuring locales' > $PROGRESS_PATH
sed -i 's/^#en_US.UTF-8 UTF-8$/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/^#ja_JP.UTF-8 UTF-8$/ja_JP.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
env-update
source /etc/profile

# configure the network
echo '9/24: Configuring the network' > $PROGRESS_PATH
echo config_eth0=\"dhcp\" >> /etc/conf.d/net
cd /etc/init.d
ln -s net.lo net.eth0
rc-update add net.eth0 default

# automatically start sshd at boot
rc-update add sshd default
# fix PermitRootLogin
sed -i 's/^#PermitRootLogin prohibit-password$/PermitRootLogin yes/' /etc/ssh/sshd_config

# install networking tools (dhcpcd)
echo '10/24: Installing networking tools (dhcpcd)' > $PROGRESS_PATH
emerge net-misc/dhcpcd

# remove old setting files
echo '11/24: Removing old setting files' > $PROGRESS_PATH
find /etc ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
source /etc/profile

# move next sctipt to /etc/local.d
mv /cleanup.sh /etc/local.d/cleanup.start
chmod 755 /etc/local.d/cleanup.start

sync; reboot -f
