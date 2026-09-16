---
sidebar_label: 'Installation'
title: 'CommVault Connector installation'
description: 'How to install and configure the CommVault Connector for OpCon on a Windows system.'
tags:
  - Procedural
  - System Administrator
  - CommVault
---

# CommVault Connector installation

## What is it?

The CommVault Connector installation sets up the connector software on a Windows system and configures the connection between OpCon and CommVault. The process includes installing the connector, creating the required OpCon global properties, and configuring the CommVault server connection in the `Connector.config` file.

## Environment requirements

- Java version 11 is required. An embedded Java Runtime Environment 11 is included in the delivery package. After extracting the archive, the `/java` directory contains the JRE binaries.
- A Windows OpCon Agent must be installed to provide the connection between the OpCon system and the CommVault Connector.

## Install the connector

To install the CommVault Connector, complete the following steps:

1. Download the `CommVault_Windows.zip` file from the desired [release](https://github.com/SMATechnologies/commvault-java/releases).
2. Extract the zip file to the directory where you want to install the connector.

The extracted directory contains the following:

| Item | Description |
|---------|-------------|
| `CVault.exe` | The connector program |
| `Encrypt.exe` | Utility for encoding credential values |
| `Connector.config` | Configuration file |
| `java/` | Embedded Java 11 runtime |
| `emplugins/` | Enterprise Manager job subtype plug-in |
| `xmlbackupdefinitions/` | XML backup request templates |
3. Copy the Enterprise Manager job subtype from the `/emplugins` directory to the `dropins` directory of each Enterprise Manager that will create job definitions. If the `dropins` directory does not exist, create it.
4. Restart Enterprise Manager. A new Windows Job Sub-Type should be visible. If it is not visible, restart Enterprise Manager using **Run as Administrator**.

## Create global properties

The connector uses three OpCon global properties to define the installation path and populate the job definition lists.

### CommvaultPath

Create a global property named **CommvaultPath** that contains the full path of the connector installation directory.

### CV_BACKUP_TYPES

Create a global property named **CV_BACKUP_TYPES** and add the following values, separated by commas. Retain the double quotes surrounding each value. These values populate the backup type list when creating job definitions.

```
"DIFFERENTIAL"
"INCREMENTAL"
"FULL"
"PRE_SELECT"
"SYNTHETIC_FULL"
```

### CV_BACKUP_FILE_NAMES

Create a global property named **CV_BACKUP_FILE_NAMES** and add the following values, separated by commas. Retain the double quotes surrounding each value. These values populate the XML template list when creating job definitions.

```
"file_system.xml"
"script_incr.xml"
"script_synthetic_full.xml"
```

## Configure the connector

The CommVault Connector uses a configuration file named `Connector.config` that contains the CommVault server connection settings. The user name and password must be encoded using the `Encrypt.exe` tool before adding them to the file.

**Connector.config file example:**

```
[CONNECTOR]
NAME=CommVault Connector
MSLSAM_ROOT_DIRECTORY=
SESSION_RETRY_VALUE=5
POLL_INTERVAL=5
INITIAL_POLL_DELAY=10
DEBUG=OFF

[COMMVAULT]
SERVER_ADDRESS=
SERVER_NAME=
USE_TLS=False
USER_DOMAIN=
USER=(encrypted value)
USER_PASSWORD=(encrypted value)
```

| Setting | Type | Description |
|---------|------|-------------|
| NAME | Text | Not used. The connector reads this setting and does nothing with it. |
| MSLSAM_ROOT_DIRECTORY | Text | The full path to the root directory of the Windows Agent. Used to pass CommVault job status to OpCon for display in the Operations views. If the path is wrong or empty, the backup still runs but no progress updates appear. |
| SESSION_RETRY_VALUE | Text | The maximum number of retries if a connection failure is detected during a running connection. Default: 5. |
| POLL_INTERVAL | Text | The time in seconds between checks to determine the status of the CommVault job. Default: 5. |
| INITIAL_POLL_DELAY | Text | The time in seconds to wait before the first status check after submitting a job. Default: 10. |
| DEBUG | Text | When set to `ON`, enables verbose debug logging. Required — the connector does not start if this setting is absent, so set it to `OFF` rather than removing it. |
| SERVER_ADDRESS | Text | The address of the CommVault system the connector must communicate with. |
| SERVER_NAME | Text | The name of the CommVault server. Used for the HOST attribute in the web services header. |
| USE_TLS | Text | Indicates whether the connection to the CommVault server uses TLS. Valid values: `True`, `False`. Required — the connector does not start if this setting is absent. |
| USER_DOMAIN | Text | The domain name for the CommVault user, if required. |
| USER | Text | A CommVault user with privileges to start backup jobs. Encode this value using `Encrypt.exe`. Required. |
| USER_PASSWORD | Text | The password for the CommVault user. Encode this value using `Encrypt.exe`. Required. |

### Encrypt utility

The `Encrypt.exe` utility encodes a value so that it is not stored in readable form in the configuration file. It accepts a `-v` argument and displays the encoded value.

:::caution

Encoding is not encryption. The utility applies no cipher and uses no key, so a value it produces can be reversed by anyone who can read the file. Treat `Connector.config` as a file that contains a live credential: restrict access to it using file system permissions, and replace credential values with placeholders before sharing the file in a ticket, a screenshot or a repository.

:::

To encode a value on Windows, run the following command:

```
Encrypt.exe -v <value>
```

**Example:**

```
Encrypt.exe -v abcdefg
```

## FAQs

**What Java version is required?**
Java version 11 is required. An embedded Java Runtime Environment 11 is included in the delivery package in the `/java` directory.

**How do I encode the user name and password for the configuration file?**
Use the `Encrypt.exe` tool included with the connector. Run `Encrypt.exe -v <value>` and copy the output into the `USER` or `USER_PASSWORD` field in `Connector.config`. Encoding keeps the credential out of plain sight but does not protect it, so the file still has to be treated as holding a live credential.

**What is the CommvaultPath global property used for?**
It stores the full path of the connector installation directory. The path is referenced in job definitions so that OpCon knows where to find the connector.

**Where are the connector log files stored?**
The active log is `commvault.log` in the `<installation root>\log` directory. Rolled logs are written to a subdirectory named for the month with a date-stamped name, and are retained indefinitely unless you configure pruning. See [Operation](./operation.md) for the full description.

**Can I add additional XML templates?**
Yes. Place the template file in the `xmlbackupdefinitions` directory under the connector installation root, then add the filename to the **CV_BACKUP_FILE_NAMES** global property.

## Glossary

**Connector.config**
The configuration file for the CommVault Connector. Contains CommVault server address, credentials, and connection settings.

**Encrypt.exe**
The credential encoding utility included with the connector. Encodes credential values for storage in `Connector.config`. Encoding obscures a credential; it does not protect it.

**CommvaultPath**
An OpCon global property containing the full path to the CommVault Connector installation directory.

**CV_BACKUP_TYPES**
An OpCon global property that holds the comma-separated list of backup types available when defining CommVault jobs.

**CV_BACKUP_FILE_NAMES**
An OpCon global property that holds the comma-separated list of XML template file names available when defining CommVault jobs.

**Enterprise Manager**
The OpCon desktop client used to define jobs, manage schedules, and install job subtypes such as the CommVault Connector subtype.
