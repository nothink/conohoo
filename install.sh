#!/bin/sh

# creating a single partition.
parted -s -a optimal /dev/vda -- mklabel msdos mkpart primary 1 -1 set 1 boot on
# creating file systems.
mkfs.ext4 /dev/vda1

# mounting the root partition
mount /dev/vda1 /mnt/gentoo

# setting the datetime
ntpd -q -g

# downloading the gentoo stage tarball
cd /mnt/gentoo
curl http://ftp.iij.ad.jp/pub/linux/gentoo/releases/amd64/autobuilds/latest-stage3-amd64.txt | grep stage3-amd64 | sed -e 's/^/http:\/\/ftp.iij.ad.jp\/pub\/linux\/gentoo\/releases\/amd64\/autobuilds\//g' | sed -e 's/ [0-9]*$//g' | xargs curl -O
# unpacking the stage tarball
tar xvjpf stage3-*.tar.bz2 --xattrs --numeric-owner

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
chroot /mnt/gentoo /bin/bash
source /etc/profile

# installing an ebuild repository snapshot from the web
emerge-webrsync
# updating the ebuild repository
emerge --sync

# mark news items as read
eselect news read

# updating the @world
emerge --update --deep --newuse @world

echo "Asia/Tokyo" > /etc/timezone

# configure locales
sed -i 's/^#en_US.UTF-8 UTF-8$/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/^#ja_JP.UTF-8 UTF-8$/ja_JP.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
env-update && source /etc/profile

# installing the kernel sources 'gentoo-sources'
emerge sys-kernel/gentoo-sources
# installing the kernel using genkernel
emerge sys-kernel/genkernel
genkernel all

# creating the fstab file
blkid /dev/vda1 -o value -s UUID | while read uuid; do echo UUID=$uuid / ext4 defaults,noatime,discard 0 1; done >> /etc/fstab

# configuring the network
echo config_eth0=\"dhcp\" >> /etc/conf.d/net
# automatically start networking at boot
cd /etc/init.d
ln -s net.lo net.eth0
rc-update add net.eth0 default

# installing the system logger(sysklogd)
emerge app-admin/sysklogd
rc-update add sysklogd default

# installing the cron daemon(cronie)
emerge sys-process/cronie
rc-update add cronie default

# automatically start sshd at boot
rc-update add sshd default

# installing filesystem tools
emerge sys-fs/e2fsprogs

# installing networking tools (dhcpcd)
emerge net-misc/dhcpcd

# installing grub2
emerge sys-boot/grub:2
grub-install /dev/vda
grub-mkconfig -o /boot/grub/grub.cfg

# change password reboot
echo root:conohoo37564 | /usr/sbin/chpasswd

# rebooting the systems
exit
cd
umount -l /mnt/gentoo/dev{/shm,/pts,}
umount -R /mnt/gentoo
reboot
