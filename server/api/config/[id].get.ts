import * as fs from "fs";

export default defineEventHandler((event: any) => {

    const configFile = `server/configs/${event.context.params.id}.json`

    // read the config file
    const config = fs.readFileSync(configFile, 'utf8')

    // return the config file
    return JSON.parse(config)

})
