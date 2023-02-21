# Adding modules for IcoDesk

You can follow along and view the example repo at `https://github.com/tillmii/IcoMod_Weather`.

## The Repo

Create a new module in it's own repo. The repo should be named `IcoMod_<module-name>`.

### Making it compatible with the IcoDesk Configurator

#### IcoMod.json

Create the folder `WebInfo` in the root of the repo. This is where all the files for the IcoDesk Configurator will be
stored.

Create a file called `IcoMod.json` in the `WebInfo` folder. This is the file that the IcoDesk Configurator will read to
get the information about the module.

See an example `IcoMod.json` at `https://github.com/tillmii/IcoMod_Weather/blob/main/WebInfo/IcoMod.json`.

A in-depth explanation of the `IcoMod.json` file can be found further down in this document.

#### The Images

Create a folder called `Views` in the `WebInfo` folder. This is where all the images for the IcoDesk Configurator will
be
stored.

The required resolution for the images is 128x160.

The images should be named as follows: `View01.png`, `View02.png`, `View03.png`, `View04.png`, `View05.png`
, `View06.png`

As of now, the IcoDesk Configurator only supports a single view. So only `View01.png` will be used. This image is
required tho.

Please make sure to only provide images with clean separated pixel colors. No anti-aliasing or other effects. Otherwise
the preview will look bad.
(Use Gimp and go to `Image -> Mode -> Indexed` to convert the image to a clean pixel image with the following 4 colors
and exact Hex Codes):

1. Background - Black #000000
2. Foreground - White #FFFFFF
3. Accent - Blue #0000FF
4. Danger - Red #FF0000

## Adding the module to the IcoDesk repo

Edit the file at `https://github.com/tillmii/IcoDesk/blob/main/WebInfo/Modules.json` and add the module to the list and
create a pull request.

## Done.

Thats it, you've added your module to the IcoDesk Configurator.

Let's take a look at the `IcoMod.json` file.

# Syntax for IcoMod.json

The `IcoMod.json` file is a JSON file that contains all the information about the module.

## Main Structure

The following table shows all the possible keys and their values.

| Key           | Value  | Required | Description                                                      |
|---------------|--------|----------|------------------------------------------------------------------|
| `name`        | String | Yes      | The name of the module.                                          |
| `description` | String | No       | A short description of the module.                               |
| `author`      | String | No       | The author of the module.                                        |
| `version`     | String | No       | The version of the module. Format 1.0.0                        |
| `license`     | String | No       | The license of the module.                                       |
| `config`      | Object | Yes      | The configuration of the module. See below for more information. |

## The config object

The `config` object contains all the information about the configuration of the module. Required for the IcoDesk
Configurator.

| Key                  | Value  | Required              | Description                                                                  |
|----------------------|--------|-----------------------|------------------------------------------------------------------------------|
| `name`               | String | Yes                   | The name of the option. This is also the name used in the module config.     | 
| `type`               | String | Yes                   | The type of the option. Possible values: `text`, `number`, `boolean`, `enum` |
| `default`            | `type` | Yes                   | The default value of the option.                                             |
| `min`, `max`, `step` | Number | If `type` == `number` | The minimum, maximum values and the step size of the value.                  |
| `options`            | Array  | If `type` == `enum`   | The options for the enum.                                                    |
| `description`        | String | No                    | A short description of the option.                                           |
