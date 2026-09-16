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
| Sub Client Name | Required | A logical container that identifies the production data to protect. Inserted into the XML template. |
| Instance | Required | The name of a CommVault agent instance associated with the job. Inserted into the XML template. |
| BackupsetName | Required | The name of a backup set — the logical grouping of sub-clients managed by the agent. Inserted into the XML template. |
| XML Template Name | Required | The XML template file that defines the structure of the CommVault backup request. Select from the list populated by the **CV_BACKUP_FILE_NAMES** property. Additional templates can be added by placing the file in the `xmlbackupdefinitions` directory and adding the filename to **CV_BACKUP_FILE_NAMES**. |
| Backup Type | Required | The type of backup to run. Select from the list populated by the **CV_BACKUP_TYPES** property. Valid values: `DIFFERENTIAL`, `INCREMENTAL`, `FULL`, `PRE_SELECT`, `SYNTHETIC_FULL`. Inserted into the XML template. |

:::caution

Every field in this table is required, including **Sub Client Name** and **Instance**. If either is left empty, the connector stops with a usage error before contacting CommVault. It does not fall back to a value in the XML template.

The completion code in that case is `1`, which is also the code for a backup that completed with warnings. If you see `1`, check the job log to tell the two apart: a usage error produces the connector's argument list and no backup activity.

:::

## Failure criteria

The **Failure Criteria** tab determines when the OpCon job is considered to have failed, based on the completion code returned by the CommVault Connector.

To treat only a fully successful job as passing, set Failure Criteria to **Not Equal (NE)** to `0`.

### CommVault job outcomes

These codes report the outcome of the backup itself.

| Code | Name | Description |
|------|------|-------------|
| 0 | COMPLETED | The job completed processing. |
| 1 | COMPLETED_WITH_WARNINGS | The job completed processing but contains warnings. |
| 2 | COMPLETED_WITH_ERRORS | The job completed processing but contains errors. |
| 3 | FAILED | The job failed. Also returned when CommVault reports a job status the connector does not recognize, which is a different problem and is diagnosed from the job log rather than from CommVault. |
| 4 | FAILED_TO_START | The job did not start. |
| 18 | WEB_SERVER_ERROR | Communication with the CommVault web server failed repeatedly and the retry allowance set by `SESSION_RETRY_VALUE` was used up. The count is of consecutive failures — it resets after each successful status check — so this code means the connector could not reach the server for that many attempts in a row. |

### Configuration errors

These codes are reported before the connector contacts CommVault. Both mean `Connector.config` is incomplete, and neither indicates a problem with the network or with CommVault.

| Code | Description |
|------|-------------|
| 99 | The CommVault user or password setting is missing from `Connector.config`. |
| 401 | The CommVault user or password setting is present but empty. |

:::caution

If a CommVault job is killed, committed, or abnormally terminated and cleaned up, the connector treats the state as work still in progress and keeps polling. Its polling has no time limit, so the OpCon job stays running and must be cancelled in OpCon. `SESSION_RETRY_VALUE` does not bound this — it limits web server failures only.

:::

## Logging

The connector writes its log to `commvault.log` in the `<installation root>\log` directory. When that file reaches 100 MB it rolls, and the rolled file is written to a subdirectory named for the month, with a date-stamped, indexed name — for example `log\2026-09\commvault_2026-09-16.0.log`. Log entries include job parameters, authentication results, job submission status, and error messages.

:::caution

Rolled log files are retained indefinitely unless you configure pruning. Include the `log` directory in whatever disk monitoring you apply to the connector host.

:::

**Example log output:**

```
2026-09-16 16:07:08,923 [main] INFO  Logger - [CommVaultConnector] : ----------------------------------------------------------------------------
2026-09-16 16:07:08,923 [main] INFO  Logger - [CommVaultConnector] : CommVault Connector     : 2.0.1
2026-09-16 16:07:08,924 [main] INFO  Logger - [CommVaultConnector] : Server Address          : <commvault server>
2026-09-16 16:07:08,924 [main] INFO  Logger - [CommVaultConnector] : -xt  (XML Template)     : script_incr.xml
2026-09-16 16:07:08,924 [main] INFO  Logger - [CommVaultConnector] : -bsn (Backupset Name)   : defaultBackupSet
2026-09-16 16:07:08,924 [main] INFO  Logger - [CommVaultConnector] : -c   (client)           : <client name>
2026-09-16 16:07:08,925 [main] INFO  Logger - [CommVaultConnector] : -t   (Backup Type)      : INCREMENTAL
2026-09-16 16:07:09,102 [main] INFO  Logger - [CommVaultConnectionFactory] : Authenticating User <commvault user> to Server http://<commvault server>/webconsole/api/Login
2026-09-16 16:07:09,455 [main] INFO  Logger - [CommVaultConnectionFactory] : Authenticating for User <commvault user> successful
2026-09-16 16:07:10,880 [main] INFO  Logger - [CommVaultConnectionFactory] : QCommand successful TaskId <task id> JobId <job id>
2026-09-16 16:07:20,881 [pool-2-thread-1] INFO  Logger - [CommVaultConnectionFactory] : Get Job Summary for JobId <job id> successful
2026-09-16 16:08:41,004 [main] INFO  Logger - [CommVaultConnector] : CommVault Job Completed with status 0 - (Completed)
2026-09-16 16:08:41,004 [main] INFO  Logger - [CommVaultConnector] : ----------------------------------------------------------------------------
```

## FAQs

**What backup types does the connector support?**
The connector supports `DIFFERENTIAL`, `INCREMENTAL`, `FULL`, `PRE_SELECT`, and `SYNTHETIC_FULL`. These values are populated from the **CV_BACKUP_TYPES** global property.

**What completion code indicates a successful job?**
A completion code of `0` (COMPLETED) indicates the job finished processing successfully.

**How do I configure the OpCon job to fail when CommVault reports warnings?**
Set the **Failure Criteria** to **Not Equal (NE)** to `0`. Any non-zero completion code — including code `1` (COMPLETED_WITH_WARNINGS) — will mark the OpCon job as failed.

**Where are the connector log files located?**
The active log is `commvault.log` in the `<installation root>\log` directory. Rolled logs go to a subdirectory named for the month, and are retained indefinitely unless you configure pruning. See [Logging](#logging) above.

**Can I add additional XML templates?**
Yes. Place the template file in the `xmlbackupdefinitions` directory under the connector installation root, then add the filename to the **CV_BACKUP_FILE_NAMES** global property.

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
