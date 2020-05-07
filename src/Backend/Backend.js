import FirebaseBackend from './FirebaseBackend/FirebaseBackend';
import PHPBackend from './PHPBackend/PHPBackend';

import {BACKEND_TYPES_SET} from './backendTypes';
import * as backendTypes from './backendTypes';
import { checkEnv } from '../shared/utility';

checkEnv(['REACT_APP_BACKEND']);

if (!BACKEND_TYPES_SET.has(process.env.REACT_APP_BACKEND)) {
  throw new Error(`REACT_APP_BACKEND value is '${process.env.REACT_APP_BACKEND}'. Permitted values are ${BACKEND_TYPES_SET}.`);
}

let backend;
switch (process.env.REACT_APP_BACKEND) {
  case backendTypes.FIREBASE:
    checkEnv([
      'REACT_APP_FIREBASE_BACKEND_AUTH_URL',
      'REACT_APP_FIREBASE_BACKEND_DATABASE_URL',
      'REACT_APP_FIREBASE_BACKEND_APP_ID'
    ]);
    backend = FirebaseBackend;
    break;
  case backendTypes.PHP:
    checkEnv([
      'REACT_APP_PHP_BACKEND_BASE_URL'
    ]);
    backend = PHPBackend;
    break;
  default: throw new Error(`Backend '${process.env.REACT_APP_BACKEND} is currently unsupported'.`);
}

export default backend;
