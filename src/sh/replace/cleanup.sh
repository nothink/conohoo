#!/bin/bash

PROGRESS_DIR=/progress
PROGRESS_PATH=/progress/progress

# boot http progress server
if [ ! -d $PROGRESS_DIR ]; then
    mkdir $PROGRESS_DIR
fi
cd /progress
echo 'boot Stage3' > $PROGRESS_PATH
nohup python3 -m http.server 80 &
#################################################################################
cd /

# copy .config
echo 'copy .config' > $PROGRESS_PATH
cp /boot/config* /.config
touch /.config

# remove old libs
echo 'remove old libs' > $PROGRESS_PATH
rm -rf /lib_ /usr/lib_

# overwrite modprobe
echo 'overwrite modprobe' > $PROGRESS_PATH
emerge sys-apps/kmod

# create swapfile (4GB)
dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# recover and fix fstab
echo 'recover and fix fstab' > $PROGRESS_PATH
cp /usr/share/baselayout/fstab /etc/fstab
blkid /dev/vda2 -o value -s UUID | while read uuid; do echo UUID=$uuid / ext4 defaults,noatime,discard 0 1; done >> /etc/fstab
echo /swapfile none swap sw,loop 0 0 >> /etc/fstab

# remove old files
echo 'remove old files' > $PROGRESS_PATH
find / ! -newermt "1970-01-02" -print0 | xargs -0 rm -rf
rm /initrd.img /initrd.img.old /vmlinuz /vmlinuz.old

source /etc/profile

# install the kernel sources
echo 'install the kernel sources' > $PROGRESS_PATH
emerge sys-kernel/gentoo-sources
# build new kerenel
echo 'build new kerenel' > $PROGRESS_PATH
mv /.config /usr/src/linux/
cd /usr/src/linux
make olddefconfig
# localmodconfig / localyesconfig has sometimes wait for input
emerge expect
expect -c "
    set timeout 120
    spawn make localmodconfig
    while {1} {
        expect \"(NEW)\" {
            send \"\n\"
            interact
        }
    }
"
expect -c "
    set timeout 120
    spawn make localyesconfig
    while {1} {
        expect \"(NEW)\" {
            send \"\n\"
            interact
        }
    }
"

make && make modules_install
make install

# build initramfs
echo 'build initramfs' > $PROGRESS_PATH
emerge sys-kernel/genkernel
genkernel --install initramfs

# install grub2
echo 'install grub' > $PROGRESS_PATH
emerge sys-boot/grub
grub-install /dev/vda
grub-mkconfig -o /boot/grub/grub.cfg

# remove progress
rm -rf $PROGRESS_DIR

# remove self
rm /etc/local.d/cleanup.start

# shutdown
#shutdown -h now
