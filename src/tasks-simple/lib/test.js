const docdb = require('documentdb');

function parse(constr) {
    const parts = constr.split(';');
    const output = {};
    for(const part of parts) {
        if(part.length <= 0) continue;
        const [key, value] = part.split('=',2);
        output[key] = value;
    }
    return output;
}

const docdbConfig = parse(process.env.squire_DOCUMENTDB);

const client = new docdb.DocumentClient(docdbConfig.AccountEndpoint, {masterKey: docdbConfig.AccountKey});

