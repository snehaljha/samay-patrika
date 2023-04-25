function checkForFilled() {
    let rows = document.querySelectorAll('tbody>tr');

    for(let row of rows) {
        if(!checkRowForFill(row)) {
            return false;
        }
    }

    return true;
}

function checkRowForFill(row) {
    let tfs = row.querySelectorAll('.tf');
    for(let tf of tfs) {

        if(tf.value === undefined || tf.value.trim() === '') {
            return false;
        }
    }
    return true;
}

function deleteRow(event) {
    let deletableTr = event.currentTarget.parentNode.parentNode;
    deletableTr.parentNode.removeChild(deletableTr);
}

function addRow(data) {
    console.log('haah');
    let tBody = document.querySelector('tbody');
    let row = getRowNode(data);
    tBody.appendChild(row);

}

function getRowNode(data) {
    let tf1 = createTextField(["tf", "ac-tf"], "ex. *SWD*", data ? data.account : '');
    let tf2 = createTextField(["tf", "task-tf"], "ex. *SWD*", data ? data.task : '');

    let eqOption = createOption("equals", "equals (=)", data ? data.relation === 'equals' : false);
    let neqOption = createOption("not-equals", "not equals (!=)", data ? data.relation === 'not-equals' : false);

    let sf = createSelectField([eqOption, neqOption]);

    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-row";
    deleteBtn.innerText = "X";
    deleteBtn.addEventListener('click', (event) => deleteRow(event))

    td1.appendChild(tf1);
    td2.appendChild(sf);
    td3.appendChild(tf2);
    td4.appendChild(deleteBtn);

    let tr = createTr([td1, td2, td3, td4]);

    return tr;
}

function createTextField(classList, placeholder, value) {
    let tf = document.createElement("input");
    tf.type = "text";
    tf.classList.add(...classList);
    tf.placeholder = placeholder;
    tf.value = value;
    tf.addEventListener('change', checkAndAddRow);
    return tf;
}

function createOption(value, text, selected) {
    let option = document.createElement("option");
    option.value = value;
    option.innerText = text;
    if(selected) {
        option.selected = 'selected';
    }
    return option;
}

function createSelectField(options) {
    let sf = document.createElement("select");
    for(let option of options) {
        sf.appendChild(option);
    }

    return sf;
}

function createTr(items) {
    let tr = document.createElement("tr");

    for(let item of items) {
        tr.appendChild(item);
    }

    return tr;
}

function addListeners() {
    document.querySelector('#save-btn').addEventListener('click', saveData);
}

function checkAndAddRow() {
    if(checkForFilled()) {
        addRow();
    }
}

function saveData() {
    let obj = {};
    obj['configDone'] = true;
    obj['rules'] = getRules();
    chrome.storage.local.set(obj);
}

function getRules() {
    let rows = document.querySelectorAll('tbody>tr');
    let rules = [];

    for(let row of rows) {
        if(checkRowForFill(row)) {
            rules.push(getRuleFromRow(row));
        }
    }

    return rules;
}

function getRuleFromRow(row) {
    let account = row.querySelector('.ac-tf').value;
    let task = row.querySelector('.task-tf').value;
    let relation = row.querySelector('select').value;

    return {
        task: task,
        account: account,
        relation: relation 
    };
}

function loadData() {
    readData().then((data) => {
        for(let i of data) {
            addRow(i);
        }
        addRow();
    });
}

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

window.addEventListener('DOMContentLoaded', () => {
    addListeners();
    loadData();
});