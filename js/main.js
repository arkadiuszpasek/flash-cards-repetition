const info = document.querySelector('.info');
const flashcards = document.querySelector('.flashcards');

let alerts = new Array();
let flashcardSets = new Map;

const addAlert = (message,state) => {
    alerts.unshift(`
    <div class="alert alert-dismissible alert-${state}">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        ${message}
    </div>`);
    info.innerHTML = alerts[0] + info.innerHTML;
   setTimeout(updateAlerts, 2500);
}

const updateAlerts = () => {
    alerts.pop();
    info.innerHTML = '';
    alerts.forEach(alert => {
        info.innerHTML += alert;
    })
}
const toggleCard = flashcard => {
    const cardClassList = flashcard.firstElementChild.firstElementChild.classList;
    if(cardClassList.contains('border-primary')){
        cardClassList.remove('border-primary');
        cardClassList.add('border-success');
        flashcard.querySelector('.card-front').classList.toggle('hide');
        flashcard.querySelector('.card-back').classList.toggle('hide');
    }
    else{
        cardClassList.remove('border-success');
        cardClassList.add('border-primary');
        flashcard.querySelector('.card-front').classList.toggle('hide');
        flashcard.querySelector('.card-back').classList.toggle('hide');
    }

    flashcard.firstElementChild.classList.toggle('card-rotate');
}

const loadFlashcards = async jsonName => {
    try{
        const res = await fetch(jsonName + '.json');
        flashcardSets.set(jsonName, await res.json());
    
        const li = document.createElement('li');
        li.classList.add('nav-item');
        const a = document.createElement('a');
        a.appendChild(document.createTextNode(jsonName));
        a.classList.add('nav-link');
        a.href = '#';
        a.addEventListener('click', ()=>{
            selectSet(a);
        })
        li.appendChild(a);
        document.querySelector('.navbar-nav').appendChild(li);
        addAlert(`Loaded successfuly set: '${jsonName}'`, 'info');
    }
    catch{
        addAlert(`Could not load set: ${jsonName}`, 'danger')
    }
}

const selectSet = targetSet => {
    flashcards.innerHTML = '';
    flashcardSets.get(targetSet.text).forEach(flashcard => {
        flashcards.innerHTML += `
        <div class="flashcard col-md-4 mt-3">
            <div class="card-inner">
                <div class="card border-primary card-body">
                    <div class="card-front">
                        <h4 class="card-title">${flashcard.word}</h4>
                    </div>
                    <div class="card-back hide">
                        <p class="card-text">${flashcard.definition}</p>
                    </div>
                </div>    
            </div>
        </div>`
    });
    flashcards.querySelectorAll('.flashcard').forEach(flashcard => {
        flashcard.addEventListener('click', () => {
            toggleCard(flashcard);
        })
    });
}

loadFlashcards('English-1')
loadFlashcards('English-2')



