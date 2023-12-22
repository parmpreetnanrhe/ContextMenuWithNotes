Custom Context Menu With Note Add Functionality

Using this code you can add custom context menu to your site and allow user to add notes to the selected text. 

Place the Context menu html in your html code.
``` html
<div id="customContextMenu" class="customContextMenu">
        <div class="item" id="highlightSelectedText">Highlight Text</div>
        <div class="item" id="createCustomNote">Add Note</div>
        <div class="item" id="viewCustomNote">View/Edit Note</div>
        <div class="item displayNoneMenuItem" id="clearHighOrNoteLight">Clear</div>
</div>
```

Place the below mentioned validation classes in to your html code.
``` html
<div id="invalidSelectionMessage" class="invalidSelectionMessage">
    Invalid Selection! Please limit your selection to the student response and avoid any overlaps.
</div>
<div id="pleaseSaveNoteFirst" class="pleaseSaveNoteFirst">
    Please save the note.
</div>
```

This the Html to of sticy note box. Add this as well into you html code.
``` html
<div class="customStickyNotesHidden">
    <div class="noteBox">
        <header class="noteHeader">
            <span class="noteHeaderText">Note</span><span class="noteCrossIcon saveNote">Save</span>
        </header>
        <div class="textarea" contenteditable>
        </div>
    </div>
</div>
````

This is how you have to apply class and id on paragraph or text on which you want this functionality to work. Context meny will only apply to the text with in the boxt with class name **customMenuEnabled**. Weather you have a one or more paragraphs along with class name you add id to each paragraph like **customContextMenuText1...so on**. On rest of the parts native browser conetxt menu will appear.

``` html
<div class="customMenuEnabled" id="customContextMenuText1" customcontextmenutextno="1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales augue neque, eu egestas urna dignissim iaculis. Vestibulum interdum pretium enim, vel eleifend tellus semper bibendum. Vivamus finibus molestie sapien et tristique. Duis quis sapien ut nisl elementum convallis. Pellentesque euismod tincidunt vestibulum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis pellentesque eleifend erat, a posuere ex tincidunt non. Maecenas euismod scelerisque diam, quis bibendum lacus ultrices accumsan. Aenean blandit tincidunt neque, sit amet scelerisque erat ultrices vel. Integer pharetra purus quis varius commodo. Curabitur eu cursus mi. Donec sem justo, eleifend luctus gravida at, posuere a lacus. Integer faucibus nisl ex, ac dignissim neque ornare ut. Sed massa quam, imperdiet at justo ut, bibendum porta lorem. Integer erat erat, blandit non metus vitae, cursus bibendum ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
</div>
```

Along with this html include the js and css files attached with the code into you code. Now you are ready to use the functionality. 

This code comes with all type of required validations.

1. Context menu will only appaers if the user selects the text first and then right click on it does not appear just on right clcik.
2. If User click on add note after selecting the text and opening the conext menu to add note to to a selected word or paragraph. User cannot be able to perform any action until he click on save button. For example user selected this line from the above mentioned paragraph (Duis quis sapien ut nisl elementum convallis) and add a note to that line the line get highlighted in yellow color and a note box will open. Now user canot be able to perform further actions until save the note. Please save the note notification will appear below the note. User will be automatically redirected to that notification.
3. The user is not allowed to select the same line again In any other selection. For example user selected this line from the above mentioned paragraph (Duis quis sapien ut nisl elementum convallis) and add a note to this line. Now if user try to select the line with smae line repeating for example, (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales augue neque, eu egestas urna dignissim iaculis. Vestibulum interdum pretium enim, vel eleifend tellus semper bibendum. Vivamus finibus molestie sapien et tristique. Duis quis sapien ut nisl elementum convalli) this line. Now if user right clcik on the already highlighted text form the selection which is (Duis quis sapien ut nisl elementum convallis) then will get a context menu with View/Edit and Clear option. But if user try to add note to whole line which is  (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales augue neque, eu egestas urna dignissim iaculis. Vestibulum interdum pretium enim, vel eleifend tellus semper bibendum. Vivamus finibus molestie sapien et tristique. Duis quis sapien ut nisl elementum convalli) by right clicking on any text except the alredy selected one will get a invalid selection error as user is trying to select text containign already highlighted text. Now If user try to add note to only this part (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sodales augue neque, eu egestas urna dignissim iaculis. Vestibulum interdum pretium enim, vel eleifend tellus semper bibendum. Vivamus finibus molestie sapien et tristique) will be allowed to add note.
4. Similar error will appear if the user will try to select and add note to text form two different paragraphs with two different ids like  **customContextMenuText1** or  **customContextMenuText2**

Rest this project is open you can add your own inputs into it in order to improve it further.

Thanks,
Parmpreet Singh
