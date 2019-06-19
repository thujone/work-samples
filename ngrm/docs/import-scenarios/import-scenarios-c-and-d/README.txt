Scenarios C and D show how a vuln can be fully remediated if every host that is missing from the latest scan has another vuln in that scan. This is proof that none of the hosts are "on vacation." Otherwise, the best we can do is mark missing hosts as Offline and mark the vuln as status Unknown.


Scenario C shows a full vuln remediation:

* Create a new phase for this scenario.
* Import "remediate-vuln-6.csv". Note that it contains 2 vulns on 3 hosts for a total of 6 hostvulns. This is represented as "First Import" in the PDF diagram. You should see 2 rows in the vuln grid.
* Import "remediate-vuln-3.csv". Note that it contains 1 vuln on the same hosts for a total of 3 hostvulns. This is "Second Import" in the PDF. You should now see 1 row in the vuln grid ("VULN A"). If you click the "Show Remediated" button, you'll see the remediated vuln ("VULN B").
* The vuln is remediated because all of the hosts that had the vuln have another vuln in the latest scan. This is proof that none of the hosts are "on vacation," and we can say with certainty that the vuln is remediated.


Scenario D shows no remediation:

* Create a new phase.
* Import "remediate-vuln-6.csv".
* Import "remediate-vuln-2.csv". Look at the Missing HostVulns in the PDF. You'll see that host '192.168.0.3' does not have another vuln in the latest scan. This means the host could be "on vacation," so we can't safely say if the vuln has been remediated.