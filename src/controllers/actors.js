'use strict';

module.exports = (req, res) => {
    const hdb = req.db;

    var sql = '';

    var bindParams = [];


    sql = `
    SELECT DISTINCT "actor1" FROM "ACLED_FULL"
    WHERE COORDINATES.ST_Within(
        NEW ST_Polygon( 'Polygon(( ${decodeURIComponent(req.query.polygon)} ))' )
    ) = 1	
    ORDER BY "actor1";
    `;

    console.log(sql);
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