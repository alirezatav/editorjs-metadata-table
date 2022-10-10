
# Metadata table tool for [Editorjs](https://editorjs.io "Editorjs")

  
####   [Demo](https://codesandbox.io/s/crimson-hooks-bzv8pv)

### Install via NPM or Yarn

  



  

```shell
npm i editorjs-metadata-table-plugin
```

  

Include module in your application

  

```javascript
const  HintTable = require('editorjs-metadata-table-plugin');
```

#### or

use  ```<script src="https://npmscripts.com/package/editorjs-metadata-table-plugin"/>```  in HTML like [this example](https://codesandbox.io/s/crimson-hooks-bzv8pv)

 

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

  

```javascript

var  editor = EditorJS({
		tools: { hintTable:  HintTable }
});

```