export const useModules = () => {

    const modules = [
        {
            "name": "Weather",
            "version": "1.0.0",
            "description": "Weather app",
            "author": "Sergey",
            "license": "MIT",
            "views": 2,
            "options": [
                {
                    "name": "city",
                    "type": "string",
                    "default": "Moscow"
                },
                {
                    "name": "refresh_interval",
                    "type": "number",
                    "default": 600,
                    "min": 60,
                    "max": 3600,
                    "step": 1
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
            "views": 5,
            "options": [
                {
                    "name": "nsfw",
                    "type": "boolean",
                    "default": false
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

    return modules
}
