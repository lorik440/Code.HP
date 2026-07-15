//add message toast
export function showToast(text) {
    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 50%;
        background: var(--alert-confirm-color);
        border:1px solid var(--border-color);
        color: white;
        padding: 5px 8px;
        font-size:small;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 2000);
}

// function to show an alert
export function showAlert(text, callback ){
    const message =document.querySelector(".message");
    const parentDiv=document.querySelector(".parent");

    parentDiv.classList.add("blur");
    message.textContent=text;
    message.classList.remove("hidden");

    
    message.addEventListener("click",()=>{
        if(!callback){
            parentDiv.classList.remove("blur");
            message.textContent="";
            message.classList.add("hidden");
            return;
        }
        if(callback){

            parentDiv.classList.remove("blur");
            message.textContent="";
            message.classList.add("hidden");

            callback();
            return;
        }
    },{once: true});

    message.addEventListener("contextmenu",()=>{
        parentDiv.classList.remove("blur");
        message.textContent="";
        message.classList.add("hidden");
        return;
    })
    
    
    
};  