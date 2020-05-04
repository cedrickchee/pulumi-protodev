import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const size = "t3a.large";

// ami-0de407404c33d1671, creation date: April 23, 2020 at 7:35:23 PM UTC+8
// Description: Canonical, Ubuntu, 20.04 LTS, amd64 focal image build on 2020-04-23
const ami = pulumi.output(
  aws.getAmi(
    {
      filters: [
        {
          name: "name",
          values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
      ],
      owners: ["099720109477"], // This owner ID is Canonical
      mostRecent: true,
    },
    { async: true }
  )
);

const group = new aws.ec2.SecurityGroup("protodev-secgrp", {
  description: "protodev security group",
  ingress: [
    { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
  ],
});

const userData = `#!/bin/bash
echo "Hello, World!" > index.html
nohup sudo python3 -m http.server 80 &`;

const server = new aws.ec2.Instance("protodev-www", {
  instanceType: size,
  vpcSecurityGroupIds: [group.id], // reference the security group resource above
  ami: ami.id,
  userData: userData,
});

export const publicIp = server.publicIp;
export const publicHostName = server.publicDns;
