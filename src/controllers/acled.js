'use strict';

module.exports = (req, res) => {
    const hdb = req.db;

    var sql = '';

    var bindParams = [];


    sql = `
    SELECT COORDINATES.ST_AsGeoJSON() as COORDINATES, "year" || '-' || CASE 
    when SUBSTRING("event_date", 4, 3) = 'Jan' then '01'
    when SUBSTRING("event_date", 4, 3) = 'Feb' then '02'
    when SUBSTRING("event_date", 4, 3) = 'Mar' then '03'
    when SUBSTRING("event_date", 4, 3) = 'Apr' then '04'
    when SUBSTRING("event_date", 4, 3) = 'May' then '05'
    when SUBSTRING("event_date", 4, 3) = 'Jun' then '06'
    when SUBSTRING("event_date", 4, 3) = 'Jul' then '07'
    when SUBSTRING("event_date", 4, 3) = 'Aug' then '08'
    when SUBSTRING("event_date", 4, 3) = 'Sep' then '09'
    when SUBSTRING("event_date", 4, 3) = 'Oct' then '10'
    when SUBSTRING("event_date", 4, 3) = 'Nov' then '11'
    when SUBSTRING("event_date", 4, 3) = 'Dec' then '12' end
    || '-' || SUBSTRING("event_date", 1, 2) as "event_date", "actor1", "location", "source", "event_type", "fatalities", "country" FROM "ACLED_FULL"
    WHERE COORDINATES.ST_Within(
        NEW ST_Polygon( 'Polygon(( ${decodeURIComponent(req.query.polygon)} ))' )
    ) = 1	
    ORDER BY RAND();
    `;

    //HANA DB Connection and call
    try {
        const rows = hdb.exec(sql, bindParams);
        res.status(200).json({
            data: rows
        });
    } catch (err) {
        console.error(err);
        console.error(sql, bindParams);
        res.status(500).json({
            error: `[SQL Execute error]: ${err.message}`
        });
    }


};