/*
* TLDR
* 1. Add Flag for things that shouldn't be dragged
*         Also good for sticky notes!
* 2. Find out how to make a clone of html drag with you
* 3. Visual cues (highlighting and underlining mostly)
* 4. Turn of text highlighting when dragging (easy)
* 5. Options (highlight color, timer before drag)
* 6. Learn how to spell drag right in all forms
* 7. Export to an object, so that it can be used by consumers easier
* 8. Refactor and make pretty
*/
let dragables = [];

function getArrayOfDragables() {
  let sections = document.getElementsByClassName('dragdrop-container');
  for(let i = 0; i < sections.length; i++) {
    let items = sections[i].getElementsByClassName('dragdrop-item');
    dragables[i] = [];
    for(let j = 0; j < items.length; j++) {
      let bounding = items[j].getBoundingClientRect();
      dragables[i].push({
        xStart: bounding.x,
        xEnd: bounding.x + bounding.width,
        yStart: bounding.y,
        yEnd: bounding.y + bounding.height,
        html: items[j]
      })
    }
  }
}

function deleteDragable(target) {
  for(let i = 0; i < dragables.length; i++) {
    for(let j = 0; j < dragables[i].length; j++) {
      let current = dragables[i][j];
      if(current.html === target) {
        dragables[i].splice(j, 1);
      }
    }
  }
}

function insertDragable(target, section, index) {
  dragables[section].splice(index, 0, { html: target });
}

function placeDrag(target, { pageX, pageY }) {
  deleteDragable(target);
  let newPos = processNewPos(pageX, pageY);
  insertDragable(target, newPos.i, newPos.j)
  renderDrags();
}

function renderDrags() {
  let sections = document.getElementsByClassName('dragdrop-container');
  for(let i = 0; i < sections.length; i++) {
    removeAllDragsInSection(sections[i], i);
    appendNewDrags(sections[i], dragables[i])
  }
  getArrayOfDragables();
}

function removeAllDragsInSection(section, index) {
  for(let i = 0; i < dragables[i].length; i++){
    section.removeChild(dragables[i])
  }
}

function appendNewDrags(section, newChildren) {
  for(let i = 0; i < newChildren.length; i++) {
    section.append(newChildren[i].html);
  }
}

function processNewPos(x, y) {
  for(let i = 0; i < dragables.length; i++) {
    for(let j = 0; j < dragables[i].length; j++) {
      let current = dragables[i][j];
      if(x > current.xStart && x < current.xEnd) {
        if(j === 0 && y < current.yEnd) {
          return {i, j};
        }
        else if(j === dragables[i].length - 1 && y > current.yStart) {
          return {i, j: j + 1};
        }
        else if(y < current.yEnd && y > dragables[i][j-1].yEnd) {
          return {i, j};
        }
      }
    }
  }
}

document.addEventListener('mousedown', (mouseDownEvent) => {
  document.addEventListener('mouseup', function mouseUp(mouseUpEvent) {
    let targetClass = mouseDownEvent.target.className;
    if(targetClass.includes('dragdrop-item')) {
      if(mouseUpEvent.returnValue === true) {
        placeDrag(mouseDownEvent.target, mouseUpEvent)
        document.removeEventListener('mouseup', mouseUp)
      }
    }
  })
});



getArrayOfDragables();
console.log(dragables);