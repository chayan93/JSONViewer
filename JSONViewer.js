window.onload = function () {
    try {
        var inputElem = document.createElement("input");
        document.body.appendChild(inputElem);
        inputElem.focus();
        document.execCommand("paste");
        var clipboardText = inputElem.value;
        document.body.removeChild(inputElem);

        let beautifiedJSON;

        try{
            beautifiedJSON = JSON.stringify(JSON.parse(clipboardText), null, 4)
        }
        catch(err){
            console.error(err);
            let error = 'The last copied text is an invalid JSON.';
            error += ' The correct format is [{"str": "foo", "int": 1}, {"bool": true, "others": null}]';
            alert(error);
            window.close();
        }

        setData(beautifiedJSON);
    }
    catch (ex) {
        alert('Unable to complete the request at this moment. Please try again later.');
        console.error(ex);
        window.close();
    }
};

const setData = (formattedText) => {
    let preElem = document.getElementById("preElem");
    preElem.innerHTML = formattedText;

    getDataFromStorage().then(userPreferredColors => {
        if(userPreferredColors){
            preElem.style.backgroundColor = userPreferredColors.bgCol;
            preElem.style.color = userPreferredColors.col;
            document.documentElement.style.setProperty('--selectionColor', userPreferredColors.selCol);
            document.documentElement.style.setProperty('--selectionBackgroundColor', userPreferredColors.selBgCol);
        }
        else{
            setDefaultSelectionColors();
        }
    }).catch(error => {
        console.error(error);
        setDefaultSelectionColors();
    })
}

const getDataFromStorage = () => {
    return new Promise((resolve, reject) =>
        chrome.storage.sync.get({
            bgCol: '#000000', col: '#008000', selBgCol: '#2f4f4f', selCol: '#deb887'
        }, (items) => {
            chrome.runtime.lastError
            ? reject(Error(chrome.runtime.lastError.message))
            : resolve(items);
        })
    );
}

const setDefaultSelectionColors = () => {
    document.documentElement.style.setProperty('--selectionColor', '#000000');
    document.documentElement.style.setProperty('--selectionBackgroundColor', '#ACCEF7');
}