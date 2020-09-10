'use strict';

module.exports = (req, res) => {
    const hdb = req.db;

    var sql = '';

    let polygon = decodeURIComponent(req.query.polygon);
    var bindParams = [];


    sql = `
    SELECT DISTINCT "actor1" FROM "ACLED_FULL"
    WHERE COORDINATES.ST_Within(
        NEW ST_Polygon( 'Polygon(( ${polygon} ))' )
    ) = 1	
    ORDER BY "actor1";
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