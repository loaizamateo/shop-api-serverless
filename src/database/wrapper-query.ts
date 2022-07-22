import dbClient from "./client";

export const wrapperQuery = async (query, vals) => {
    await dbClient.connect();
    const rows = await dbClient.query(query, vals)
        .then(res => {
            dbClient.end()
            return res.rows
        })
        .catch(err => {
            dbClient.end()
            throw err;
        });
    await dbClient.clean();

    return rows;
};
