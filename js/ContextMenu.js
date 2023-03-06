const contextMenu = document.getElementById("context-menu");
const scope = document.querySelector("body");
let selectionRangeX = "";
let selectionRangeY = "";
let markedTextCount = 0;
let SelectionParentHtml = "";
scope.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  let e = window.event;
  if (e.button == 2) {
    console.log(e.pageX);
    console.log(e.pageY);
    let range = document.caretRangeFromPoint(e.pageX, e.pageY);
    let selection = window.getSelection();
    console.log(selection);
    let selectedText = "";
    if (selection) {
      selectedText = selection.toString();
    } else if (document.selection && document.selection.type != "Control") {
      selectedText = document.selection.createRange().text;
    }
    console.log(selectedText);
    let selectionParent = selection.anchorNode.parentElement;
    selectionRangeX = e.pageX;
    selectionRangeY = e.pageY;
    if(typeof selectedText !== "undefined" && selectedText !== ""){
      selection.removeAllRanges();
      selection.addRange(range);
      document.querySelector("#HighlightText").classList.remove("displayNoneMenuItem");
      document.querySelector("#ClearHighLight").classList.add("displayNoneMenuItem");
    }
    else{
      if (selectionParent.nodeName == "MARK") {
        document.querySelector("#ClearHighLight").classList.remove("displayNoneMenuItem");
        document.querySelector("#HighlightText").classList.add("displayNoneMenuItem");
      }
      else{
        document.querySelector("#HighlightText").classList.remove("displayNoneMenuItem");
        document.querySelector("#ClearHighLight").classList.add("displayNoneMenuItem");
        document.elementFromPoint(e.pageX, e.pageY).click();
      }
    }
    setKeepSelectionText();
  }

  const { offsetX: mouseX, offsetY: mouseY } = event;

  const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

  contextMenu.style.top = `${normalizedY}px`;
  contextMenu.style.left = `${normalizedX}px`;

  contextMenu.classList.remove("visible");

  setTimeout(() => {
    contextMenu.classList.add("visible");
  });
});

scope.addEventListener("click", (e) => {
  if (e.target.offsetParent != contextMenu) {
    contextMenu.classList.remove("visible");
  }
});

const normalizePozition = (mouseX, mouseY) => {
  // ? compute what is the mouse position relative to the container element (scope)
  const {
    left: scopeOffsetX,
    top: scopeOffsetY,
  } = scope.getBoundingClientRect();
  const scopeX = mouseX - scopeOffsetX;
  const scopeY = mouseY - scopeOffsetY;
  // ? check if the element will go out of bounds
  const outOfBoundsOnX =
    scopeX + contextMenu.clientWidth > scope.clientWidth;
  const outOfBoundsOnY =
    scopeY + contextMenu.clientHeight > scope.clientHeight;
  let normalizedX = mouseX;
  let normalizedY = mouseY;
  // ? normalzie on X
  if (outOfBoundsOnX) {
    normalizedX =
      scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
  }
  // ? normalize on Y
  if (outOfBoundsOnY) {
    normalizedY =
      scopeOffsetY + scope.clientHeight - contextMenu.clientHeight + 30;
  }
  return { normalizedX, normalizedY };
};
const setKeepSelectionText = () => {
  console.log(selectionRangeX);
  console.log(selectionRangeY);
  let range = document.caretRangeFromPoint(selectionRangeX, selectionRangeY);
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}
const getSelectedText = (actionToPerform = "") => {
  selectionBeforeClickOnContextMenu = window.getSelection();
  let selection = window.getSelection();
  // console.log(selection);
  let selectionParent = selection.anchorNode.parentElement;
  // console.log(selectionParent);
  if (selectionParent.nodeName == "MARK") {
    if(actionToPerform == "clearHighLight"){
      // selectionParent.remove();
      // selectionParent.parentNode = SelectionParentHtml;
      selectionParent.replaceWith(...selectionParent.childNodes);
      selection.removeAllRanges();
      contextMenu.classList.remove("visible");
    }
    return false;
  }
  else {
    let range = selection.getRangeAt(0);
    console.log(range);
    let cloneRangeContentsAndFragment = range.cloneContents();
    // console.log(cloneRangeContentsAndFragment);
    // console.log(cloneRangeContentsAndFragment.childNodes);
    let selectedTextIsValid = true;
    cloneRangeContentsAndFragment.childNodes.forEach((index, value) => {
      // console.log(value);
      // console.log(index);
      // console.log(cloneRangeContentsAndFragment.childNodes[value].nodeName)
      if (cloneRangeContentsAndFragment.childNodes[value].nodeName !== '#text') {
        selectedTextIsValid = false;
      }
    });
    if (selectedTextIsValid == true) {
      let node = selection.anchorNode;
      while (range.toString().indexOf(' ') != 0) {
        range.setStart(node, (range.startOffset - 1));
      }
      range.setStart(node, range.startOffset + 1);
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
      let selectedText = range.toString().trim();
      // console.log(selectedText);
      SelectionParentHtml = selectionParent.childNodes;
      // console.log(SelectionParentHtml)
      if (actionToPerform == "highlight") {
        let content = range.extractContents();
        let markElement = document.createElement('mark');
        markElement.appendChild(content);
        range.insertNode(markElement);
        markedTextCount++;
        markElement.setAttribute("id", "markElement" + markedTextCount);
        markElement.setAttribute("markElementNo", markedTextCount);
        // console.log(markElement.parentElement);
        // console.log(markElement.parentElement.innerHTML);
        selection.collapseToEnd();
        contextMenu.classList.remove("visible");
      }
    }
    else {
      console.log("selected range is not a text contains some other format data")
      return false;
    }
  }
}
document.querySelector(".textData").addEventListener("click", (e) => {
  console.log("called form 1")
  getSelectedText();
});
document.querySelector("#context-menu").addEventListener("click", (e) => {
  e.preventDefault();
});
document.querySelector("#HighlightText").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("called form 2")
  setKeepSelectionText();
  getSelectedText("highlight");
});
document.querySelector("#ClearHighLight").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("called form 3")
  setKeepSelectionText();
  getSelectedText("clearHighLight");
});