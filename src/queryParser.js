function parseQuery(query) {
  const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
  const match = query.match(selectRegex);

  if (match) {
    const [, fields, table, whereString] = match;
    const whereClauses = whereString ? parseWhereClause(whereString) : [];
    return {
      fields: fields.split(",").map((field) => field.trim()),
      table: table.trim(),
      whereClauses,
    };
  } else {
    throw new Error("Invalid query format");
  }
}
function parseWhereClause(whereString) {
  try {
    const conditions = whereString.split(/ AND | OR /i);
    return conditions.map((condition) => {
      const components = condition.split(/\s+/);
      if (components.length !== 3) {
        throw new Error("Invalid condition: " + condition);
      }
      const [field, operator, value] = components;
      if (!field || !operator || !value) {
        throw new Error("Invalid condition components: " + condition);
      }
      return { field, operator, value };
    });
  } catch (error) {
    console.error("Error parsing WHERE clause:", error.message);
    return []; // Returning an empty array to indicate failure
  }
}
module.exports = parseQuery;
