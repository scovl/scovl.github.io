---
layout: post
title: Troubleshooting - 001
snip: Resolving complex filesystem problems - [EN]
tags: troubleshooting fedora 
---


### Ext4 - Filesystem

###### GPT

Let's think of a scenario where we build a basic partitioning layout of the Linux file system:

```
/ - Root partition
/boot - Boot partition
/home - Home partition
swap - Swap partition
```

In the `/etc/fstab` file, this layout looks like this:

```
# /etc/fstab
# Created by anaconda on xxx
#
# Accessible filesystems, by reference, are maintained under '/dev/disk/'.
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info.
#
UUID=9038feb4-be33-4160-a95e-22bd56543c2a /                       ext4    defaults        1 1
UUID=d49db5f7-7669-474d-bcdb-15451a6e1d8c /boot                   ext4    defaults        1 2
UUID=67b83e06-bc52-463a-a73f-d05efad45a03 /home                   ext4    defaults        1 2
UUID=deedc1e3-84dd-465c-bbba-412b4643a7d3 swap                    swap    defaults        0 0
```

> **Note**: [See Redhat recommended partitioning layout](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/installation_guide/s2-diskpartrecommend-x86){:target="_blank"}

With the `lsblk` command, we can see the devices listed in block:

```
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 465.8G  0 disk 
├─sda1   8:1    0     1G  0 part /boot
├─sda2   8:2    0 308.9G  0 part /home
├─sda3   8:3    0   5.9G  0 part [SWAP]
├─sda4   8:4    0     1K  0 part 
└─sda5   8:5    0   150G  0 part /
```

Let's say the `/boot/` disk corresponding to `/dev/sda1` has been corrupted, preventing the system from loading. In this case, what to do? Usually, Linux itself gives a suggestion when this type of problem occurs. The solution usually consists of using the `fsck` command to check and repair possible errors in the partition. Usually, `fsck` is used as follows:

```
# fsck.ext4 /dev/sda1 -f -y -p
```

> Note: The above command must be applied with the disassembled disk. The `fsck` is just the original name. When they came out with new file systems they would need a specific tool for each one, efsck for ext, e2fsck for ext2, dosfsck, fsckvfat. So they made fsck the front end that just calls whichever is the appropriate tool. In redhat systems, usually fsck is referenced as e2fsck. But they are the same tools. All options for fsck are specified in the e2fsck(8) manual page.



In general, the `fsck` command should be used to address these specific issues below:

* Blocks or fragments allocated to various files.
* inodes containing block or fragment numbers that are superimposed.
* inodes containing block or fragment numbers out of range.
* Disagreements between the number of directory references to a file and the count of file links.
* Blocks or fragments illegally allocated.
* inodes containing block or fragment numbers that are marked as free in disk mapping.
* inodes containing corrupted block or fragment numbers.
* A fragment that is not the last address of the disk in an inode. This check does not apply to compressed file systems.
* Files larger than 32 KB containing a fragment. This check does not apply to compressed file systems.
* Size Checks:
	* Incorrect number of blocks.
	* A directory size that is not a multiple of 512 bytes.

> Note: These checks don't apply to compressed file systems.

* Directory Checks:
	* Directory entry containing an i-node number marked free in the inode mapping.
	* Number of i-node out of range.
	* Point (.) Link missing or not pointing to itself.
	* Point point (..) link missing or not pointing to parent directory.
	* Unreferenced files or directories that can not be reached.
* Inconsistent disk mapping.
* inconsistent inode map.

The `fsck` command also records the result of its checks and repairs by its output value. This output value can be any sum of the following conditions:

```
Value	Description
0	All verified file systems are ok now.
2	The fsck command was interrupted before completing checks or repairs.
4	The fsck command changed the file system; the user must restart the system immediately.
8	The file system contains unrepaired damage.
```

---

If your problem is related to any of these factors above, surely `fsck` will solve it. But what if there's no relation? If the system occurs besides being in trouble, the distribution is in an already deprecated version, preventing the upgrade and possible correction of the problem? Of course, formatting the whole machine would not be a pleasant solution to this case. So let's go to one of the alternatives:

> Note: Save a filesystem image for support investigations. A pre-repair filesystem metadata image can often be useful for support investigations if there is a possibility that the corruption was due to a software bug. Patterns of corruption present in the pre-repair image may aid in root-cause analysis.

In the case of the `/boot` partition (which is usually a small partition), you can prevent crashes simply by generating a partitioning backup using the `dd` command:

	# dd if=/dev/sda1 conv=sync,noerror bs=64K | gzip -c  > /PATH/TO/DRIVE/backup_sda1.img.gz

And to restore this backup, use the command below:

	# gunzip -c /PATH/TO/DRIVE/backup_sda1.img.gz | dd of=/dev/sda1

It's quite safe to do this. In fact, if you can back up what you think is important and necessary, it is the most appropriate thing to do. In addition, you can back up the **[MBR]()**:

	dd if=/dev/sda of=/PATH/TO/DRIVE/mbr-backup.img bs=512 count=1

And to restore:
	
	dd if=/PATH/TO/DRIVE/mbr-backup.img of=/dev/sda bs=512 count=1

Note that the above workaround will only work if you have previously planned the backup since it requires planning in relation to disaster prevention. If you do not have the backup of the partitioning you want to restore, we can attack the problem from a different perspective. Some questions may arise in this scenario:

1. What is important to save?
2. What is stopping the system from working?
3. What will you do to avoid failures like this one in the future?


With these questions in mind, we can better design our actions from then on. If the `/boot` partition is having problems, and you aren't able to resolve with `fsck` command, we can easily rebuild it. But before this, it's important to know what the `/boot` contains:

> Note: In this example I'm using Fedora. But we can use any other distribution.

---

### XFS - Filesystem

---

### LVM - Filesystem


