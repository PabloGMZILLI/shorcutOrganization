var session = localStorage.getItem('saveShortcuts') || []
var sessionParsed = []

if (session.length > 0 ) { // transform session to object
    sessionParsed = JSON.parse(session)
    importShortcuts(sessionParsed)
}

// Retrieve the object from storage
function importShortcuts (data) {
    let allNames = []
    let allUrls = []
    for (let i=0; i < data.length; i++){
        allNames = []
        allUrls = []
        for (let b=0; b < data[i].folderContent.length; b++){
            allNames.push(data[i].folderContent[b].urlName)
            allUrls.push(data[i].folderContent[b].url)
        }
        appendDiv(data[i].folderName, allNames, allUrls)
        
    }

    saveSession()
}

{/* <input class="input input-main" placeholder="Folder Name">
<input class="input input-name input-secondary" placeholder="Page Name">
<input class="input input-url input-secondary orig" placeholder="Page Link">    */}
function saveSession (folderName, allNames, allUrls) {
    folderName ? folderName : folderName = $( ".foldername" ).map(function(){return this.innerText})
    allNames ? allNames : allNames = $( ".shortcutContentLink" ).map(function(){return this.innerText})
    allUrls ? allUrls :  allUrls = $( ".shortcutContentLink" ).map(function(){return this.href})
    let contentObjects = []

console.log('======>>> folderName: ', folderName)
    console.log('======>>> allNames: ', allNames)
    console.log('======>>> allUrls: ', allUrls)
    for (let i=0; i < allNames.length; i++){
        contentObjects.push({"url" : allUrls[i], "urlName": allNames[i]})
    }   
    sessionParsed.push({ "folderName": folderName, "folderContent": contentObjects })

    // save json in local storage
    localStorage.setItem('saveShortcuts', JSON.stringify(sessionParsed))
}

function exportToJsonFile() {

    let dataStr = JSON.stringify(sessionParsed);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'shortcuts.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();

}

function appendDiv (folderName, contentNamesArray, contentUrlsArray)   {
    let contentConstructor = []
    for (let i=0; i < contentNamesArray.length; i++){
        contentConstructor = contentConstructor + `<a target="_blank" class="shortcutContentLink" href="${contentUrlsArray[i]}">${ contentNamesArray[i]}</a>`
    }

    $(
        `<div class="userShortcut">
            <button class="dropbtn foldername">${folderName}</button>
            <div class="shortcut-content" id="shortcutDropdown">
                ${contentConstructor}
            </div>
        </div>`).insertBefore($('.newShortcutFolder'))
}

function saveNewShortcut () {
    let folderName = $(".input-main")[0].value
    let allNames = $( ".input-name" ).map(function(){return this.value})
    let allUrls = $( ".input-url" ).map(function(){return this.value})

    appendDiv(folderName, allNames, allUrls)
    saveSession(folderName, allNames, allUrls)

    // adjust buttons in layout
    $('.inputsAdded').remove();
    $('input').map(function(){ this.value = "" })
    $('.add-shortcut-folder-content').removeClass('show');
    $('.btn-save').removeClass('show');
    $('.btn-more').remove()
    $('.btn-new')[0].innerText = '+'

}

function toggleShortcutOptions() {
    this.nextElementSibling.classList.toggle('show');
}

$('.btn-new').on('click', toggleOptions);
function createNewButton () {
    $('<button class="btn btn-more" onclick="createNewLink()">+</button>').insertAfter( ".btn-new" )
}

function toggleOptions() {
    $('.add-shortcut-folder-content')[0].classList.toggle('show');
    $('.btn-save')[0].classList.toggle('show');

    // let allInputs = $( "input" ).map(function(){return this.value})
    createNewButton();
    if (this.previousElementSibling.classList.contains("show")){
        this.innerText = "-"
    } else {
        $('.btn-more').remove()
        this.innerText = "+"
    }
}

function createNewLink () {
    $('.add-shortcut-folder-content').append(
        `<div class="inputsAdded">
            <input class="input input-name input-secondary" placeholder="Page Name">
            <input class="input input-url input-added" placeholder="Page Link">
            <button class="btn button-rm">-</buton>
        </div>`
    )
}
function removeLinksAdded () {
    $(this).parent().remove(); 
}

window.onload = function () {
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelected = $('#filetoread')[0];
        fileSelected.addEventListener('change', function (e) {
            var fileExtension = /json.*/;
            var fileTobeRead = fileSelected.files[0];
            if (fileTobeRead.type.match(fileExtension)) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    let parsedResult = JSON.parse(fileReader.result)
                    importShortcuts(parsedResult)
                }
                fileReader.readAsText(fileTobeRead);
            }
            else {
                alert("Apenas arquivos json suportados");
            }
        }, false);
    }
    else {
        alert("Arquivo(s) não suportado(s)");
    }
}
//https://codigosimples.net/2016/04/25/ler-um-arquivo-local-usando-html5-e-javascript/

// buttons actions
$(document.body).on('click', '.dropbtn', toggleShortcutOptions);
$(document.body).on('click', '.btn-save', saveNewShortcut);
$(document.body).on('click', '.button-rm', removeLinksAdded);
$(document.body).on('click', '.btn-export', exportToJsonFile);
