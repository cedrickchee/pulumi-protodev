# AWS Infrastructure Deployed with Pulumi

This repository contains a project using Pulumi to build and deploy cloud applications and infrastructure (Infra-as-Code).

## Server using Amazon EC2

This project deploys a simple AWS EC2 VM running a Python web server.

### Deploying the App

To deploy your infrastructure, follow the below steps.

### Prerequisites

1. [Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
2. [Configure AWS Credentials](https://www.pulumi.com/docs/intro/cloud-providers/aws/setup/)

**Install Pulumi**

After installing Pulumi, since we're using TypeScript, switch to Node.js 12.x LTS and verify pulumi CLI.

```sh
nvm use lts/*
pulumi version
```

**Configure AWS Credentials**

```sh
vim ~/.aws/config

# Set AWS region for this profile, which is ap-northeast-2
export AWS_PROFILE=pel
```

### Steps

After cloning this repo, from this working directory, run these commands:

1. Set the required configuration variables for this program:

```sh
$ pulumi config set aws:region ap-northeast-2
```

2. Stand up the VM, which will also boot up your Python web server on port 80:

```sh
$ pulumi up
```

3. After a couple minutes, your VM will be ready, and two stack outputs are printed:

```sh
$ pulumi stack output
Current stack outputs (2):
OUTPUT          VALUE
publicIp        NN.NN.NNN.NN
```

4. Thanks to the security group making port 80 accessible to the 0.0.0.0/0 CIDR block, we can curl it:

```sh
$ curl $(pulumi stack output publicIp)
Hello, World!
```

5. From there, feel free to experiment. Simply making edits and running pulumi up will incrementally update your VM.

6. If you need to connect to the VM remotely using SSH, add SSH key into instance.

Go to AWS Console and "Connect" to the instance. Pick "EC2 Instance Connect (browser-based SSH connection)". Once you're in, do:

```sh
# Follow guide: https://stackoverflow.com/questions/3260739/add-keypair-to-existing-ec2-instance

ubuntu@ip-1-1:~$ sudo adduser pel
New password: *****************

$ ssh-keygen -t rsa -b 4096 -C "pel@protodev"
```

7. Afterwards, destroy your stack and remove it:

```sh
$ pulumi destroy --yes
$ pulumi stack rm --yes
```
