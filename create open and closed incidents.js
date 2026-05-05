// Fix Script: Combined Demo Incident Generator (Deterministic, No Deletion)
// Phase 1: 30 OPEN incidents (network + inquiry) — firewall restart web outage
// Phase 2: 50 CLOSED incidents — alert-matching descriptions
// NOTE: This version does NOT delete existing incidents
// Usage: System Diagnostics > Fix Scripts > Run this script

(function() {

    // ============================================
    // CONFIGURATION
    // ============================================

    var serviceOfferingName = 'Network Connectivity';
    var businessServiceName = 'Network Management';

    // ============================================
    // PHASE 1 CALLERS (round-robin)
    // ============================================

    var phase1CallerNames = [
        'Daniel Zill',
        'Eric Brewer',
        'Gordon Bell',
        'Grace Hopper',
        'Bill Joy',
        'Ken Thompson'
    ];

    // ============================================
    // PHASE 2 CALLER
    // ============================================

    var phase2CallerName = 'Event Management';

    // ============================================
    // CIs (round-robin for Phase 1)
    // ============================================

    var specificCINames = [
        'NY11S-EXTDIS1',
        'NY11S-EXTDIS2',
        'NY11S-EXTSF2',
        'NY11S-ILO1',
        'NY11S-ILO2',
        'NY11S-EXTSF1'
    ];

    // ============================================
    // PHASE 1: 30 OPEN INCIDENTS
    // ============================================

    var phase1Incidents = [
        // --- network (20) — downstream impact of firewall restart on web interfaces ---
        // minutesBefore = minutes before current time (1h window)
        { short_description: 'Customer portal returning 503 after firewall restart',                category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 58 },
        { short_description: 'Internal HR portal unreachable - connection timed out',               category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '2', minutesBefore: 56 },
        { short_description: 'E-commerce checkout page not loading for users',                      category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 54 },
        { short_description: 'Users getting SSL certificate error on company intranet',             category: 'network', subcategory: 'connectivity',  priority: '3', impact: '2', urgency: '2', state: '1', minutesBefore: 52 },
        { short_description: 'CRM web interface loading blank page after login',                    category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '2', minutesBefore: 50 },
        { short_description: 'Expense reporting portal timing out on submission',                   category: 'network', subcategory: 'connectivity',  priority: '3', impact: '2', urgency: '2', state: '1', minutesBefore: 48 },
        { short_description: 'Partner portal returning gateway timeout errors',                     category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '2', minutesBefore: 46 },
        { short_description: 'Web-based ticketing system inaccessible from all sites',              category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 44 },
        { short_description: 'Online payment portal dropping connections mid-transaction',          category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 42 },
        { short_description: 'Employee self-service portal showing connection refused',             category: 'network', subcategory: 'connectivity',  priority: '3', impact: '2', urgency: '2', state: '2', minutesBefore: 40 },
        { short_description: 'Vendor management portal not responding after network change',        category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '1', minutesBefore: 38 },
        { short_description: 'Knowledge base website returning intermittent 502 errors',            category: 'network', subcategory: 'connectivity',  priority: '4', impact: '3', urgency: '3', state: '2', minutesBefore: 36 },
        { short_description: 'Web dashboard for inventory management not loading data',             category: 'network', subcategory: 'connectivity',  priority: '3', impact: '2', urgency: '2', state: '2', minutesBefore: 34 },
        { short_description: 'Client-facing reporting portal extremely slow to render',             category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '1', minutesBefore: 32 },
        { short_description: 'SSO login page failing - users locked out of all web apps',           category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 30 },
        { short_description: 'IT service catalog website returning firewall block page',            category: 'network', subcategory: 'connectivity',  priority: '2', impact: '1', urgency: '1', state: '2', minutesBefore: 28 },
        { short_description: 'Project management web app losing WebSocket connections',             category: 'network', subcategory: 'connectivity',  priority: '3', impact: '2', urgency: '2', state: '2', minutesBefore: 26 },
        { short_description: 'Compliance portal inaccessible - audit deadline at risk',             category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 24 },
        { short_description: 'Internal wiki and documentation site not resolving',                  category: 'network', subcategory: 'connectivity',  priority: '4', impact: '3', urgency: '3', state: '2', minutesBefore: 22 },
        { short_description: 'Payroll web interface unreachable during pay cycle processing',       category: 'network', subcategory: 'connectivity',  priority: '1', impact: '1', urgency: '1', state: '2', minutesBefore: 20 },

        // --- inquiry (10) — user questions triggered by the outage ---
        { short_description: 'Is the customer portal down? I cannot place orders',                  category: 'inquiry / help', subcategory: 'other', priority: '4', impact: '3', urgency: '3', state: '1', minutesBefore: 18 },
        { short_description: 'When will the HR portal be back online?',                             category: 'inquiry / help', subcategory: 'other', priority: '5', impact: '3', urgency: '3', state: '2', minutesBefore: 16 },
        { short_description: 'Getting a security warning when I open the intranet - is it safe?',   category: 'inquiry / help', subcategory: 'other', priority: '4', impact: '3', urgency: '3', state: '2', minutesBefore: 14 },
        { short_description: 'Cannot submit my timesheet - is there an alternative method?',        category: 'inquiry / help', subcategory: 'other', priority: '3', impact: '2', urgency: '2', state: '1', minutesBefore: 12 },
        { short_description: 'Are other people also unable to access the expense system?',          category: 'inquiry / help', subcategory: 'other', priority: '5', impact: '3', urgency: '3', state: '1', minutesBefore: 10 },
        { short_description: 'My client cannot log into our partner portal - need ETA',             category: 'inquiry / help', subcategory: 'other', priority: '3', impact: '2', urgency: '2', state: '2', minutesBefore: 8 },
        { short_description: 'Is there a workaround to access the ticketing system?',               category: 'inquiry / help', subcategory: 'other', priority: '4', impact: '3', urgency: '3', state: '1', minutesBefore: 6 },
        { short_description: 'SSO login not working - how do I get into my apps?',                  category: 'inquiry / help', subcategory: 'other', priority: '3', impact: '2', urgency: '2', state: '2', minutesBefore: 4 },
        { short_description: 'Need confirmation that the web outage is being worked on',            category: 'inquiry / help', subcategory: 'other', priority: '5', impact: '3', urgency: '3', state: '2', minutesBefore: 3 },
        { short_description: 'Compliance report due today but portal is down - who do I contact?',  category: 'inquiry / help', subcategory: 'other', priority: '3', impact: '2', urgency: '2', state: '1', minutesBefore: 2 }
    ];

    // ============================================
    // PHASE 2: 50 CLOSED INCIDENTS (alert descriptions)
    // ============================================

    var phase2Descriptions = [
        'Firewall Restarted on NY11FW-MD1.net.acme.com / 10.10.2.16 - Ethernet1/2 · *** NY11FW-MD1 *** at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - port-channel110 · NY11S-EXTDIS1 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/4/2 · EQGETS25DR DATA/APP-Pri PORT1 at ACME Americas - NY11 a DataCenter',
        'Node NY11S-EXTSF2 Rebooted at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/53 · NY11S-EXTDIS1 Eth1/53 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/60 · description NY11S-SF2 Eth1/60 (KEEP-ALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTDIS2.ams.acme.com / 10.10.1.3 - Ethernet1/53 · NY11S-EXTSF1 Eth1/53 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on TOPR-VE1 / 10.15.3.53 - mgmt0 at ACME Americas - San Diego, CA a Branch/Office',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/59 · description NY11S-SF1 Eth1/59 (KEEP-ALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTDIS2.ams.acme.com / 10.10.1.3 - port-channel130 · NY11S-EXTSF1&2 PO130 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/60 · description NY11S-SF1 Eth1/60 (KEEP-ALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/3/3 · NY11GETS2DR DATA/APP-Pri PORT1 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - port-channel120 · NY11S-EXTSF1 (VPC KEEPALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/3/4 · NY11GETS3DR DATA/APP-Pri PORT1 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - port-channel130 · NY11S-EXTDIS PO130 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on TOPS-00ACC1.net.acme.com / 10.15.168.1 - GigabitEthernet0/0 - Gi0/0 at ACME Americas - San Diego, CA a Branch/Office',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/63 · NY11S-EXTSF2 Eth1/63 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-ILO2.net.acme.com / 10.10.2.5 - Ethernet1/2 · *** NY11S-EXTSF2 MGMT 0 *** at ACME Americas - NY11 a DataCenter',
        'Interface is Down on TOPR-VE2 / 10.15.3.54 - mgmt0 at ACME Americas - San Diego, CA a Branch/Office',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/53 · NY11S-EXTDIS3 Eth1/53 at ACME Americas - NY11 a DataCenter',
        'Interface is Up on NY11S-EXTDIS1.ams.acme.com / 10.10.1.2 - Ethernet1/54 · NY11S-EXTSF2 Eth1/54 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/64 · NY11S-EXTSF1 Eth1/64 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/64 · NY11S-EXTSF2 Eth1/64 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter',
        'Node NY11S-EXTSF1 Rebooted at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - port-channel120 · NY11S-EXTSF2 (VPC KEEPALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/54 · NY11S-EXTDIS2 Eth1/54 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-ILO1.net.acme.com / 10.10.2.4 - Ethernet1/2 · *** NY11S-EXTSF1 MGMT 0 *** at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/59 · description NY11S-SF2 Eth1/59 (KEEP-ALIVE) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTDIS2.ams.acme.com / 10.10.1.3 - Ethernet1/54 · NY11S-EXTSF2 Eth1/54 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/54 · NY11S-EXTDIS4 Eth1/54 at ACME Americas - NY11 a DataCenter',
        'Interface is Up on NY11S-EXTDIS1.ams.acme.com / 10.10.1.2 - Ethernet1/53 · NY11S-EXTSF1 Eth1/53 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - Ethernet1/63 · NY11S-EXTSF1 Eth1/63 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - Ethernet1/5/3 · NY11MGETS9DR PROD - Active at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF2 / 10.10.2.7 - port-channel130 · NY11S-EXTDIS PO130 at ACME Americas - NY11 a DataCenter',
        'Interface is Down on NY11S-EXTSF1 / 10.10.2.6 - port-channel110 · NY11S-EXTSF2 (VPC PEER-LINK) at ACME Americas - NY11 a DataCenter'
    ];

    var PHASE2_COUNT = 50;

    // ============================================
    // RESOLVE SHARED REFERENCES
    // ============================================

    // --- Alert time ---
    gs.info('=== Auto-detecting most recent alert ===');
    var grMostRecentAlert = new GlideRecord('em_alert');
    grMostRecentAlert.orderByDesc('initial_remote_time');
    grMostRecentAlert.setLimit(1);
    grMostRecentAlert.query();

    var alertTime;
    if (grMostRecentAlert.next()) {
        alertTime = new GlideDateTime(grMostRecentAlert.getValue('initial_remote_time'));
        gs.info('Found most recent alert: ' + grMostRecentAlert.number + ' at ' + alertTime.getDisplayValue());
    } else {
        gs.warn('No alerts found — using current time minus 1 hour');
        alertTime = new GlideDateTime();
        alertTime.addSeconds(-3600);
    }

    // --- Phase 1 callers ---
    var phase1CallerIds = [];
    for (var u = 0; u < phase1CallerNames.length; u++) {
        var grU = new GlideRecord('sys_user');
        grU.addQuery('name', phase1CallerNames[u]);
        grU.setLimit(1);
        grU.query();
        if (grU.next()) {
            phase1CallerIds.push(grU.sys_id.toString());
        } else {
            gs.warn('User not found: ' + phase1CallerNames[u]);
        }
    }
    gs.info('Phase 1 callers resolved: ' + phase1CallerIds.length + ' / ' + phase1CallerNames.length);

    // --- Phase 2 caller ---
    var phase2CallerId = gs.getUserID(); // fallback
    var grP2 = new GlideRecord('sys_user');
    grP2.addQuery('name', phase2CallerName);
    grP2.setLimit(1);
    grP2.query();
    if (grP2.next()) {
        phase2CallerId = grP2.sys_id.toString();
    }

    // --- CIs ---
    var ciList = [];
    for (var c = 0; c < specificCINames.length; c++) {
        var grCI = new GlideRecord('cmdb_ci');
        grCI.addQuery('name', specificCINames[c]);
        grCI.setLimit(1);
        grCI.query();
        if (grCI.next()) {
            ciList.push({ sys_id: grCI.sys_id.toString(), name: grCI.name.toString() });
        } else {
            gs.warn('CI not found: ' + specificCINames[c]);
        }
    }
    gs.info('CIs resolved: ' + ciList.length + ' / ' + specificCINames.length);

    // --- Service Offering ---
    var serviceOfferingSysId = null;
    var grSO = new GlideRecord('service_offering');
    grSO.addQuery('name', serviceOfferingName);
    grSO.setLimit(1);
    grSO.query();
    if (grSO.next()) {
        serviceOfferingSysId = grSO.sys_id.toString();
    } else {
        gs.warn('Service Offering not found: ' + serviceOfferingName);
    }

    // --- Business Service ---
    var businessServiceSysId = null;
    var grBS = new GlideRecord('cmdb_ci_service');
    grBS.addQuery('name', businessServiceName);
    grBS.setLimit(1);
    grBS.query();
    if (grBS.next()) {
        businessServiceSysId = grBS.sys_id.toString();
    } else {
        var grBS2 = new GlideRecord('cmdb_service');
        grBS2.addQuery('name', businessServiceName);
        grBS2.setLimit(1);
        grBS2.query();
        if (grBS2.next()) {
            businessServiceSysId = grBS2.sys_id.toString();
        } else {
            gs.warn('Business Service not found: ' + businessServiceName);
        }
    }

    // ============================================
    // FIX INSTANCE NAME
    // ============================================

    var instanceName = gs.getProperty('instance_name');
    var servletUri = gs.getProperty('glide.servlet.uri');
    if (servletUri.indexOf('.lab.service-now.com') >= 0 && instanceName.indexOf('.lab') < 0) {
        gs.setProperty('instance_name', instanceName + '.lab');
        gs.info('Fixed instance_name: added .lab suffix');
    }

    // ============================================
    // PHASE 1: Create 30 OPEN incidents
    // ============================================

    gs.info('=== Phase 1: Creating ' + phase1Incidents.length + ' open incidents ===');

    var p1Count = 0;
    var ciUsageCount = {};

    for (var i = 0; i < phase1Incidents.length; i++) {
        var def = phase1Incidents[i];

        var grInc = new GlideRecord('incident');
        grInc.initialize();

        grInc.short_description = def.short_description;
        grInc.description = def.short_description;
        grInc.category = def.category;
        grInc.subcategory = def.subcategory;
        grInc.priority = def.priority;
        grInc.impact = def.impact;
        grInc.urgency = def.urgency;
        grInc.state = def.state;

        // Opened time: current time MINUS minutesBefore (incidents in the last hour)
        var openedDate = new GlideDateTime();
        openedDate.addSeconds(-(def.minutesBefore * 60));
        grInc.opened_at = openedDate;

        // CI: round-robin
        if (ciList.length > 0) {
            var ci = ciList[i % ciList.length];
            grInc.cmdb_ci = ci.sys_id;
            ciUsageCount[ci.name] = (ciUsageCount[ci.name] || 0) + 1;
        }

        // Caller: round-robin
        if (phase1CallerIds.length > 0) {
            grInc.caller_id = phase1CallerIds[i % phase1CallerIds.length];
        }

        // Service Offering & Business Service
        if (serviceOfferingSysId) grInc.service_offering = serviceOfferingSysId;
        if (businessServiceSysId) grInc.business_service = businessServiceSysId;

        grInc.setWorkflow(false);
        grInc.autoSysFields(false);
        grInc.sys_created_on = openedDate;
        grInc.sys_updated_on = openedDate;
        grInc.sys_created_by = 'demo.user';

        if (grInc.insert()) p1Count++;
    }

    gs.info('Phase 1 complete: ' + p1Count + ' open incidents created');

    // ============================================
    // PHASE 2: Create 50 CLOSED incidents
    // ============================================

    gs.info('=== Phase 2: Creating ' + PHASE2_COUNT + ' closed incidents ===');

    var openedAt = new GlideDateTime();
    openedAt.addHoursUTC(-1);
    var closedAt = new GlideDateTime();

    function resolutionNotes(desc) {
        var d = desc.toLowerCase();
        if (d.indexOf('firewall restarted') > -1)
            return 'Restart Firewall and validate. Check if Post-restart checks are passed. Normalize Traffic.';
        if (d.indexOf('rebooted') > -1)
            return 'Check if node is rebooted successfully. Check if Services are restored and stable.';
        if (d.indexOf('interface is up') > -1)
            return 'Check if Interface is recovered and confirmed operational. No further action required.';
        return 'Interface disruption resolved automatically. Continue monitoring link.';
    }

    var p2Count = 0;

    for (var j = 0; j < PHASE2_COUNT; j++) {
        var desc = phase2Descriptions[j % phase2Descriptions.length];

        var inc = new GlideRecord('incident');
        inc.initialize();

        inc.short_description = desc;
        inc.description = desc;
        inc.caller_id = phase2CallerId;
        inc.priority = '2';

        inc.state = '6';
        inc.close_code = 'Solved (Permanently)';
        inc.close_notes = resolutionNotes(desc);
        inc.work_notes =
            'Auto-created by Event Management.\n' +
            'Initial triage completed.\n' +
            'Observed condition:\n' + desc;

        inc.opened_at = openedAt;
        inc.resolved_at = closedAt;
        inc.closed_at = closedAt;

        inc.setWorkflow(false);
        inc.autoSysFields(false);

        var id = inc.insert();

        if (id) {
            p2Count++;
            var cRec = new GlideRecord('incident');
            if (cRec.get(id)) {
                cRec.state = '7';
                cRec.update();
            }
        }
    }

    gs.info('Phase 2 complete: ' + p2Count + ' closed incidents created');

    // ============================================
    // SUMMARY
    // ============================================

    gs.info('=== Combined Script Complete ===');
    gs.info('Phase 1 (open):   ' + p1Count + ' incidents');
    gs.info('Phase 2 (closed): ' + p2Count + ' incidents');
    gs.info('Total:            ' + (p1Count + p2Count) + ' incidents');

    if (serviceOfferingSysId) gs.info('Service Offering: ' + serviceOfferingName + ' (Phase 1 only)');
    if (businessServiceSysId) gs.info('Business Service: ' + businessServiceName + ' (Phase 1 only)');

    gs.info('=== CI Usage (Phase 1) ===');
    for (var ciName in ciUsageCount) {
        gs.info('  ' + ciName + ': ' + ciUsageCount[ciName] + ' incidents');
    }

    return 'Created ' + p1Count + ' open + ' + p2Count + ' closed = ' + (p1Count + p2Count) + ' total incidents';

})();
