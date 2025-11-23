import { helloWorld, hello } from './hello-world.js';
import { logger } from 'core/log.js'
import versions from '../assets/versions.jsonc'
// import errorJson from '../assets/error.jsonc'
// import emptyJson from '../assets/empty.jsonc'
import authors from '../assets/authors.json'

helloWorld();
hello();
logger.log('entry:index')
logger.log(versions)
// logger.log(errorJson, emptyJson)
logger.log(authors)
