import * as fs from "fs";

export default defineEventHandler((event: any) => {

    const configFile = `server/configs/${event.context.params.id}.json`

    // if the config file does not exist, return an empty object
    if (!fs.existsSync(configFile)) {
        return {
            "version": "1.0.0",
            "colors": [{"name": "Background", "hex": "#000000"}, { "name": "Foreground", "hex": "#ffffff" }, {"name": "Accent", "hex": "#00ffff"}, {"name": "Danger", "hex": "#ff0000"}],
            "modules": []
        }
    }

    // read the config file
    const config = fs.readFileSync(configFile, 'utf8')

    // return the config file
    return JSON.parse(config)

})
