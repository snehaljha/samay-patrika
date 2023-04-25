function readData() {
    
    return new Promise((resolve, _error) => { 
        let data = [
            {
                task: 'SWM',
                account: 'SWM',
                relation: 'equals'
            },
            {
                task: 'R&D',
                account: 'R&D',
                relation: 'equals'
            }
        ];
        chrome.storage.local.get('configDone', (value) => {
            if(value) {
                chrome.storage.local.get('rules', (values) => {
                    data = values;
                    resolve(data);
                });
            }

            resolve(data);
        });
    });
}

// readData().then((value) => {
//     console.error(value);
// });



document.addEventListener('mouseup', (_event) => {
    setTimeout(verify, 350);
});


function verify() {
    console.log('chalo dekhe...');
    if(!document.querySelector('#worklogForm')) {
        return;
    }

    let accountEle = document.evaluate(
        '/html/body/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div[1]/div[7]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    if(!accountEle) {
        return;
    }

    let taskEle = document.evaluate(
        '/html/body/div[1]/div[2]/div/div/div/div[2]/div/div[2]/div[3]/div/div/div[1]/div[7]/div[2]/div[2]/span/div/div[1]/div[1]/div[1]/div',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(!taskEle) {
        return;
    }

    let submitBtn = document.querySelector('#worklogForm').nextElementSibling.querySelector('button');
    if(!submitBtn) {
        return;
    }

    checkAndTrigger(accountEle.innerText, taskEle.innerText, showSubmitBtn, hideSubmitBtn);

}

function showSubmitBtn() {
    let submitBtn = document.querySelector('#worklogForm').nextElementSibling.querySelector('button');
    submitBtn.style.display = 'inline';
}

function hideSubmitBtn() {
    let submitBtn = document.querySelector('#worklogForm').nextElementSibling.querySelector('button');
    submitBtn.style.display = 'none';
}

function checkAndTrigger(accountText, taskText, trueTrigger, falseTrigger) {
    readData().then((values) => {
        let matched = false;
        for(let value of values) {
            if(accountText.match(value.account)) {
                matched = true;
                if(value.relation === 'equals' && taskText.match(value.task)) {
                    trueTrigger();
                    return;
                }

                if(value.relation === 'not-equals' && !taskText.match(value.task)) {
                    trueTrigger();
                    return;
                }
            }
        }

        if(matched) {
            falseTrigger();
            return;
        }

        trueTrigger();
    });
}