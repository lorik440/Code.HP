//instructions
//the html element-s need to have the "draggable" calss
//the html element-s need to have position:absolute

document.querySelectorAll(".draggable")
    .forEach(el => makeDraggable(el));

function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("mousedown", (e) => {
        isDragging = true;
        element.style.cursor = "grabbing";

        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        element.style.left = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, e.clientX - offsetX)) + "px";
        element.style.top  = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, e.clientY - offsetY)) + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
    });
}