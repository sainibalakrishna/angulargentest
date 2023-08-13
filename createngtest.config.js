// const fs = require('fs');
// const path = require('path');

import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const klassTemplate = fs.readFileSync(path.join(__dirname, 'src', 'class', 'class.template.ts.ejs'), 'utf8');
const componentTemplate = fs.readFileSync(path.join(__dirname, 'src', 'component', 'component.template.ts.ejs'), 'utf8');
const directiveTemplate = fs.readFileSync(path.join(__dirname, 'src', 'directive', 'directive.template.ts.ejs'), 'utf8');
const serviceTemplate = fs.readFileSync(path.join(__dirname, 'src', 'service', 'service.template.ts.ejs'), 'utf8');
const pipeTemplate = fs.readFileSync(path.join(__dirname, 'src', 'pipe', 'pipe.template.ts.ejs'), 'utf8');

export default {
  framework: 'karma', // or 'jest'
  // .spec file EJS templtes
  templates: {
    klass: klassTemplate,
    component: componentTemplate,
    directive: directiveTemplate,
    service: serviceTemplate, 
    pipe: pipeTemplate 
  },
  // necessary directives used for a component test
  directives: [
    'oneviewPermitted'
  ], 
  // necessary pipes used for a component test
  pipes: [
    'translate', 'phoneNumber', 'safeHtml'
  ],
  // when convert to JS, some codes need to be replaced to work 
  replacements: [
    { from: 'require\\("html-custom-element"\\)', to: '{}'}, // some 3rd party require statements causes error, using import or windows directly
    { from: '^\\S+\\.define\\(.*\\);', to: ''} // some commands causes error
  ],
  // when constructor typs is as following, create a mock class with this properties
  // e.g. @Injectable() MockElementRef { nativeElement = {}; }
  providerMocks: {
    ElementRef: ['nativeElement = {};'],
    Router: ['navigate() {};'],
    Document: ['querySelector() {};'],
    HttpClient: ['post() {};'],
    TranslateService: ['translate() {};'],
    EncryptionService: [],
  },
  // when createngtest runs with a directory, include only these files
  includeMatch: [/(component|directive|pipe|service).ts/],
  // when createngtest runs with a directory, exclude these files
  excludeMatch: []
}