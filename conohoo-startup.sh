#!/bin/bash

# installing bzip2
apt-get --force-yes install bzip2

# save fstab temporary
cp /etc/fstab /tmp/fstab

# change all file's datetime to epoch (withdout modprobe)
mv /sbin/modprobe /sbin/.modprobe
find / -print0 | xargs -0 touch -d "1970-01-01 00:00 +0000" -m
mv /sbin/.modprobe /sbin/modprobe

# downloading the gentoo stage tarball
cd /tmp
# for Debian (not curl, but wget)
wget http://ftp.iij.ad.jp/pub/linux/gentoo/releases/amd64/autobuilds/latest-stage3-amd64.txt; cat latest-stage3-amd64.txt | grep stage3-amd64 | sed -e 's/^/http:\/\/ftp.iij.ad.jp\/pub\/linux\/gentoo\/releases\/amd64\/autobuilds\//g' | sed -e 's/ [0-9]*$//g' | xargs wget

# unpacking the stage tarball
tar xvjpf stage3-*.tar.bz2 --xattrs --numeric-owner -C /

# move lib dirs temporary, and regen symlinks
mv /lib /lib_ && ln -s /lib64 /lib
mv /usr/lib /usr/lib_ && ln -s /usr/lib64 /usr/lib

# recover fstab
cp /tmp/fstab /etc/fstab

# into Gentoo bash!
source /etc/profile

###############################

# change password root to 'conohoo37564'
echo root:conohoo37564 | /usr/sbin/chpasswd

# installing an ebuild repository snapshot from the web
emerge-webrsync

# set timezone
echo "Asia/Tokyo" > /etc/timezone

# configure locales
sed -i 's/^#en_US.UTF-8 UTF-8$/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/^#ja_JP.UTF-8 UTF-8$/ja_JP.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
env-update
source /etc/profile

# configuring the network to dhcp client
echo config_eth0=\"dhcp\" >> /etc/conf.d/net
# automatically start networking at boot
cd /etc/init.d
ln -s net.lo net.eth0
rc-update add net.eth0 default

# automatically start sshd at boot
rc-update add sshd default

# fix PermitRootLogin
sed -i 's/^#PermitRootLogin prohibit-password$/PermitRootLogin yes/' /etc/ssh/sshd_config

# installing networking tools (dhcpcd)
emerge net-misc/dhcpcd

# remove old setting files
#find ./ -newermt "1970-01-01" ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
find /etc ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
source /etc/profile

sync; reboot -f
