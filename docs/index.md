---
slug: '/'
sidebar_label: ' SMA CommVault Connector'
---

# SMA CommVault Connector

Commvault is an OpCon Connector for Windows that uses the Commvault API to interact with Commvault to submit backup tasks.

The Commvault software platform delivers the unparalleled advantage and benefits of a truly holistic approach to data and information management. Within the platform, tightly integrated, powerful software delivers functionality throughout your physical and virtual environments to protect and recover data, manage costs and complexity, and gain better insight into your information.

The current connector implementation is installed on a Windows environment. It communicates with the Commvault System using the Commvault Rest API. Job definitions are passed to the connector as arguments on the command line.

![Commvault Component Overview](../static/img/commvault-component-overview.png)

The Commvault connector receives the arguments from OpCon and then reads the defined XML template and updates the values in the XML template associated with the arguments. The connector then uses the QCommand/qoperation execute function to submit the request to Commvault. The connector then tracks the progress of the task in Commvault, updated the status of the task in the OpCon Operations Views as the status changes. When the task is completed, the Job Summary associated with the task is retrieved and added to the OpCon Job Log.