---
sidebar_label: 'Release notes'
title: 'CommVault Connector release notes'
description: 'Version history and change details for the CommVault Connector, including new features, improvements, and bug fixes.'
tags:
  - Reference
  - System Administrator
  - CommVault
---

# CommVault Connector release notes

:::note

The connector reports its own version, and the versions below are the versions it reports. Earlier revisions of this page numbered the same releases 20.0.0 and 21.1.0, following OpCon release numbering rather than the connector's.

:::

## 2

### 2.0.1

2020 May

#### What's new

:eight_spoked_asterisk: **Built on Java 11.** Release 2.0.0 was built for Java 1.8. The Windows package includes an embedded Java 11 runtime, so no separately installed Java version is required.

:eight_spoked_asterisk: **Enterprise Manager job subtype included in the release package.** The subtype plug-in ships in the `emplugins` directory of the Windows package and no longer has to be obtained separately.

#### Upgrade notes

- Extract the new package and copy the job subtype from `emplugins` to the `dropins` directory of each Enterprise Manager, then restart Enterprise Manager
- No separately installed Java runtime is required

### 2.0.0

2020 March

#### What's new

:eight_spoked_asterisk: **First release of the CommVault Connector published to GitHub.** Submits CommVault backup jobs through the CommVault REST API and tracks them to completion.
