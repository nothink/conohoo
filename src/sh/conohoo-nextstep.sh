#!/bin/bash

# boot http progress server
cd /progress
PROGRESS_PATH=$(pwd)/progress
echo 'boot Debian' > $PROGRESS_PATH
nohup python3 -m http.server 80 &
#################################################################################
cd /

# copy kernel conf
cp /boot/config* /.config
touch /.config

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
# remove old kernels symlinks
rm /initrd.img /initrd.img.old /vmlinuz /vmlinuz.old

source /etc/profile

# installing the kernel sources 'gentoo-sources'
emerge sys-kernel/gentoo-sources
# copy config
mv /.config /usr/src/linux/
# build new kerenel
cd /usr/src/linux
make olddefconfig
yes ' ' | make localyesconfig

make && make modules_install
make install

# build initramfs
emerge sys-kernel/genkernel
genkernel --install initramfs

# installing grub2
emerge sys-boot/grub
grub-install /dev/vda
grub-mkconfig -o /boot/grub/grub.cfg

# shutdown
source /etc/profile
shutdown -h now
