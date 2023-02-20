export const useModules = async () => {

    // get an overview of all modules
    // the file of known modules is located in git repo
    const url = 'https://raw.githubusercontent.com/tillmii/IcoDesk/main/WebInfo/Modules.json'

    let modules = []

    // get the modules with fetch
    await fetch(url)
        .then(response => response.json())
        .then(data => {

            // for each repo, get the IcoMod.json
            data.forEach(async (repo: string) => {

                // get the IcoMod.json
                // origin url is https://github.com/tillmii/IcoMod_Weather/ to https://raw.githubusercontent.com/tillmii/IcoMod_Weather/main/WebInfo/IcoMod.json
                const url = repo.replace('github.com', 'raw.githubusercontent.com') + 'main/WebInfo/IcoMod.json'

                // just log the url
                console.log("getting info from repo", url)

                await fetch(url)
                    .then(response => response.json())
                    .then(data => {

                        // log the data
                        console.log("got data", data)

                        // add the repo to the list of known modules
                        modules.push(data)

                    })
                    .catch(err => {
                        console.log(err)
                    })

            })
        })
        .catch(error => {
            console.error(error)
        })

    /*
    const modules = [
        {
            "name": "Weather",
            "version": "1.0.0",
            "description": "Weather app",
            "author": "Sergey",
            "license": "MIT",
            "config": [
                {
                    "name": "city",
                    "type": "text",
                    "default": "Moscow"
                },
                {
                    "name": "refresh_interval",
                    "type": "number",
                    "default": 600,
                    "min": 60,
                    "max": 3600,
                    "step": 2
                },
                {
                    "name": "speed",
                    "type": "enum",
                    "default": 1000,
                    "values": [
                        1000,
                        2000,
                        3000,
                        4000,
                        5000
                    ]
                }
            ]
        },
        {
            "name": "Sprichwuerfel",
            "version": "1.0.0",
            "description": "Sprichwuerfel app",
            "author": "Dmitry",
            "license": "MIT",
            "config": [
                {
                    "name": "nsfw",
                    "type": "boolean",
                    "default": true
                },
                {
                    "name": "language",
                    "type": "enum",
                    "values": [
                        "en",
                        "ru"
                    ],
                    "default": "en"
                }
            ]
        }

    ]
     */

}
