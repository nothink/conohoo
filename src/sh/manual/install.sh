#!/bin/bash

# creating a single partition.
parted -s -a optimal /dev/vda -- mklabel msdos mkpart primary 1 -1 set 1 boot on
# creating file systems.
mkfs.ext4 -F /dev/vda1

# mounting the root partition
mount /dev/vda1 /mnt/gentoo

# copying chrooted install script
cp install-chroot.sh /mnt/gentoo/

# creating swapfile and swapon (4GB)
dd if=/dev/zero of=/mnt/gentoo/swapfile bs=1M count=4096
mkswap /mnt/gentoo/swapfile
swapon /mnt/gentoo/swapfile

# setting the datetime
ntpd -q -g

# downloading the gentoo stage tarball
cd /mnt/gentoo
curl http://ftp.iij.ad.jp/pub/linux/gentoo/releases/amd64/autobuilds/latest-stage3-amd64.txt | grep stage3-amd64 | sed -e 's/^/http:\/\/ftp.iij.ad.jp\/pub\/linux\/gentoo\/releases\/amd64\/autobuilds\//g' | sed -e 's/ [0-9]*$//g' | xargs curl -O
# unpacking the stage tarball
tar xpf stage3-* --xattrs-include='*.*' --numeric-owner

# TODO : edit /etc/portage/make.conf
# TODO : setting mirrors

# copy DNS info
cp --dereference /etc/resolv.conf /mnt/gentoo/etc/

# mounting the necessary filesystems
mount --types proc /proc /mnt/gentoo/proc
mount --rbind /sys /mnt/gentoo/sys
mount --make-rslave /mnt/gentoo/sys
mount --rbind /dev /mnt/gentoo/dev
mount --make-rslave /mnt/gentoo/dev

# chroot: entering the new env
chroot /mnt/gentoo /install-chroot.sh

# filanize.
cd
umount -l /mnt/gentoo/dev{/shm,/pts,}
umount -R /mnt/gentoo
reboot
