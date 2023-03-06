const contextMenu = document.getElementById("context-menu");
const scope = document.querySelector("body");
const clearHighLight = document.querySelector("#clearHighLight");
const createNote = document.querySelector("#createNote");
const highlightText = document.querySelector("#highlightText");
let selectionRangeX = "";
let selectionRangeY = "";
let markedTextCount = 0;
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
const makeSelection = (selection,actionToPerform = "") => {
    // console.log(createNewRange);
    // let initialSelection = window.getSelection();
    // console.log(selectionRangeX);
    // console.log(selectionRangeY);
    // var oldRange = document.caretRangeFromPoint(selectionRangeX, selectionRangeY);
    // let selectionParent = initialSelection.anchorNode.parentElement;
    // console.log(selectionParent);
    // let selectedText = "";
    // if (initialSelection) {
    //     selectedText = initialSelection.toString();
    // } 
    // else if (document.selection && document.selection.type != "Control") {
    //     selectedText = document.selection.createRange().text;
    // }
    // console.log(selectedText);
    // if(selectionParent.nodeName == "MARK"){
    //     createNewRange = false;
    //     if(selectionParent.nodeName == "MARK"){
    //         clearHighLight.classList.remove("displayNoneMenuItem");
    //         highlightText.classList.add("displayNoneMenuItem");
    //     }
    // }
    // else if(createNewRange !== false){
    //     createNewRange = true;
    //     highlightText.classList.remove("displayNoneMenuItem");
    //     clearHighLight.classList.add("displayNoneMenuItem");
    // }
    // console.log(createNewRange);
    // console.log(selectionRangeX);
    // console.log(selectionRangeY);
    // if(createNewRange === false){
    //     console.log("con 1");
    //     initialSelection.removeAllRanges();
    //     initialSelection.addRange(oldRange);
    // }
    // else{
    //     console.log("con 2");

    //     selectionRangeX = eventPerformed.pageX;
    //     selectionRangeY = eventPerformed.pageY;
    // }
    
    // let selection = window.getSelection();
    let newRange = selection.getRangeAt(0);
    let rangeBoundaries = newRange.getBoundingClientRect();
    console.log(newRange);
    console.log(actionToPerform);
    if(actionToPerform == ""){
        selectionRangeX = rangeBoundaries.x;
        selectionRangeY = rangeBoundaries.y + 16;
    }
    console.log(window.event.pageX)
    console.log(window.event.pageY)
    console.log(selectionRangeX);
    console.log(selectionRangeY);
    if (selection) {
        selectedText = selection.toString();
      } else if (document.selection && document.selection.type != "Control") {
        selectedText = document.selection.createRange().text;
      }
    console.log(selectedText);  
    var node = selection.anchorNode;
    while(newRange.toString().indexOf(' ') != 0) {                 
        newRange.setStart(node,(newRange.startOffset - 1));
    }
    newRange.setStart(node, newRange.startOffset + 1);
    do{
        newRange.setEnd(node,newRange.endOffset + 1);
    }while(newRange.toString().indexOf(' ') == -1 && newRange.toString().trim() != '');
    return newRange;
}
const showContextMenu = (menuType = "") => {
    if(menuType == "withClear"){
        clearHighLight.classList.remove("displayNoneMenuItem");
        highlightText.classList.add("displayNoneMenuItem");
    }
    else{
        clearHighLight.classList.add("displayNoneMenuItem");
        highlightText.classList.remove("displayNoneMenuItem");   
    }
    const { offsetX: mouseX, offsetY: mouseY } = event;
    const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);
    contextMenu.style.top = `${normalizedY}px`;
    contextMenu.style.left = `${normalizedX}px`;
    contextMenu.classList.remove("visible");
    setTimeout(() => {
        contextMenu.classList.add("visible");
    });
}
const performActionAccordingToClick = (eventPerformed = "",actionToPerform = "") => {
    let initialSelection = window.getSelection();
    let oldRange = document.caretRangeFromPoint(selectionRangeX, selectionRangeY);
    if (actionToPerform !== "highlight") {
        initialSelection.removeAllRanges();
        initialSelection.addRange(oldRange);
    }
    let selection = window.getSelection();
    let selectionParent = selection.anchorNode.parentElement;
    var rangeReturned = makeSelection(selection,actionToPerform);

    if (selectionParent.nodeName !== "MARK" && actionToPerform !== "clearHighlight") {
        var rangeReturned = makeSelection(selection,actionToPerform);
    }
    if(eventPerformed.button === 2){
        console.log("right click");
        const { offsetX: mouseX, offsetY: mouseY } = event;
        const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);
        contextMenu.style.top = `${normalizedY}px`;
        contextMenu.style.left = `${normalizedX}px`;
        contextMenu.classList.remove("visible");
        setTimeout(() => {
            contextMenu.classList.add("visible");
        });
    }
    else{
        if (actionToPerform == "highlight") {
            let content = rangeReturned.extractContents();
            let markElement = document.createElement('mark');
            markElement.appendChild(content);
            rangeReturned.insertNode(markElement);
            markedTextCount++;
            markElement.setAttribute("id", "markElement" + markedTextCount);
            markElement.setAttribute("markElementNo", markedTextCount);
            window.getSelection().collapseToEnd();
            contextMenu.classList.remove("visible");
        }
        if(actionToPerform == "clearHighlight"){
            selectionParent.replaceWith(...selectionParent.childNodes);
            selection.removeAllRanges();
            contextMenu.classList.remove("visible");
        }
    }
}
scope.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    let initialSelection = window.getSelection();
    // console.log(selectionRangeX);
    // console.log(selectionRangeY);
    let selectionParent = initialSelection.anchorNode.parentElement;
    if(selectionParent.nodeName == "MARK"){
        // createNewRange = false;
        showContextMenu("withClear");
        // makeSelection(initialSelection,"showClearMenu");
    }
    else{
        showContextMenu();
        makeSelection(initialSelection);
    }
    // eventPerformed = window.event;
    // performActionAccordingToClick(eventPerformed);
});
highlightText.addEventListener("click", (event) => {
    event.preventDefault();
    // eventPerformed = window.event;
    performActionAccordingToClick("","highlight");
})
clearHighLight.addEventListener("click", (event) => {
    event.preventDefault();
    // eventPerformed = window.event;
    performActionAccordingToClick("","clearHighlight");
})
scope.addEventListener("click", (e) => {
    if (e.target.offsetParent != contextMenu) {
      contextMenu.classList.remove("visible");
    }
});
document.querySelector("#context-menu").addEventListener("click", (e) => {
    e.preventDefault();
});