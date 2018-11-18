let initialSrcl = 0;

function createDragMoveListener(tableDiv) {
  let buffer = 0;
  return event => {
    // TODO: make hover visible after turning page
    // (note: mouse pointer shifts by translate value - it's very strange)

    const { target } = event;
    const srcl = tableDiv.scrollLeft;

    if (event.scrolling) buffer += event.dScrollY;
    else buffer -= event.dy;

    // console.log(buffer);

    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    const realX = x - srcl + (srcl - initialSrcl);
    const realY = y;
    const tfr = `translate(${realX}px, ${realY}px)`;
    // console.log(Math.floor(realX), Math.floor(realY));
    // const tfr = `translate(${x + (srcl - initialSrcl)}px, ${y}px)`;
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
  const dragMoveEventListener = createDragMoveListener(tableDiv);
  /* let lastWindowScrollY = window.scrollY;
  const updatePositionCallback = target => {
    const d = window.scrollY - lastWindowScrollY;
    console.log(d);
    dragMoveEventListener({
      dx: 0,
      dy: 0,
      dScrollY: d,
      scrolling: true,
      target,
    });
    lastWindowScrollY = window.scrollY;
  }; */
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
    onmove: dragMoveEventListener,
    onstart: event => {
      // lastWindowScrollY = window.scrollY;

      clearTimeout(timeout1);
      clearTimeout(timeout2);

      const { target } = event;

      // fixing width
      target.setAttribute('style', `width: ${getComputedStyle(target).width}`);

      // add box shadow
      target.classList.add('isDragging');

      // TODO: update position on scrolling
      // tableDiv.addEventListener('scroll', () => updatePositionCallback(target));
      // window.addEventListener('scroll', () => updatePositionCallback(target));

      // add origin cell style
      // TODO: realize overflowing
      // target.parentNode.parentNode.classList.add('draggingOrigin');

      initialSrcl = tableDiv.scrollLeft;
    },
    onend: event => {
      const { target } = event;
      // target.setAttribute('data-x', 0);
      // target.setAttribute('data-y', 0);

      /*
      const x = parseFloat(target.getAttribute('data-x')) || 0;
      const y = parseFloat(target.getAttribute('data-y')) || 0;

      // translate the element
      const srcl = tableDiv.scrollLeft;
      const tfr = `translate(${x - srcl}px, ${y}px)`;
      target.style.webkitTransform = tfr;
      target.style.transform = tfr; */

      target.classList.add('movingBack');

      // update the position attributes
      target.setAttribute('data-x', 0);
      target.setAttribute('data-y', 0);
      /*
      tableDiv.removeEventListener('scroll', () =>
        updatePositionCallback(target),
      );
      window.removeEventListener('scroll', () =>
        updatePositionCallback(target),
      ); */

      timeout1 = setTimeout(() => {
        // const tfrZERO = `translate(${-initialSrcl -
        //   (srcl - initialSrcl)}px, 0px)`;
        const tfrZERO = `translate(${0}px, ${0}px)`;
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
