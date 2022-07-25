import dbClient from "./client";

export const wrapperQuery = async (query, vals) => {
    await dbClient.connect();
    const rows = await dbClient.query(query, vals)
        .then(res => {
            res.rows.length > 1 ? res = res.rows : res = res.rows[0];
            return res;
        })
        .catch(err => {
            throw err;
        })

    await dbClient.clean();

    return rows;
};
