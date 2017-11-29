#!/bin/bash


# remove old libs
rm -rf /lib_ /usr/lib_

# overwrite modprobe
emerge sys-apps/kmod

# recover fstab
cp /usr/share/baselayout/fstab /etc/fstab
# fix fstab
blkid /dev/vda2 -o value -s UUID | while read uuid; do echo UUID=$uuid / ext4 defaults,noatime,discard 0 1; done >> /etc/fstab

# remove old files
find / ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
source /etc/profile

# installing the kernel sources 'gentoo-sources'
emerge sys-kernel/gentoo-sources
# build new kerenel
cd /usr/src/linux
make defconfig
make localyesconfig
make && make modules_install
make install

# build initramfs
emerge --ask sys-kernel/genkernel
genkernel --install initramfs

# installing grub2
emerge sys-boot/grub:2
grub-install /dev/vda
grub-mkconfig -o /boot/grub/grub.cfg

echo 'install new bootloader' >> /install.log

# shutdown
source /etc/profile
sync; reboot -f
