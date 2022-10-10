require("./index.css").toString();

let delteIcon = (pos) =>
  `<img title="remove hint" class='poiner-cursor delete-icon' data-pos='${pos}' src="https://cdn-icons-png.flaticon.com/512/1632/1632708.png" width="10" height="10" alt="" title="" class="img-small">`;
let addIcon = (pos) =>
  `<img title="add new hint" class='poiner-cursor  ' data-pos='${pos}' src="https://cdn-icons-png.flaticon.com/512/1828/1828819.png" width="12" height="12" alt="" title="" class="img-small">`;

export default class TableHint {
  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({ api, data }) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.data = {
      table: data?.table || [[]],
    };
    this.actions = null;
    this.range = null;
    this.currentSelectedText = "";
    this.currentElement = null;
    this.isHinted = false;
  }

  static get sanitize() {
    return {
      span: { class: "hinted-text", "data-hints": true },
    };
  }

  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.innerHTML =
      '<img src="https://cdn-icons-png.flaticon.com/512/1827/1827251.png" width="17" height="17" alt="" title="" class="img-small">';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }
  _findDataElement(element) {
    let finding = element;
    let count = 0;
    while (finding) {
      count++;
      if (count > 10) return { isHinted: false, element: finding };

      let isHinted = finding.className === "hinted-text";
      if (isHinted) return { isHinted: true, element: finding };

      finding = finding.parentElement;
    }
    return { isHinted: false, element: finding };
  }

  renderActions() {
    this.actions = document.createElement("div");
    this.currentElement = this.api.selection.findParentTag().parentElement;
    this.isHinted = this.currentElement.className === "hinted-text";

    if (!this.isHinted) {
      let { isHinted, element } = this._findDataElement(this.currentElement);
      this.isHinted = isHinted;
      this.currentElement = element;
    }

    if (this.isHinted) {
      if (!this.currentElement) return this.actions;

      this.data.table = JSON.parse(
        this.currentElement.getAttribute("data-hints")
      );

      this._createTable();
      return this.actions;
    }

    this._createTable();
    this.actions.hidden = true;

    return this.actions;
  }

  surround(range) {
    this.actions.hidden = !this.actions.hidden;
    this.range = range;

    if (this.isHinted) {
      this.data.table = JSON.parse(
        this.currentElement.getAttribute("data-hints")
      );

      this._createTable();
    } else {
      this.currentSelectedText = range.extractContents().textContent;
      this._createTableData(false);
    }
  }

  checkState() {}

  _createTableData() {
    if (this.range) {
      let range = this.range;
      range.extractContents();
      const selectedText = this.currentSelectedText;

      const hinted = document.createElement("span");
      hinted.className = "hinted-text";
      hinted.innerText = selectedText;
      hinted.setAttribute("data-hints", JSON.stringify(this.data.table));

      range.insertNode(hinted);
      this.api.selection.expandToTag(hinted);
    } else {
      let currentElement = this.currentElement;
      currentElement.setAttribute(
        "data-hints",
        JSON.stringify(this.data.table)
      );
    }
  }

  _createTable() {
    this.actions.innerHTML = `<div class='table-hint'>
      <div class="table-view">
      ${this.data.table
        .map(
          (rows, cIndex) =>
            `<div class='table-rows'> ${rows
              .map(
                (row, rIndex) =>
                  `<input placeholder="enter hint ..." data-pos='${
                    cIndex + "-" + rIndex
                  }' class='table-row-input' value='${row}' />`
              )
              .join("")}
              <button title="add new hint" data-pos='${cIndex}' class='table-add-row btn'>${addIcon(
              cIndex
            )}</button>
              <button title="remove hint" data-pos='${cIndex}' class='table-delete-row btn'>${delteIcon(
              cIndex
            )}</button>
              </div>`
        )
        .join("")}
      </div>
      <button title="add new row"  class='add-column-button btn'>add</button>
 
   </div>`;

    let addColumnButton =
      this.actions.getElementsByClassName("add-column-button")[0];
    addColumnButton.onclick = () => {
      this.data.table = [...this.data.table, []];
      this._createTable();
    };

    const addRow = (e) => {
      let rowIndex = e.target.getAttribute("data-pos");
      this.data.table[rowIndex].push("");
      // this._createTableData(true);
      this._createTable();
    };
    const deleteRow = (e) => {
      let rowIndex = e.target.getAttribute("data-pos");
      this.data.table.splice(rowIndex, 1);
      this._createTableData(true);
      this._createTable();
    };
    let addRowButtons = [
      ...this.actions.getElementsByClassName("table-add-row"),
    ];
    addRowButtons.forEach((e) => {
      e.onclick = addRow;
    });

    let deleteRowButtons = [
      ...this.actions.getElementsByClassName("table-delete-row"),
    ];
    deleteRowButtons.forEach((e) => {
      e.onclick = deleteRow;
    });

    const changeInput = (e) => {
      let pos = e.target.getAttribute("data-pos");
      let columnIndex = pos.split("-")[0];
      let rowIndex = pos.split("-")[1];
      this.data.table[columnIndex][rowIndex] = e.target.value;
      this._createTableData(true);
      this._createTable();
    };
    let inputs = [...this.actions.getElementsByClassName("table-row-input")];
    inputs.forEach((e) => (e.onchange = changeInput));
  }
}
 
