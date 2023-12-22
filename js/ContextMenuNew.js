const invalidSelectionMessage = document.querySelector("#invalidSelectionMessage");
const pleaseSaveNoteFirst = document.querySelector("#pleaseSaveNoteFirst");
const contextMenu = document.getElementById("customContextMenu");
const customMenuEnabledElements = document.querySelectorAll(".customMenuEnabled");
const customStickyNoteElement = document.querySelectorAll(".customStickyNote");
const bodyElementSelected = document.querySelector("body");
const clearHighOrNoteLight = document.querySelector("#clearHighOrNoteLight");
const createCustomNote = document.querySelector("#createCustomNote");
const viewCustomNote = document.querySelector("#viewCustomNote");
const highlightSelectedText = document.querySelector("#highlightSelectedText");
let selectionRangeX = "";
let selectionRangeY = "";
let markedTextCount = 0;
function getOpenNotesCount() {
    let openNoteData = {};
    let openNotesCount = 0;
    if (document.querySelector(".customStickyNote")) {
        document.querySelectorAll(".customStickyNote").forEach((element) => {
            if (element.style.display == "block") {
                element.appendChild(pleaseSaveNoteFirst);
                openNoteData['element'] = element.getAttribute("id");
                openNotesCount++;
            }
        })
    }
    openNoteData['count'] = openNotesCount;
    return openNoteData;
}
function showSaveNoteMessage(openNoteData) {
    console.log(openNoteData)
    document.querySelector("#" + openNoteData.element).scrollIntoView();
    pleaseSaveNoteFirst.style.display = "block";
    setTimeout(() => {
        pleaseSaveNoteFirst.style.display = "none";
        bodyElementSelected.appendChild(pleaseSaveNoteFirst);
    }, 3000);
}
if (document.querySelector('.highlightSelectedText')) {
    document.querySelectorAll('.highlightSelectedText').forEach(function (element) {
        let tno = parseInt(element.getAttribute('highlightselectedtexttno'), 10);
        if (tno > markedTextCount) {
            markedTextCount = tno;
        }
    });
}
if (customStickyNoteElement) {
    customStickyNoteElement.forEach(function (element) {
        element.querySelector(".noteCrossIcon").setAttribute("class", element.querySelector(".noteCrossIcon").getAttribute("class") + " saveNote");
        element.style.display = "none";
        if (typeof viewOnly !== "undefined" && viewOnly == 1) {
            element.querySelector(".noteCrossIcon").innerHTML = "x";
            element.querySelector(".textarea").removeAttribute("contenteditable");
        }
    });
}
if (document.querySelectorAll(".strickyNotes")) {
    document.querySelectorAll(".strickyNotes").forEach(function (element) {
        if (!element.classList.contains("customStickyNote")) {
            element.style.display = "none";
            element.querySelector(".mainText").removeAttribute("contenteditable");
        }
    });
}
let spanElementCount = 0;
let rangeSelectedByUser = {};
let alreadyHighlightedText = [];
let childNodeHtml = {};
const makeSelection = (selection, actionToPerform = "") => {
    var parentNode = selection.focusNode.parentNode;
    // Create a new range object
    // Set the range to contain the parent node and its contents
    let newRange = selection.getRangeAt(0);
    let rangeBoundaries = newRange.getBoundingClientRect();
    if (actionToPerform == "") {
        selectionRangeX = rangeBoundaries.x;
        selectionRangeY = rangeBoundaries.y + 20;
    }
    if (selection) {
        selectedText = selection.toString();
    } else if (document.selection && document.selection.type != "Control") {
        selectedText = document.selection.createRange().text;
    }
    var node = selection.anchorNode;
    newRange.setStart(node, newRange.startOffset);
    return newRange;
}

const hideInvalidSelectionMessage = (e) => {
    invalidSelectionMessage.style.display = "none";
    bodyElementSelected.appendChild(invalidSelectionMessage);
}

const hideCustomStickyNote = (markedTextCount, customStickyNoteId) => {
    const customStickyNoteElement = document.querySelector("#" + customStickyNoteId);
    customStickyNoteElement.style.display = "none";
    pleaseSaveNoteFirst.style.display = "none";
    bodyElementSelected.appendChild(pleaseSaveNoteFirst);
    customContextMenuTextElement = customStickyNoteElement.closest(".customMenuEnabled");
}
const showCustomStickyNote = (markedTextCount, customStickyNoteId) => {
    document.querySelector("#" + customStickyNoteId).style.display = "block";
    const highlightSelectedTextId = "highlightSelectedText" + markedTextCount;
    const highlightSelectedText = document.querySelector("#" + highlightSelectedTextId);
    highlightSelectedText.style.cursor = "unset"
    highlightSelectedText.removeAttribute("title");
    setTimeout(() => {
        highlightSelectedText.removeAttribute("onclick")
    }, 300);
}
const normalizePozition = (params) => {
    const { screenPositionFromXAxis, screenPositionFromYAxis, customContextMenuTextElement, elementToNormalize } = params;
    // ? compute what is the mouse position relative to the container element (customMenuEnabledElement)
    const {
        left: customMenuEnabledElementOffsetX,
        top: customMenuEnabledElementOffsetY,
    } = customContextMenuTextElement.getBoundingClientRect();
    const customMenuEnabledElementX = screenPositionFromXAxis - customMenuEnabledElementOffsetX;
    const customMenuEnabledElementY = screenPositionFromYAxis - customMenuEnabledElementOffsetY;
    // ? check if the element will go out of bounds
    const outOfBoundsOnX =
        customMenuEnabledElementX + elementToNormalize.clientWidth > customContextMenuTextElement.clientWidth;
    const outOfBoundsOnY =
        customMenuEnabledElementY + elementToNormalize.clientHeight > customContextMenuTextElement.clientHeight;
    let normalizedScreenPositionFromXAxis = screenPositionFromXAxis;
    let normalizedScreenPositionFromYAxis = screenPositionFromYAxis;
    // ? normalzie on X
    if (outOfBoundsOnX) {
        normalizedScreenPositionFromXAxis =
            customMenuEnabledElementOffsetX + customContextMenuTextElement.clientWidth - elementToNormalize.clientWidth;
    }
    // ? normalize on Y
    if (outOfBoundsOnY) {
        normalizedScreenPositionFromYAxis =
            customMenuEnabledElementOffsetY + customContextMenuTextElement.clientHeight - elementToNormalize.clientHeight + 30;
    }
    return { normalizedScreenPositionFromXAxis, normalizedScreenPositionFromYAxis };
};
// let rangeReturned = "";
const performActionAccordingToClick = (e, params) => {
    const { actionToPerform } = params;
    const customContextMenuTextId = contextMenu.getAttribute("customcontextmenuparentid");
    const screenPositionFromXAxis = contextMenu.getAttribute("leftx");
    const screenPositionFromYAxis = contextMenu.getAttribute("topy");
    const customContextMenuTextElement = document.getElementById(customContextMenuTextId);
    if (actionToPerform == "highlight" || actionToPerform == "createCustomNote") {
        markedTextCount++;
        const highlightSelectedTextClass = "highlightSelectedText";
        const highlightSelectedTextId = highlightSelectedTextClass + markedTextCount;
        const highlightSelectedTextNo = markedTextCount;
        const content = rangeSelectedByUser.extractContents();
        const highlightSelectedText = document.createElement('mark');
        highlightSelectedText.appendChild(content);
        rangeSelectedByUser.insertNode(highlightSelectedText);
        highlightSelectedText.setAttribute("class", highlightSelectedTextClass + " infofocus");
        highlightSelectedText.setAttribute("id", highlightSelectedTextId);
        highlightSelectedText.setAttribute("highlightselectedtexttno", highlightSelectedTextNo);
        highlightSelectedText.setAttribute("data-info-focus", highlightSelectedTextId);
        highlightSelectedText.setAttribute("data-qstno", (customContextMenuTextElement.getAttribute("data-qstno")) ? customContextMenuTextElement.getAttribute("data-qstno") : 0);
        highlightSelectedText.setAttribute("leftx", screenPositionFromXAxis);
        highlightSelectedText.setAttribute("topy", screenPositionFromYAxis);
        highlightSelectedText.setAttribute("note-no", highlightSelectedTextNo);
        if (document.getElementById(highlightSelectedTextId).querySelector(".highlightSelectedText") && customContextMenuTextElement.querySelector(".highlightSelectedText")) {
            if (document.getElementById(highlightSelectedTextId).querySelector(".highlightSelectedText")) {
                document.getElementById(highlightSelectedTextId).querySelectorAll(".highlightSelectedText").forEach((element, key) => {
                    element.classList.add("innerSelectedOptions")
                })
            }
            customContextMenuTextElement.querySelectorAll(".highlightSelectedText").forEach((element) => {
                if (!element.classList.contains("innerSelectedOptions") && element != document.getElementById(highlightSelectedTextId)) {
                    if (element.querySelector("#customStickyNote" + element.getAttribute("highlightselectedtexttno"))) {
                        childNodeHtml[element.getAttribute("id")] = element.querySelector("#customStickyNote" + element.getAttribute("highlightselectedtexttno"));
                        element.querySelector("#customStickyNote" + element.getAttribute("highlightselectedtexttno")).remove();
                    }
                    element.remove();
                }
            })
            if (childNodeHtml !== null && childNodeHtml !== "" && Object.entries(childNodeHtml).length > 0) {
                Object.entries(childNodeHtml).forEach((element, key) => {
                    if (!document.getElementById(element[0]).querySelector("#customStickyNote" + document.getElementById(element[0]).getAttribute("highlightselectedtexttno"))) {
                        document.getElementById(element[0]).innerHTML = document.getElementById(element[0]).innerHTML + element[1].outerHTML;
                    }
                })
            }
        }

        if (actionToPerform == "createCustomNote") {
            const customStickyNoteNo = highlightSelectedTextNo;
            const customStickyNoteClass = "customStickyNote";
            const customStickyNoteId = customStickyNoteClass + customStickyNoteNo;
            const customStickyNote = document.createElement('div');
            customStickyNote.setAttribute("id", customStickyNoteId);
            customStickyNote.setAttribute("class", customStickyNoteClass + " strickyNotes " + customStickyNoteId);
            customStickyNote.setAttribute("customstickynoteno", customStickyNoteNo);
            highlightSelectedText.setAttribute("data-note-class", customStickyNoteId);
            customStickyNote.innerHTML = document.querySelector(".customStickyNotesHidden").innerHTML;
            customStickyNote.querySelector(".noteCrossIcon").setAttribute("onclick", "hideCustomStickyNote(" + customStickyNoteNo + ",'" + customStickyNoteId + "')");
            highlightSelectedText.appendChild(customStickyNote);
            customStickyNote.style.display = "block";
            customStickyNote.style.top = `${screenPositionFromYAxis}px`;
            customStickyNote.style.left = `${screenPositionFromXAxis}px`;
        }
        bodyElementSelected.appendChild(contextMenu);
        const currentSelectionText = document.querySelector("#" + highlightSelectedTextId).innerText.split("\n");
        currentSelectionText.splice(-2);
        alreadyHighlightedText.push(currentSelectionText[0])
        window.getSelection().collapseToEnd();
        hideCustomContextMenu(e);
    }
    if (actionToPerform == "viewCustomNote") {
        bodyElementSelected.appendChild(contextMenu);
        const highlightSelectedTextId = contextMenu.getAttribute("highlightselectedtexttid");
        const highlightSelectedTextNo = contextMenu.getAttribute("highlightselectedtexttno");
        const noteToOpen = document.getElementById(highlightSelectedTextId).querySelector("#customStickyNote" + highlightSelectedTextNo);
        noteToOpen.style.display = "block";
        noteToOpen.style.top = `${screenPositionFromYAxis}px`;
        noteToOpen.style.left = `${screenPositionFromXAxis}px`;
        hideCustomContextMenu(e);
    }
    if (actionToPerform == "clearHighlight") {
        bodyElementSelected.appendChild(contextMenu);
        const highlightSelectedTextId = contextMenu.getAttribute("highlightselectedtexttid");
        const highlightSelectedTextNo = contextMenu.getAttribute("highlightselectedtexttno");
        document.getElementById(highlightSelectedTextId).querySelector("#customStickyNote" + highlightSelectedTextNo).remove();
        let replacebleElementNo = 0;
        let replacebleElementNo1 = 0;
        const replacableElements = [];
        const replacableElements1 = [];
        if (document.getElementById(highlightSelectedTextId).querySelector(".highlightSelectedText")) {
            document.getElementById(highlightSelectedTextId).querySelectorAll(".highlightSelectedText").forEach((element) => {
                replacebleElementNo++;
                replacableElements[replacebleElementNo] = element;
                element.replaceWith(document.createTextNode("replacableElements" + replacebleElementNo));
            })
            customContextMenuTextElement.innerHTML = customContextMenuTextElement.innerHTML;
        }
        if (document.getElementById(highlightSelectedTextId).querySelector("br")) {
            document.getElementById(highlightSelectedTextId).querySelectorAll("br").forEach((element) => {
                replacebleElementNo1++;
                replacableElements1[replacebleElementNo1] = element;
                element.replaceWith(document.createTextNode("replacableElementsBr" + replacebleElementNo1));
            })
            customContextMenuTextElement.innerHTML = customContextMenuTextElement.innerHTML;
        }
        document.getElementById(highlightSelectedTextId).replaceWith(document.createTextNode(document.getElementById(highlightSelectedTextId).innerText));
        if (replacableElements.length > 0) {
            replacableElements.forEach((element, key) => {
                customContextMenuTextElement.innerHTML = customContextMenuTextElement.innerHTML.replace("replacableElements" + (key), element.outerHTML);
            })
        }
        if (replacableElements1.length > 0) {
            replacableElements1.forEach((element, key) => {
                customContextMenuTextElement.innerHTML = customContextMenuTextElement.innerHTML.replace("replacableElementsBr" + (key), element.outerHTML);
            })
        }
        customContextMenuTextElement.innerHTML = customContextMenuTextElement.innerHTML;
        hideCustomContextMenu(e);
    }
}

const hideCustomContextMenu = (e) => {
    contextMenu.classList.remove("visible");
    contextMenu.removeAttribute("style");
    contextMenu.removeAttribute("topy");
    contextMenu.removeAttribute("leftx");
    contextMenu.removeAttribute("customcontextmenuparentid");
    contextMenu.removeAttribute("customcontextmenuparentno");
    contextMenu.removeAttribute("highlightselectedtexttid");
    contextMenu.removeAttribute("highlightselectedtexttno");
}

const callHideCustomContextMenu = (e) => {
    if (e.target.offsetParent != contextMenu) {
        rangeSelectedByUser = {};
        hideCustomContextMenu(e);
        bodyElementSelected.appendChild(contextMenu);
    }
}

const hideCustomStickyNotes = (e) => {
    if (e.target.matches(".textarea") || e.target.matches(".noteHeader") || e.target.matches(".noteHeaderText")) {
        return;
    }
    else {
        if (typeof e.target !== "undefined" && e.target !== null && typeof e.target.offsetParent !== "undefined" && e.target.offsetParent !== null && typeof e.target.classList !== "undefined" && e.target.classList !== null && !e.target.classList.contains("highlightSelectedText") && !e.target.offsetParent.classList.contains("customStickyNote") && e.target.offsetParent != contextMenu) {
            let openNoteData = getOpenNotesCount();
            if (openNoteData.count > 0) {
                showSaveNoteMessage(openNoteData)
            }
            return;
        }
        if (e.target.classList.contains("highlightSelectedText")) {
            let openNoteData = getOpenNotesCount();
            if (openNoteData.count > 0) {
                showSaveNoteMessage(openNoteData)
            }
            return;
        }
    }
}
const showCustomContextMenu = (e, params) => {
    const { selectionParent, menuType, customContextMenuTextNo, customContextMenuTextId } = params;
    if (menuType == "withClear") {
        clearHighOrNoteLight.classList.remove("displayNoneMenuItem");
        highlightSelectedText.classList.add("displayNoneMenuItem");
        createCustomNote.classList.add("displayNoneMenuItem");
        viewCustomNote.classList.remove("displayNoneMenuItem");
    }
    else if (menuType == "onlyClear") {
        clearHighOrNoteLight.classList.remove("displayNoneMenuItem");
        createCustomNote.classList.add("displayNoneMenuItem");
        highlightSelectedText.classList.add("displayNoneMenuItem");
        viewCustomNote.classList.add("displayNoneMenuItem");
    }
    else if (menuType == "onlyCreateNotes") {
        createCustomNote.classList.remove("displayNoneMenuItem");
        clearHighOrNoteLight.classList.add("displayNoneMenuItem");
        highlightSelectedText.classList.add("displayNoneMenuItem");
        viewCustomNote.classList.add("displayNoneMenuItem");
    }
    else {
        createCustomNote.classList.remove("displayNoneMenuItem");
        clearHighOrNoteLight.classList.add("displayNoneMenuItem");
        highlightSelectedText.classList.remove("displayNoneMenuItem");
        viewCustomNote.classList.add("displayNoneMenuItem");
    }
    let { offsetX: screenPositionFromXAxis, offsetY: screenPositionFromYAxis } = e;
    if (selectionParent.classList.contains("highlightSelectedText")) {
        let highlightOffsetY = selectionParent.offsetTop;
        screenPositionFromYAxis = highlightOffsetY + selectionParent.offsetHeight;
    }
    contextMenu.style.top = `${screenPositionFromYAxis}px`;
    contextMenu.style.left = `${screenPositionFromXAxis}px`;
    contextMenu.setAttribute("topy", screenPositionFromYAxis);
    contextMenu.setAttribute("leftx", screenPositionFromXAxis);
    if (selectionParent) {
        const selectionParentId = selectionParent.getAttribute("id");
        contextMenu.setAttribute("customcontextmenuparentid", customContextMenuTextId);
        contextMenu.setAttribute("customcontextmenuparentno", customContextMenuTextNo);
        let highlightSelectedTextNo = selectionParent.getAttribute("highlightselectedtexttno");
        highlightSelectedTextNo = (highlightSelectedTextNo == null) ? 0 : highlightSelectedTextNo;
        if (highlightSelectedTextNo > 0) {
            contextMenu.setAttribute("highlightselectedtexttid", selectionParentId);
            contextMenu.setAttribute("highlightselectedtexttno", highlightSelectedTextNo);
        }
    }
    setTimeout(() => {
        contextMenu.classList.add("visible");
    });
}
const handleCustomContextMenu = (e, params) => {
    e.preventDefault();
    if (e.target.matches(".textarea") || e.target.matches(".noteHeader") || e.target.matches(".noteHeaderText")) {
        return;
    }
    let openNoteData = getOpenNotesCount();
    if (openNoteData.count > 0) {
        showSaveNoteMessage(openNoteData)
        return;
    }
    const { customContextMenuTextId } = params
    const customContextMenuTextElement = document.getElementById(customContextMenuTextId);
    customContextMenuTextElement.appendChild(contextMenu);
    customContextMenuTextElement.appendChild(invalidSelectionMessage);
    const initialSelection = window.getSelection();
    let selectionParent = initialSelection.anchorNode.parentElement;
    var range = initialSelection.getRangeAt(0);
    var docFragment = range.cloneContents();
    parentEl = range.commonAncestorContainer;
    let selectionParentClasses = [];
    if (initialSelection.rangeCount) {
        if (parentEl.nodeType != 1) {
            parentEl = parentEl.parentNode;
            selectionParentClasses = parentEl.className.split(" ");
        }
    }
    let searchPhrase = "Total Words";
    let containsTotalWords = initialSelection.toString().toLowerCase().includes(searchPhrase.toLowerCase());
    // Check if there are any <p> tags in the document fragment
    if ((docFragment.querySelector("mark") && !selectionParentClasses.includes("highlightSelectedText") && !e.target.matches(".highlightSelectedText")) || containsTotalWords || docFragment.querySelector(".customContextMenu") || docFragment.querySelector("td") || docFragment.querySelector(".stickyContent")) {
        noOfhighlightedTextFound = docFragment.querySelectorAll("mark").length;
        const { offsetX: screenPositionFromXAxis, offsetY: screenPositionFromYAxis } = e;
        invalidSelectionMessage.style.top = `${screenPositionFromYAxis}px`;
        invalidSelectionMessage.style.left = `${screenPositionFromXAxis}px`;
        invalidSelectionMessage.style.display = "block";
        invalidSelectionMessage.style.transform = "0"
        callHideCustomContextMenu(e);
        window.getSelection().collapseToEnd();
        return;
    }
    else if ((selectionParent.nodeName == "MARK" && (alreadyHighlightedText.includes(initialSelection.toString())) || e.target.matches(".highlightSelectedText") || selectionParentClasses.includes("highlightSelectedText"))) {
        hideInvalidSelectionMessage(e);
        let menuType = "withClear";
        selectionParent = (selectionParentClasses.includes("highlightSelectedText") ? document.getElementById(parentEl.getAttribute("id")) : (e.target.matches(".highlightSelectedText") ? document.getElementById(e.target.getAttribute("id")) : selectionParent));
        showCustomContextMenu(e, { selectionParent, menuType, customContextMenuTextElement, ...params });
        return;
    }
    else {
        const rangeReturned = makeSelection(initialSelection);
        const content = initialSelection.toString();
        if (content !== "") {
            rangeSelectedByUser = rangeReturned;
            let menuType = "onlyCreateNotes";
            hideInvalidSelectionMessage(e);
            showCustomContextMenu(e, { selectionParent, menuType, customContextMenuTextElement, ...params });
        }
        else {
            hideInvalidSelectionMessage(e);
            callHideCustomContextMenu(e);
        }
        return;
    }
};
customMenuEnabledElements.forEach(function (element, key) {
    const customContextMenuTextNo = (key + 1);
    const customContextMenuTextId = "customContextMenuText" + customContextMenuTextNo;
    element.setAttribute("id", customContextMenuTextId);
    element.setAttribute("customcontextmenutextno", customContextMenuTextNo);
    element.addEventListener("contextmenu", (e) => handleCustomContextMenu(e, { customContextMenuTextNo, customContextMenuTextId }), false);
});

highlightSelectedText.addEventListener("click", (e) => {
    e.preventDefault();
    // eventPerformed = window.event;
    const actionToPerform = "highlight";
    performActionAccordingToClick(e, { actionToPerform });
})
clearHighOrNoteLight.addEventListener("click", (e) => {
    e.preventDefault();
    // eventPerformed = window.event;
    const actionToPerform = "clearHighlight";
    performActionAccordingToClick(e, { actionToPerform });
})
createCustomNote.addEventListener("click", (e) => {
    e.preventDefault();
    // eventPerformed = window.event;
    const actionToPerform = "createCustomNote";
    performActionAccordingToClick(e, { actionToPerform });
})
viewCustomNote.addEventListener("click", (e) => {
    e.preventDefault();
    const actionToPerform = "viewCustomNote";
    performActionAccordingToClick(e, { actionToPerform });
})
bodyElementSelected.addEventListener("click", (e) => {
    callHideCustomContextMenu(e);
    if (invalidSelectionMessage.style.display == "block" && !e.target.matches(".invalidSelectionMessage")) {
        hideInvalidSelectionMessage(e);
    }
    hideCustomStickyNotes(e);
});
contextMenu.addEventListener("click", (e) => {
    e.preventDefault();
});