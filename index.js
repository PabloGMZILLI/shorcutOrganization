var folders = localStorage.getItem('saveShortcuts') || []
// console.log('======>>> folders: ', JSON.parse(folders))
if (folders !== [] ) importShortcuts()

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

function importShortcuts () {
    // Retrieve the object from storage
    let parseStorage = JSON.parse(folders)
    let allNames = []
    let allUrls = []
    for (let i=0; i < parseStorage.length; i++){

        allNames = []
        allUrls = []
        for (let b=0; b < parseStorage[i].folderContent.length; b++){
            
            allNames.push(parseStorage[i].folderContent[b].urlName)
            allUrls.push(parseStorage[i].folderContent[b].url)
        }
        appendDiv(parseStorage[i].folderName, allNames, allUrls)
    }

}

function appendDiv (folderName, contentNamesArray, contentUrlsArray)   {
    let contentConstructor = []
    for (let i=0; i < contentNamesArray.length; i++){
        contentConstructor = contentConstructor + `<a target="_blank" href="${contentNamesArray[i]}">${ contentUrlsArray[i]}</a>`
    }

    $(
        `<div class="userShortcut">
            <button class="dropbtn">${folderName}</button>
            <div class="shortcut-content" id="shortcutDropdown">
                ${contentConstructor}
            </div>
        </div>`).insertBefore($('.newShortcutFolder'))
}

function saveNewShortcut () {
    let folderName = $(".input-main")[0].value
    let allNames = $( ".input-name" ).map(function(){return this.value})
    let allUrls = $( ".input-url" ).map(function(){return this.value})

    appendDiv(folderName, allNames, allUrls )
    let folder = { "folderName": folderName, "folderContent": createDropContent() }
    console.log('======>>> folders: ', folders)
    JSON.parse(folders).push(folder)

    localStorage.setItem('saveShortcuts', JSON.stringify(folders))

    

    // ====== Download ======
    // let text = $(".userShortcut");
    // let allItems = '';
    // text.each(function (elem) {
    //     allItems += `<div class="userShortcut">${$(this).html()}</div>`;
    // });
    // this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(allItems);
    // =======================


    $('.inputsAdded').remove();
    $('input').map(function(){ this.value = "" })
    $('.add-shortcut-folder-content').removeClass('show');
    $('.btn-save').removeClass('show');
    $('.btn-more').remove()
    $('.btn-new')[0].innerText = '+'

}

function createDropContent () {
    let allNames = $( ".input-name" ).map(function(){return this.value})
    let allUrls = $( ".input-url" ).map(function(){return this.value})
    let add = []
    for (let i=0; i < allNames.length; i++){
        add.push({"url" : allUrls[i], "urlName": allNames[i]})
    }   

    return add
}

function removeLinksAdded () {
    $(this).parent().remove(); 
}

window.onload = function () {
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelected = document.getElementById('txtfiletoread');
        fileSelected.addEventListener('change', function (e) {
            var fileExtension = /text.*/;
            var fileTobeRead = fileSelected.files[0];
            if (fileTobeRead.type.match(fileExtension)) {
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    let fileContents = $('<div class="container"></div>').insertBefore($('.newShortcutFolder'))

                    fileContents[0].innerHTML += fileReader.result;
                }
                fileReader.readAsText(fileTobeRead);
            }
            else {
                alert("Por favor selecione arquivo texto");
            }
        }, false);
    }
    else {
        alert("Arquivo(s) não suportado(s)");
    }
}
//https://codigosimples.net/2016/04/25/ler-um-arquivo-local-usando-html5-e-javascript/

$(document.body).on('click', '.dropbtn', toggleShortcutOptions);
$(document.body).on('click', '.btn-save', saveNewShortcut);
$(document.body).on('click', '.button-rm', removeLinksAdded);
$(document.body).on('click', '.btn-import', importShortcuts);
