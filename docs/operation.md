# Operation

## Defining Commvault Jobs using Enterprise Manager

The Enterprise Manager includes a Job SubType definition for the Commvault Connector. The Job SubType can be accessed by selecting the Commvault Job SubType from the dropdown list when the Windows Job Type has been selected. 

Before defining jobs, the global properties **CV_BACKUP_TYPES** and **CV_BACKUP_FILE_NAMES** should be completed. The global properties holds the definitions that populate the drop-down lists when creating the job definitions.

- CV_BACKUP_TYPES       
  - This contains a list of backup types that can be selected when defining jobs (see ‘Create Commvault special properties’ section).
- CV_BACKUP_FILE_NAMES  
  - This contains a list of templates that can be selected when defining jobs (see ‘Create Commvault special properties’ section).

### Commvault Job definitions
When defining a Commvault job, select a Job Type of Windows and then a Job SubType of Commvault. The Commvault Definition screen will then appear.

The job definition details consist of a Windows Batch User and the Job Definition and Failure Criteria TABs. 

The Job Definition TAB is used to define parameters that are passed to the Commvault Connector and replaced in the template xml before the job request is submitted to Commvault. 
The XML template itself is not updated, only the template in memory. 

The Commvault definitions are used to define the arguments that are submitted to the job.

Field             | Description
------------------|---------------
User Id	          | Required field that contains the name of the Windows Batch user that the Commvault Connector will be execute on the Windows system.
Connector Path	  | Required field that contains the installed location of the Commvault Connector. This should not be changed and the location should be defined in the CommvaultPath property. If more than one Connector is installed on the same system, then a new global property should be defined and the entry in this field updated.
Client Name	      | Required field that contains the name of the computer on which the required commvault agent is installed. The value is inserted into the XML template associated with the request.
Sub Client Name	  | Optional field that defines a logical container that identifies and manages production data to be protected. When not present, the default value in the XML template is used otherwise the value is inserted into the XML template associated with the request.
Instance          | Optional field that contains the name of an instance that is associated with the job. When not present, the default value in the XML template is used otherwise the value is inserted into the XML template associated with the request.
BackupsetName     | Required field that contains the name of a backup set that contains the logical grouping of the sub clients which are the containers of all data managed by the agent. The value is inserted into the XML template associated with the request.
XML Template Name |	Required field that contains the name of the XML template to use for the request. The value is selected from the dropdown list (file_system.xml, script_incr.xml, script_synthetic_full.xml). More templates can be added to the selection by placing the template file in the templates directory and adding the filename of the template in the CV_BACKUP_FILE_NAMES property.
Backup Type	      | Required field that contains the backup type to use. The value is selected from the dropdown list (DIFFERENTIAL, INCREMENTAL, FULL, PRE_SELECT or SYNTHETIC_FULL). The value is inserted into the XML template associated with the request.

### Failure Citeria
The Failure Criteria TAB field definitions are used to define the successful completion of the job.
 
Completion Codes supported by the Commvault Connector.

Code | Name  | Description
-----|-------|----------------- 
0    | COMPLETED               | the job completed processing.
1    | COMPLETED_WITH_WARNINGS | the job completed processing, but contains warnings.
2    | COMPLETED_WITH_ERRORS   | the job completed processing, but contains errors.
3    | FAILED                  | the job failed.
4    | FAILED_TO_START         | the job did not start.
18   | WEB_SERVER_ERROR        | an error occurred when communicating with the Commvault web server.

This means that to check for a successful completion, the Failure Criteria should be set to NE (Not Equal) to 0 means a Fail condition.  
 
### Logging
The default logging implemented by the connector consists of a maximum cycle of five log files. The log files contain information about the Commvault Connector and any jobs run by the Commvault Connector. The log files (Agent.log - Agent.log.5) are located in the ```<installation root>```\log directory. Information is appended into the log files and any error messages, return codes can be viewed in these log files.

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
