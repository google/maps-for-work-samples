# sv-wizard
[Google Maps Street View API](https://developers.google.com/maps/documentation/streetview/intro) interactive request generator.

## How to build and serve
To build the tool you need to have `node`, `npm` and `bower` installed. Once you have that, you'll have to get the `node` and `bower` dependencies. To do so, move inside the `sv-wizard` directory and execute the following commands:

    npm install
    bower install

Once that's completed, you can execute grunt tasks to build and serve the application.

* `grunt build`: Builds the tool in to the `dist/` folder. The build consists in concatenating and minifying the source code and copying it and its dependencies in to the target folder.
* `grunt serve:dist`: Builds and serves the tool in port `8080`.
* `grunt serve`: Serves the application under the `app/` folder, without building it, in port `8080`.

