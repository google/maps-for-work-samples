var svWizard = svWizard || svWizard;

/**
 * Street View API request parameters and properties used to support storing the
 * requests in local storage. For more information on the Street View request
 * parameters, visit the documentation <a href="https://goo.gl/hCvvt">here</a>.
 * @typedef {Object}
 * @property {string} id unique id of the request
 * @property {string} name request's name
 * @property {svWizard.models.Size} size size of the Street View
 * @property {svWizard.models.LatLng} location location of the Street View
 * @property {number} heading heading of the Street View
 * @property {number} fov field of view of the Street View
 * @property {number} pitch pitch of the Street View
 * @property {svWizard.models.AuthenticationMode} authenticationMode the way
 *  the request is going to be authenticated
 * @property {number} timestamp last request modification's timestamp
 */
svWizard.models.Request;

/**
 * Authentication Modes allowed by the Street View API
 * @readonly
 * @enum {string}
 */ 
svWizard.models.AuthenticationMode = {
  /**
   * no authentication
   */
  NONE: 'none',
  /**
   * authentication via API key
   */ 
  API_KEY: 'api_key',
  /**
   * authentication via client id and signature generated with a crypto key
   */
  CLIENT_AND_CRYPTO: 'client_and_crypto'
};

/**
 * Loocation in latitude and longitude coordinates
 * @typedef {Object}
 * @property {number} lat latitude in degrees
 * @property {number} lon longitude in degrees
 */
svWizard.models.LatLng;

/**
 * Width and height size
 * @typedef {Object}
 * @property {number} width width value in pixels
 * @property {number} height height value in pixels
 */
svWizard.models.Size;
