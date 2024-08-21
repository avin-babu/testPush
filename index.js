const addBttn = document.querySelector('.fa-plus');
const modalCont = document.querySelector('.modal-cont');
const mainCont = document.querySelector('.main-cont');
const textCont = document.querySelector('.textarea-cont');
const priorityColor = document.querySelectorAll('.priority-color');
const removeButton = document.querySelector('.fa-minus');
// const textCont = document.querySelector('.textarea-cont');
const colorArr = ['blue','red' , 'yellow', 'green'];
const taskArr = [];
const colorToolArr = document.querySelectorAll('.color');
console.log('colorToolArr',colorToolArr);
let color;
let isTrue = false;
let removeTaskFlag = false;
// let isNewCreation = true;
if(localStorage.getItem('taskArray')){
    const taskLocalArr = JSON.parse(localStorage.getItem('taskArray'));
    // console.log('element',element);
    taskLocalArr.forEach(function(element){
        createTicket(element.priColor,
            element.textContVal,
            element.taskId,
            true
        )
        
    })
}
// localStorage.setItem('taskArray',JSON.stringify(taskArr));

addBttn.addEventListener('click', function(){
    isTrue = !isTrue;
    if(isTrue){
        modalCont.style.display = 'flex';
        addBttn.style.color = 'green';
        // isNewCreation = true;
        // console.log('Im here!');
    }
    else{
        
        modalCont.style.display = 'none';
        addBttn.style.color = 'cadetBlue';
    }
})

modalCont.addEventListener('keydown', function(e){    
    if(e.key=="Shift"){
        let textValue = textCont.value;
        let taskId = shortid();
        createTicket(color,textValue, taskId, true);
        modalCont.style.display = 'none';
        isTrue = !isTrue;
        // console.log(textCont.value);
        textCont.value = "";
    }
})
function createTicket(priColor, textContVal, taskId, isNewCreation){
    // console.log(priColor);

        const divElem = document.createElement('div');
        divElem.setAttribute('class','ticket-cont');
        divElem.innerHTML = `
                <div class="ticket-color ${priColor}" ></div>
                <div class="ticket-id">${taskId}</div>
                <div class="ticket-area">${textContVal}</div>
                <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
                `
        mainCont.appendChild(divElem);
        
        lockHandler(divElem, taskId);
        colorHandler(divElem, taskId);
        removeHandler(divElem, taskId);
        if(isNewCreation){
            taskArr.push({priColor,textContVal,taskId});
            localStorage.setItem('taskArray',JSON.stringify(taskArr));
        }
        console.log(taskArr)
    }
    


priorityColor.forEach(function(currElement){
    currElement.addEventListener('click',function(){
        priorityColor.forEach(function(element){
            element.classList.remove('active');
        })
        currElement.classList.add('active');
        color = currElement.getAttribute('data-color');
    })
})

removeButton.addEventListener('click',function(){
    removeTaskFlag = !removeTaskFlag ; 
    if(removeTaskFlag){
        window.alert('Are you going to delete the tasks?');
        removeButton.style.color = 'red';
    }
    else{
        window.alert('delete mode has been deactivated');
        removeButton.style.color = 'cadetBlue';

    }
})
// console.log(shortid());

function removeHandler(ticket, taskId){
    // console.log(removeTaskFlag)
    
        ticket.addEventListener('click', function(){
                // console.log('HI');
                if(removeTaskFlag){
                    let currTaskInd = taskArr.findIndex(function(currEle){
                        // console.log(currEle);
                        return currEle.taskId == taskId;
                    })
                    // console.log(currTaskInd);
                    
                    taskArr.splice(currTaskInd,1);
                    localStorage.setItem('taskArray',JSON.stringify(taskArr));
                    ticket.remove();
                    console.log('taskArr',taskArr);
                    
                }
        })
}

function lockHandler(ticket, taskId){
    const lockDivElem = ticket.querySelector('.ticket-lock');
    const lockDivContentElem = ticket.querySelector('.ticket-area');
    const lockIElem = lockDivElem.children['0'];

    lockIElem.addEventListener('click', function(){
        if(lockIElem.classList.contains('fa-lock')){
            lockIElem.classList.remove('fa-lock');
            lockIElem.classList.add('fa-unlock');
            lockDivContentElem.setAttribute('contenteditable', 'true');
        }
        else{
            lockIElem.classList.remove('fa-unlock');
            lockIElem.classList.add('fa-lock');
            lockDivContentElem.setAttribute('contenteditable', 'false');
            const currTask = taskArr.find(function(taskElement){
                return taskElement.taskId == taskId;
            })
            // console.log(lockDivContentElem);
            // console.log(lockDivContentElem.innerText);
            
            currTask.textContVal = lockDivContentElem.innerText;
            // console.log(taskArr.textContVal);
            localStorage.setItem('taskArray',JSON.stringify(taskArr));
            console.log('taskArr', taskArr);
        }
    })
}

function colorHandler(ticket, taskId){
 
    const colorCont = ticket.querySelector('.ticket-color');
    // console.log(colorCont);
    
    colorCont.addEventListener('click',function(){
        const colorClass = colorCont.classList[1];
        let colorInd = colorArr.findIndex(function(ele){
            return ele==colorClass;
        })
        // console.log(colorCont);
    
        colorInd++;
        // console.log(colorInd);
        const colorIndex = colorInd % colorArr.length;
        colorCont.classList.remove(colorClass);
        const newColor = colorArr[colorIndex];
        colorCont.classList.add(newColor);

        const currArrTask = taskArr.find(function(currentTask){
            return currentTask.taskId == taskId;
        })
        console.log('currArrTask.priColor',currArrTask.priColor);
        console.log('newColor',newColor);
        
        currArrTask.priColor = newColor;
        localStorage.setItem('taskArray',JSON.stringify(taskArr));
        console.log(taskArr);
        // console.log('currArrTask',currArrTask);
    }) 
}

colorToolArr.forEach(function(currColorEle){
    currColorEle.addEventListener('click',function(){
        const currentColor = currColorEle.classList[0];
        // console.log('currentColor',currentColor);
        const filteredArray = taskArr.filter(function(eleToFilter){
            return eleToFilter.priColor == currentColor;
        })
        // console.log('filteredArray',filteredArray);
        mainCont.innerHTML = '';
        //priColor, textContVal, taskId
        filteredArray.forEach(function(ele){
            createTicket(ele.priColor,ele.textContVal,ele.taskId,false);   
        })
    })

    currColorEle.addEventListener('dblclick', function(){
        mainCont.innerHTML = '';
        taskArr.forEach(function(element){
            createTicket(element.priColor,element.textContVal,element.taskId,false);
        })
    })
})
