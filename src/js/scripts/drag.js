function unFocus() {
  if (document.selection) {
    document.selection.empty();
  } else {
    window.getSelection().removeAllRanges();
  }
}

function dragMoveListener(event) {
  const { target } = event;
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  const tfr = `translate(${x}px, ${y}px)`;
  // target.setAttribute('style', `webkitTransform: ${tfr}; transform: ${tfr}`);
  target.style.webkitTransform = tfr;
  target.style.transform = tfr;

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  unFocus();
}

const dragConfig = {
  // enable inertial throwing
  inertia: true,

  // keep the element within the area of it's parent
  /* restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
  }, */

  // enable autoScroll
  autoScroll: true,

  // call this function on every dragmove event
  onmove: dragMoveListener,
  onstart: event => {
    const { target } = event;

    // fixing width
    target.setAttribute('style', `width: ${getComputedStyle(target).width}`);

    // add box shadow
    target.classList.add('isDragging');
  },
  onend: event => {
    const { target } = event;
    target.classList.remove('isDragging');
    target.setAttribute('style', `width: auto`);
    target.setAttribute('data-x', 0);
    target.setAttribute('data-y', 0);
  },
};

export default dragConfig;
