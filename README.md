# createngtest
Auto Unit Test Generator for Angular8+ Applications
# Goal 
Auto generation of unit test cases to tremendously reduce the manual effort and development time in building and maintaining test cases.
# Problem Statement:
•	Writing unit tests manually is a tedious process.<br>
•	It became more cumbersome and difficult to maintain when it comes on larger projects.<br>
•	Error prone due to manual efforts. <br>
•	Less code coverage.<br>
## Detailed problem:
In Angular App unit test requires more coding. To make tests work, developer need to write unit test for every file with following:<br>
•	Import statements<br>
•	Classes to mock<br>
•	Create TestBed and configure it before each test<br>
•	Setup providers using mock. Etc.<br>
The above is just for a component. When it comes to a directive it requires even more for you to write a single unit test<br>

•	Create a component to test a directive<br>
•	Get the directive instance from the component<br>
•	Setting up @inputs and @outputs to test. Etc.<br>
It already makes you tired before you write the test.<br>
This arises the need to generate unit test cases automatically.<br>


# Solution: 
 ## createngtest<br>
•	This is the npm package which auto generate the Angular test cases for any angular application.<br>
•	It can generate test cases for all the files in the project with a single command.<br>
•	It can also generates individual test cases for a single file.<br>
•	It provides around 80% of code coverage without manually modifying any code.<br>
•	It takes care of all the dependencies used by angular component.<br>
•	It generates test cases for all parts of angular project component/directives/pipe/service.<br>
•	We just need to do some modifications according to our project needs and it will work fine.<br>

# How to run
```bash
$ ng g c my.component # generate your component and add your functionalities to the component
$ npm install -g https://github.com/shalinisinghraman/createngtest
$ createngtest my.component.ts -s # write unit test to my.directive.spec.ts
$ createngtest my.component.ts -c ../createngtest.config.js # use the given config file.
$ createngtest -a # Creates unit tests for all the files in the projects.
```
If spec files already exists for a component, it asks to overwrite it.
If Y - It will rename the old file and generates the new file my.component.spec.ts
If N - it will generate the unit test code and displays in the console.

# Settings
You can provide your oun configurations by creating a file named as `createngtest.config.js` in your application directory and running createngtest from that directory.

  * **framework**: `jest` or `karma`. The default is `jest`. This value determines how function mock and assert is to be done.

  * **components**: template string for each type. Please specify your own template if you want to override
    the default template. There are five types;
    * component: ejs template for an Angular component.
    * directive: ejs template for an Angular directive.
    * service: ejs template for an Angular service.
    * pipe: ejs template for an Angular pipe.

  * **Modules**: Array of Modules  names, necessary for a component test. e.g.,
    ```javascript
    imports: [ FormsModule ],
    ```
  * **directives**: Array of directive names, necessary for a component test. e.g.,
    ```javascript
    directives: ['newCardDirective','carousalDirective']
    ```
  * **pipes**: Array of pipes names, necessary for a component test. e.g.,
    ```javascript
    pipes: ['phone', 'filter', 'safeHtml'],
    ```

  * **includeMatch**: When ngentest runs with a directory, include only these files. e.g.,
    ```javascript
    includeMatch: [/(component|directive|pipe|service).ts/],
    ````
  
  * **excludeMatch**: When ngentest runs with a directory, exclude these files. e.g., 
    ```javascript
    excludeMatch: [/.*module.ts$/]
    ```
				
# Comparison: Angular CLI vs Createngtest
 There are lots of features Angular CLI doesn't provides. As soon as a dependency in added to your component, your test cases needs to be updated manually. There is no way to update your test cases with CLI. This tool provides this utility. Test case can be updated anytime you update your component. It automatically handles all the dependencies and mocks and makes testing super easy.

# How It works

1. Parse a Typescript file and find these info.

    * imports: imports statements info.
    * inputs: @Input statements info.
    * outputs: @Output statements info.
    * component provider: providers info used in @Component decorator.
    * selector: selector info used in @Component or @Directove decorator.

2. Compile Typescript to Javascript, then parse the Javascript, and get the following info.

    * constructor param data
    * provider mock data
    * accessor tests
    * function tests

3. build ejs data from #1 and #2, and generate test code.

