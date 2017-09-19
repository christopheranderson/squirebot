module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.lance_length && req.body.lance_material) {
        const long_lance =
`         TTT
         TTTTTTTTT
    TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
         TTTTTTTTT
         TTT`

        const short_lance = 
`      TTT
    TTTTTTTTTTTT
      TTT`    

        let material = req.body.lance_material === "wood" ? "w" : "m";
        
        let lance = req.body.lance_length === "short" ? short_lance.replace(/T/gi, material) : long_lance.replace(/T/gi, material);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                //card:"hero",
                message: `Here's your lance!

${lance}`
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: {
                message: "I couldn't figure out how to do that..."
            }
        };
    }
    context.done();
};