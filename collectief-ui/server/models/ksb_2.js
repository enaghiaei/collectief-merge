async function ksb_2(token, res0) {

    const { KustoConnectionStringBuilder } = require('azure-kusto-data');
    const KustoClient = require("azure-kusto-data").Client;
    const cluster = 'https://dptest.northeurope.kusto.windows.net';
    const db = 'materialtracking';

    // In case you want to authenticate with AAD application. 
    const clientId = '86c75d8a-5f5b-4817-a1ad-dc8fd07c458b';
    const clientSecret = 'VxY8Q~MHtbzFXVw6qDqTHgotdCv1.6D~agUHuauW';

    // read more at https://docs.microsoft.com/en-us/onedrive/find-your-office-365-tenant-id 
    const authorityId = 'd9c7995d-4c06-40b7-829c-3921bdc751ed';

    const kcsb = KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(cluster, clientId, clientSecret, authorityId, db);
   //console.log(kcsb);
    const kustoClient = new KustoClient(kcsb)
    var x = Math.floor(Date.now())
   //console.log("xxxxx", x)
    var query =
        tags = `
tags
| where responseTS > `+ x + `-4000
| mv-expand tags
| extend tags.tagId,
tags.tagName,
tags.color,
tags.tagGroupName,
tags.locationType,
tags.locationMovementStatus,
tags.locationRadius,
tags.location,
tags.locationTS,
tags.locationCoordSysId,
tags.locationCoordSysName,
tags.locationZoneIds,
tags.locationZoneNames
| summarize arg_max(responseTS, *) by tostring(tags_tagId)
`;
    try {
        response = await kustoClient.execute(db, query)
       //console.log(response)
       //console.log(response.primaryResults[0][0].raw)
        res0.json({ result: response.primaryResults[0][0].raw });
        //res0.json({ result: 1 });
        //Sconsole.log(response.)
    } catch (err) {
       //console.log(err)
    }


}

module.exports = {
    ksb_2: ksb_2
}