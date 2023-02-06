function restore_options() {
    chrome.storage.sync.get({
        bgCol: '#000000', col: '#008000', selBgCol: '#2f4f4f', selCol: '#deb887'
    }, function(items) {
        document.getElementById('bgCol').value = items.bgCol;
        document.getElementById('col').value = items.col;
        document.getElementById('selBgCol').value = items.selBgCol;
        document.getElementById('selCol').value = items.selCol;
    });
}

function save_options() {
    var bgCol = document.getElementById('bgCol').value;
    var col = document.getElementById('col').value;
    var selBgCol = document.getElementById('selBgCol').value;
    var selCol = document.getElementById('selCol').value;

    try{
        chrome.storage.sync.set({
            bgCol: bgCol, col: col, selBgCol: selBgCol, selCol: selCol
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.style.color = 'green';
            status.innerHTML = 'Saved..!!';

            setTimeout(function() {
                status.innerHTML = '';
            }, 1500);
        });
    }
    catch(error){
        console.error(error);
        var status = document.getElementById('status');
        status.style.color = 'red';
        status.innerHTML = 'Error..!! Unable to save, please try again later.';
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);