# Installation

The Commvault Connector installation consists of multiple steps that are required to complete the installation successfully. 

The connector requires a SMA OpCon Windows Agent to provide the connection between the OpCon System and the Commvault Connector software. 

## Installation

### Environment

- The command line utility needs **Java version 11** to function
  - An embedded JavaRuntimeEnvironment 11 is included along with the delivery zip / tar files. Once the archive extracted, "/java" directory contains the JRE binaries.

### Windows Instructions
Download CommVault_Windows.zip file from the desired [release available here](https://github.com/SMATechnologies/commvault-java/releases).

After download, extract the zip file to the location you'd like to install the connector to. Once unzipped, everything needed should be located under the root folder of that directory.

After extract, copy the Enterprise Manager Job-Subtype from the /emplugins directory to dropins directory of each Enterprise Manager that will create job
definitions (if the directory does not exist, create it).

Restart Enterprise Manager and a new Windows Job Sub-Type Azure Storage should be visible (if not restart Enterprise Manager using 'Run as Administrator'). 

## Create Global Properties

Create a global property **CommvaultPath** that contains the full path of the installation directory.

Create the OpCon global properties associated with the drop-down lists used when creating backup tasks.

**CV_BACKUP_TYPES** Create the global property and add the values contained in **Backup File Types List** using a comma to separate them. The doubles quotes surrounding the values must be retained. These values will then be visible in the drop-down list.

##Backup File Types List
```
"DIFFERENTIAL"
"INCREMENTAL"
"FULL"
"PRE_SELECT"
"SYNTHETIC_FULL"
```

**CV_BACKUP_FILE_NAMES** Create the global property and add the values contained in **Backup File Names List** using a comma to separate them. The doubles quotes surrounding the values must be retained. These values will then be visible in the drop-down list.

##Backup File Names List
```
"file_system.xml"
"script_incr.xml"
"script_synthetic_full.xml"
```

## Configuration
The Commvault connector uses a configuration file **Connector.config** that contains the Commvault account information.

The storage account information consists of the storage account name and the connection string for that storage account.
The connection string must be encrypted using the **Encrypt.exe** program.

The encryption tool provides basic encryption capabilities to prevent clear text.

**Connector.config** file example:
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

Keyword                | Type | Description
---------------------- | ---- | -----------
NAME                   | Text | The name associated with the conner (this should not be changed).
MSLSAM_ROOT_DIRECTORY  | Text | The full path to the root directory of the MSLSAM. This is used to pass the status of the Commvault tasks to OpCon so the status can be displayed in the Operations views.
SESSION_RETRY_VALUE    | Text | The maximum number of times a retry should be performed if a connection failure is detected during a running connection. (Default 5).
POLL_INTERVAL          | Text | The time in seconds between checks to determine the status of the Commvault task. (Default 5).
INITIAL_POLL_DELAY     | Text | The time in seconds to wait before the initial check to determine the status of the Commvault task. (Default 10).
DEBUG                  | Text | The maximum number of times a retry should be performed if a connection failure is detected during a running connection. (Default 5).
SERVER_ADDRESS         | Text | The address of the Commvault system that the connector must communicate with. 
SERVER_NAME            | Text | The name of the Commvault server. This value is used for the HOST attribute in the web services header record.
USE_TLS                | Text | Indicates if the connection to the Commvault server uses tls.
USER_DOMAIN            | Text | If the commvault user defined for the connector requires a domain name, then enter the doman name here.
USER                   | Text | A commvault user defined with the appropriate privileges so it can start backup jobs. The user name must be encrypted using the **Encrypt.exe** tool.
USER_PASSWORD          | Text | The password of the Commvault user encrypted using the **Encrypt.exe** tool.

### Encrypt Utility
The Encrypt utility uses standard 64 bit encryption.

Supports a -v argument and displays the encrypted value

On Windows, example on how to encrypt the value "abcdefg":
```
Encrypt.exe -v abcdefg
```
