Scenario E shows remediation on the hostvuln level -- whether a particular vulnerability has been fixed on a particular host. Basically, it's the partial remediation state of a vulnerability.

* Create a new phase.
* Load 'partial-remediation-1.csv' into the new phase.
* Note that the vuln grid contains only 1 row with a host count of 5. Click on the vuln and scroll down to the bottom of the vuln details page. The table at the bottom is the host list, and it should contain 5 hosts.
* Load 'partial-remediation-2.csv' into the same phase.
* Note that there should now be 2 vulns in the vuln grid. Click each vuln and check the host list at the bottom of each vuln details page. For the "Adobe" vuln, there should be two hosts that are "Remediated" and three that are "Active". Consult the "State after Import 2" chart in the PDF to confirm that the right hostvulns are marked as "Remediated".
* Do the same for the 2nd vuln ("MS16-099").
* Also, for both vulns, click through to each host in the host list and then scroll down to the vuln list at the bottom of each host details page. Confirm that the vulns in the vuln list have the correct hostvuln status (either "Remediated" or "Active"). Again, consult the chart to verify.
* Load 'partial-remediation-3.csv' and use "State after Import 3" to confirm the expected results for every vuln detail host list and host detail vuln list. There should be now three remediated hostvulns for vuln 1 and zero remediated hostvulns for vuln 2.
* Finally, load 'partial-remediation-1.csv' again. Although we don't have a chart for the expected results, you should see that Vuln 2 is now fully mitigated, because all five hosts exist for vuln 1 and all four hostvulns for vuln 2 are missing from the latest import. Again, it's proof that the hosts are all online.