let initialSrcl = 0;

function createDragMoveListener(tableDiv) {
  return event => {
    // TODO: make hover visible after turning page
    // (note: mouse pointer shifts by translate value - it's very strange)

    const { target } = event;
    const srcl = tableDiv.scrollLeft;

    // console.log(initialSrcl, srcl);

    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    const tfr = `translate(${x - srcl + (srcl - initialSrcl)}px, ${y}px)`;
    // target.setAttribute('style', `webkitTransform: ${tfr}; transform: ${tfr}`);

    target.style.webkitTransform = tfr;
    target.style.transform = tfr;

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    tableDiv.dispatchEvent(
      new CustomEvent('draggableMoved', {
        detail: target,
      }),
    );
  };
}

function generateConfig(tableDiv) {
  let timeout1 = null;
  let timeout2 = null;
  return {
    // enable inertial throwing
    inertia: false,

    // keep the element within the area of it's parent
    /* restrict: {
      restriction: tableDiv,
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
    },
*/

    autoScroll: false,

    // call this function on every dragmove event
    onmove: createDragMoveListener(tableDiv),
    onstart: event => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);

      const { target } = event;

      // fixing width
      target.setAttribute('style', `width: ${getComputedStyle(target).width}`);

      // add box shadow
      target.classList.add('isDragging');

      initialSrcl = tableDiv.scrollLeft;
    },
    onend: event => {
      const { target } = event;
      // target.setAttribute('data-x', 0);
      // target.setAttribute('data-y', 0);

      const x = parseFloat(target.getAttribute('data-x')) || 0;
      const y = parseFloat(target.getAttribute('data-y')) || 0;

      // translate the element
      const srcl = tableDiv.scrollLeft;
      const tfr = `translate(${x - srcl}px, ${y}px)`;
      target.style.webkitTransform = tfr;
      target.style.transform = tfr;

      target.classList.add('movingBack');

      // update the position attributes
      target.setAttribute('data-x', 0);
      target.setAttribute('data-y', 0);

      timeout1 = setTimeout(() => {
        const tfrZERO = `translate(${-initialSrcl -
          (srcl - initialSrcl)}px, 0px)`;
        target.style.webkitTransform = tfrZERO;
        target.style.transform = tfrZERO;

        const duration =
          parseFloat(getComputedStyle(target).transitionDuration) * 1000;

        timeout2 = setTimeout(() => {
          target.dispatchEvent(new Event('animationend'));
        }, duration);

        // FIXIT: critical bug!!! jumping with time < 100
        // posibile reason: border-shadow transition not finished when moveBack animation starts
      }, 100);

      target.addEventListener('animationend', () => clearTimeout(timeout1));
    },
  };
}

export default generateConfig;
