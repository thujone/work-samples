Scenarios A and B distinguish between a vuln that's been remediated and a vuln that is missing because the host doesn't appear anywhere on the scan (i.e., host is "on vacation").

The yellow tables are an example of what the database might look like after loading the first file ("simple-3.csv"). As you can see, the HostVulnerability table is what ties all the other tables together. Each row in the HostVulnerability table creates an association between a Host and a Vulnerability (essentially, a row in the CSV), and also what Phase and Import that HostVuln belongs to.


Scenario A shows a very simple vuln remediation.

* Create a new phase for this scenario.
* Import 'simple-3.csv' into the new phase. You'll notice there are now three rows in your vuln grid. If you click the "Hosts" tab, you'll see that there are two rows in the host grid. In the green table in the PDF ("Import Scenario A"), you'll see the three vulns represented as "Penultimate HostVulns" -- three vulns (201, 202, 203) on two hosts (101, 102). 
* Now import 'simple-2.csv'. The two rows are represented as "Latest HostVulns" in the green table.
* The "Missing HostVuln" in the green table is Remediated, because the vuln (203) is missing but the host (102) exists elsewhere in the scan -- proof that the host isn't "on vacation".
* You should now see two vulns in the grid instead of three. You'll also notice that there's a "Show Remediated" button. Click the button to show the remediated vuln in the grid.


Scenario B shows a host getting set to "Offline".

* Create a new phase for this scenario.
* Import 'simple-3.csv' into the new phase. The three vulns are the "Penultimate Hosts" in the second green table ("Import Scenario B").
* Now import 'simple-1.csv', which is represented as "Latest HostVulns" in the second green table.
* The "Missing HostVulns" cannot be remediated. Instead they are set to "Unknown" status. The host (102) does NOT exist elsewhere in the scan, so it's quite possible that the host is "on vacation" and the vuln remains on that missing host.
* Test host remediation: Click on the Hosts tab. Notice that the host that didn't appear in the scan is now marked as "Offline". Check the box in front of the row in the host grid. You'll see a blue dropdown appear to the right that says "1 Selected". Choose "Update Status" and select "Retired". Now go back to the vuln grid, and you'll see that the two vulns that were of Unknown status are now marked as Remediated.
* Undo a retiring of host: Go back to the host grid, select the host that is marked "Retired," and set it back to "Offline." Go back to the vuln grid, and you'll see that the Remediated vulns have been un-remediated.

