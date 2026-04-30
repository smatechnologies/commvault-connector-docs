---
sidebar_label: 'Operation'
title: 'CommVault Connector operation'
description: 'How to define CommVault backup jobs in Enterprise Manager, set failure criteria, and monitor connector log files.'
tags:
  - Procedural
  - Automation Engineer
  - CommVault
---

# CommVault Connector operation

## What is it?

The CommVault Connector operation page describes how to define CommVault backup jobs in Enterprise Manager, configure job parameters passed to the connector, set failure criteria based on CommVault completion codes, and monitor the connector log files.

## Defining CommVault jobs in Enterprise Manager

Before defining jobs, complete the **CV_BACKUP_TYPES** and **CV_BACKUP_FILE_NAMES** global properties. These properties populate the lists used when creating job definitions. See [Installation](./installation.md) for setup instructions.

The **CV_BACKUP_TYPES** property holds the list of backup types available when defining jobs. The **CV_BACKUP_FILE_NAMES** property holds the list of XML template file names available when defining jobs.

To define a CommVault job in Enterprise Manager, complete the following steps:

1. Select a **Job Type** of **Windows**.
2. Select a **Job SubType** of **Commvault**. The CommVault Definition screen appears.
3. Enter the **Windows Batch User** for the job.
4. Complete the fields on the **Job Definition** tab (see field descriptions below).
5. Set the **Failure Criteria** on the **Failure Criteria** tab (see completion codes below).

### Job definition fields

The **Job Definition** tab defines parameters that are passed to the CommVault Connector and substituted into the XML template before the job request is submitted to CommVault. The XML template file is not modified — only the in-memory copy is updated.

| Field | Required | Description |
|-------|----------|-------------|
| User Id | Required | The Windows Batch user account under which the CommVault Connector runs on the Windows system. |
| Connector Path | Required | The installed location of the CommVault Connector. Reference the **CommvaultPath** global property. If more than one connector is installed on the same system, define a separate global property for each and update this field accordingly. |
| Client Name | Required | The name of the computer on which the required CommVault agent is installed. Inserted into the XML template. |
| Sub Client Name | Optional | A logical container that identifies the production data to protect. When not provided, the default value in the XML template is used. When provided, inserted into the XML template. |
| Instance | Optional | The name of a CommVault agent instance associated with the job. When not provided, the default value in the XML template is used. When provided, inserted into the XML template. |
| BackupsetName | Required | The name of a backup set — the logical grouping of sub-clients managed by the agent. Inserted into the XML template. |
| XML Template Name | Required | The XML template file that defines the structure of the CommVault backup request. Select from the list populated by the **CV_BACKUP_FILE_NAMES** property. Additional templates can be added by placing the file in the `templates` directory and adding the filename to **CV_BACKUP_FILE_NAMES**. |
| Backup Type | Required | The type of backup to run. Select from the list populated by the **CV_BACKUP_TYPES** property. Valid values: `DIFFERENTIAL`, `INCREMENTAL`, `FULL`, `PRE_SELECT`, `SYNTHETIC_FULL`. Inserted into the XML template. |

## Failure criteria

The **Failure Criteria** tab determines when the OpCon job is considered to have failed, based on the completion code returned by the CommVault Connector.

To treat only a fully successful job as passing, set Failure Criteria to **Not Equal (NE)** to `0`.

| Code | Name | Description |
|------|------|-------------|
| 0 | COMPLETED | The job completed processing. |
| 1 | COMPLETED_WITH_WARNINGS | The job completed processing but contains warnings. |
| 2 | COMPLETED_WITH_ERRORS | The job completed processing but contains errors. |
| 3 | FAILED | The job failed. |
| 4 | FAILED_TO_START | The job did not start. |
| 18 | WEB_SERVER_ERROR | An error occurred when communicating with the CommVault web server. |

## Logging

The connector logs activity to a set of rotating log files in the `<installation root>\log` directory. The connector maintains a maximum of five log files (`Agent.log` through `Agent.log.5`). Log entries include job parameters, authentication results, job submission status, and error messages.

**Example log output:**

```
2017-03-14 16:07:08,923 [main] INFO  Logger - [CommVaultConnector] 20170314 16:07:08 : ----------------------------------------------------------------------------
2017-03-14 16:07:08,923 [main] INFO  Logger - [CommVaultConnector] 20170314 16:07:08 : CommVault Job Completed with status 0 - (Completed)
2017-03-14 16:07:08,923 [main] INFO  Logger - [CommVaultConnector] 20170314 16:07:08 : ----------------------------------------------------------------------------
2017-03-14 16:21:35,676 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : ----------------------------------------------------------------------------
2017-03-14 16:21:35,678 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : CommVault Connector     : 16.2.01
2017-03-14 16:21:35,678 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : ----------------------------------------------------------------------------
2017-03-14 16:21:35,678 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : Server Address          : commvault.infra.alptis.local
2017-03-14 16:21:35,678 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : Server Name             : commvault.infra.alptis.local
2017-03-14 16:21:35,679 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -xt  (XML Template)     : script_nutanix_prism_incr.xml
2017-03-14 16:21:35,679 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -bsn (Backupset Name)   : defaultBackupSet
2017-03-14 16:21:35,679 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -c   (client)           : vcenter-ntx-dc1
2017-03-14 16:21:35,679 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -sc  (Subclient)        : null
2017-03-14 16:21:35,680 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -i   (Instance)         : VMware
2017-03-14 16:21:35,680 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : -t   (Backup Type)      : INCREMENTAL
2017-03-14 16:21:35,680 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:35 : ----------------------------------------------------------------------------
2017-03-14 16:21:35,886 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:35 : Authenticating User opcon_commvault to Server http://commvault.infra.alptis.local/webconsole/api/Login
2017-03-14 16:21:36,352 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:36 : Authenticating for User opcon_commvault successful
2017-03-14 16:21:36,415 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:36 : QCommand
2017-03-14 16:21:37,874 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:37 : QCommand successful TaskId 7351 JodId 19259
2017-03-14 16:21:47,876 [pool-2-thread-1] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:47 : Get Job Summary for JobId 19259
2017-03-14 16:21:48,093 [pool-2-thread-1] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:48 : Get Job Summary for JobId 19259 successful
2017-03-14 16:21:48,148 [pool-3-thread-1] ERROR Logger - [ExecuteSMAStatus] 20170314 16:21:48 : Exception Cannot run program "c:\testmslsam\SMAStatus.exe": CreateProcess error=2, The system cannot find the file specified
2017-03-14 16:21:55,629 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : ----------------------------------------------------------------------------
2017-03-14 16:21:55,631 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : CommVault Connector     : 16.2.01
2017-03-14 16:21:55,631 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : ----------------------------------------------------------------------------
2017-03-14 16:21:55,631 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : Server Address          : commvault.infra.alptis.local
2017-03-14 16:21:55,631 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : Server Name             : commvault.infra.alptis.local
2017-03-14 16:21:55,632 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -xt  (XML Template)     : script_nutanix_prism_incr.xml
2017-03-14 16:21:55,632 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -bsn (Backupset Name)   : defaultBackupSet
2017-03-14 16:21:55,632 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -c   (client)           : vcenter-ntx-dc1
2017-03-14 16:21:55,633 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -sc  (Subclient)        : null
2017-03-14 16:21:55,633 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -i   (Instance)         : VMware
2017-03-14 16:21:55,633 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : -t   (Backup Type)      : INCREMENTAL
2017-03-14 16:21:55,634 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:55 : ----------------------------------------------------------------------------
2017-03-14 16:21:55,845 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:55 : Authenticating User opcon_commvault to Server http://commvault.infra.alptis.local/webconsole/api/Login
2017-03-14 16:21:56,246 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:56 : Authenticating for User opcon_commvault successful
2017-03-14 16:21:56,314 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:56 : QCommand
2017-03-14 16:21:57,944 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:57 : QCommand failed : message (Error 0x10c: Another backup is running for client [vcenter-ntx-dc1], iDataAgent [Virtual Server], Backup Set [defaultBackupSet], Subclient [Nutanix PRISM].
) return code (2)
2017-03-14 16:21:57,945 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:57 : Logout
2017-03-14 16:21:57,984 [main] INFO  Logger - [CommVaultConnectionFactory] 20170314 16:21:57 : Logout completed : User logged out
2017-03-14 16:21:57,985 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:57 : ----------------------------------------------------------------------------
2017-03-14 16:21:57,985 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:57 : CommVault Job Completed with status 4 - (Failed to Start)
2017-03-14 16:21:57,985 [main] INFO  Logger - [CommVaultConnector] 20170314 16:21:57 : ----------------------------------------------------------------------------
```

## FAQs

**What backup types does the connector support?**
The connector supports `DIFFERENTIAL`, `INCREMENTAL`, `FULL`, `PRE_SELECT`, and `SYNTHETIC_FULL`. These values are populated from the **CV_BACKUP_TYPES** global property.

**What completion code indicates a successful job?**
A completion code of `0` (COMPLETED) indicates the job finished processing successfully.

**How do I configure the OpCon job to fail when CommVault reports warnings?**
Set the **Failure Criteria** to **Not Equal (NE)** to `0`. Any non-zero completion code — including code `1` (COMPLETED_WITH_WARNINGS) — will mark the OpCon job as failed.

**Where are the connector log files located?**
Log files are in the `<installation root>\log` directory. The connector maintains up to five files: `Agent.log` through `Agent.log.5`.

**Can I add additional XML templates?**
Yes. Place the template file in the `templates` directory under the connector installation root, then add the filename to the **CV_BACKUP_FILE_NAMES** global property.

## Glossary

**BackupSet**
A logical grouping of sub-clients in CommVault that contains all data managed by a CommVault agent.

**Sub-client**
A logical container in CommVault that identifies and manages production data to be protected.

**Instance**
A named CommVault agent instance associated with a job definition.

**XML Template Name**
The CommVault XML template file selected when defining a job. Determines the structure of the backup request submitted to CommVault. The connector updates values in the template in memory — the file itself is not modified.

**Failure Criteria**
Job settings in OpCon that determine when a CommVault Connector job is considered failed, based on the completion code returned by CommVault.

**Completion code**
A numeric value returned by the CommVault Connector that indicates the outcome of a CommVault job. Used by the OpCon Failure Criteria to determine job success or failure.
