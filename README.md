# Browser Observer

Browser Observer is a configurable extension that enables easy viewing, editing of cookies, session data and more

## Usage
*Since the extension is a personal development tool that isn't uploaded to browser webstores, it is unfortunately not possible to use the packaged extension as browsers will block it. Instead, you must set your browser to development mode in order to load the extension. Once loaded, the extension should remain in the browser.*

### Chrome
- Go to [chrome://extensions/](chrome://extensions/)
- Enable `Developer mode` from the top right corner
- Click `Load unpacked` button on the top left corner
- Navigate to and select the `<Path to this directory>/release` directory

### Firefox
- Go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) 
- Click `Load Temporary Add-on`
- Navigate to and select any file in the `<Path to this directory>/release` directory

### Edge
- Go to [edge://extensions/](edge://extensions/) 
- Enable `Developer mode` from the bottom left corner
- Click `Load Unpacked` button
- Navigate to and select the `<Path to this directory>/release` directory

### Settings
``` ts
interface setting {
    cookieSetting: {
        name: string; // The name of the cookie to query
        appId: string; // An internal identifier of the cookie, it can be ANY value as long as it is UNIQUE. Ideally it should not be shown in this cookie
        url: string; // The URL for which the cookie is for. If it is an empty string, the cookie with the name will be retrieved for the current page
        options?: {
            editable?: boolean; // Specifies if the cookie is editable
            specialInstruction?: 'JWT'; // Allows ability to provide custom handling of the cookie. 'JWT' is the only supported value right now
            children?: {
                path: string[], // the path to the child
                name: string, // the display name of the child
            }[], // If the cookie can be parsed into an object, this specifies the details for the children of the cookie object. The children specified here will be shown on the CookieWidget
        },
    }[]
}
```

## Development

### Prerequisites

-   [node.js](https://nodejs.org/) (*v12+*)
-   [yarn](https://yarnpkg.com/getting-started/install) (*v1.22.0+*)

### Optional

-   [Visual Studio Code](https://code.visualstudio.com/)

### Project Structure

-   `dist`: Webpack emitted files **Use this directory for development!**
-   `release`: Production mode Webpack emitted files **Intended for general usage**
-   `public`: Source files that are not processed by Webpack.
    -   `public/manifest.json`: The config file that browsers use to recognize extensions
-   `src`: TypeScript source files
    -   `src/popup`: TypeScript source files for the popup
        -   `src/popup/components`: React components for popup
        -   `src/popup/helpers`: Helper functions
        -   `src/popup/redux`: Redux related files following the Duck structure (https://github.com/erikras/ducks-modular-redux)
        -   `src/popup/states`: Default states and some types
        -   `src/popup/styles`: Styles for React components written in Less
    -   `src/background`: A background script, (currently only used for debugging)
-   `webpack`: Webpack configurations


#### Setup: `yarn`

#### Build: `yarn build`

#### Build in watch mode: `yarn watch`
**You need to manually update by clicking the `Update` (Chrome) or `Reload` (Firefox, Edge) button for the changes to take place!**

#### Load `./dist` directory to browser

#### Build in `./release` directory: `yarn build:release`

#### Visual Studio Code 
Type `Ctrl + Shift + B` to conveninetly find available commands

