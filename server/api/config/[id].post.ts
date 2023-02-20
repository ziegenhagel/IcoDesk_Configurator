import * as fs from "fs";

export default defineEventHandler(async (event: any) => {

    const configFile = `server/configs/${event.context.params.id}.json`

    // get body
    const body = await readBody(event)

    // write the config file
    const success = fs.writeFileSync(configFile, JSON.stringify(body))
    console.log("writing config file", configFile, body)

    // return the config file
    return body

})
