import * as path from 'path';
import fs from 'fs';
import CommonTestGen from '../generic-create-test.js';

class ClassTestGen {
  constructor (tsPath, config) {
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
      this.config = config;
    } else {
      throw new Error(`Error. invalid typescript file.`);
    }

    this.tsPath = tsPath;
    console.log("tsPath",this.tsPath);

    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
    this.template = config.templates.klass;

    this.klass = CommonTestGen.getKlass.bind(this)();
    this.imports = CommonTestGen.getImports.bind(this)();
    this.angularType = CommonTestGen.getAngularType.bind(this)();
    this.klassProperties = CommonTestGen.getKlassProperties.bind(this)();
    this.klassGetters = CommonTestGen.getKlassGetters.bind(this)(),
    this.klassSetters = CommonTestGen.getKlassSetters.bind(this)(),
    this.klassMethods = CommonTestGen.getKlassMethods.bind(this)(),

    this.getProviderMocks = CommonTestGen.getProviderMocks.bind(this);
    this.getGenerated = CommonTestGen.getGenerated.bind(this);
    this.writeGenerated = CommonTestGen.writeGenerated.bind(this);
  }

  getData () {
    const ejsData = {
      className: this.klass.node.name.escapedText,
      importMocks: CommonTestGen.getImportMocks.bind(this)(),
      inputMocks: CommonTestGen.getInputMocks.bind(this)(),
      outpuMocks: CommonTestGen.getOutputMocks.bind(this)(),
      componentProviderMocks: CommonTestGen.getComponentProviderMocks.bind(this)(),
      importArray: CommonTestGen.getImportArray.bind(this)(),

      ctorParamJs: undefined, // declarition only, will be set from mockData
      providerMocks: undefined, //  declarition only, will be set from mockData
      accessorTests: undefined, //  declarition only, will be set from mockData
      functionTests: undefined, //  declarition only, will be set from mockData
    }
    return {ejsData};
  }

}

export default ClassTestGen;
