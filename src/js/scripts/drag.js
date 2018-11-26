let initialSrcl = 0;

function createDragMoveListener(tableDiv) {
  return event => {
    const { target } = event;
    const srcl = tableDiv.scrollLeft;

    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    const realX = x - srcl + (srcl - initialSrcl); // + horizontalFix;
    const realY = y - window.scrollY;
    // console.log(Math.floor(horizontalFix));

    const tfr = `translate(${realX}px, ${realY}px)`;
    // console.log(Math.floor(realX), Math.floor(realY));
    // console.log(Math.floor(x), Math.floor(y));
    // const tfr = `translate(${x + (srcl - initialSrcl)}px, ${y}px)`;
    // target.setAttribute('style', `webkitTransform: ${tfr}; transform: ${tfr}`);

    target.style.webkitTransform = tfr;
    target.style.transform = tfr;

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    setTimeout(
      () =>
        tableDiv.dispatchEvent(
          new CustomEvent('draggableMoved', {
            detail: target,
          }),
        ),
      0,
    );
  };
}

function generateConfig(tableDiv) {
  let timeout1 = null;
  let timeout2 = null;
  const dragMoveEventListener = createDragMoveListener(tableDiv);
  /*
  const updatePositionCallback = target => {
    dragMoveEventListener({
      dx: 0,
      dy: 0,
      target,
    });
  }; */
  return {
    inertia: false,
    autoScroll: false,
    onmove: dragMoveEventListener,
    onstart: event => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);

      const { target } = event;

      dragMoveEventListener({
        dx: 0,
        dy: 0,
        target,
        init: true,
      });

      // fixing width
      target.setAttribute('style', `width: ${getComputedStyle(target).width}`);

      // add box shadow
      target.classList.add('isDragging');

      // vertical scrolling listener
      // window.addEventListener('scroll', () => updatePositionCallback(target));

      // add origin cell style
      target.parentNode.parentNode.parentNode.classList.add('draggingOrigin');

      initialSrcl = tableDiv.scrollLeft;
    },
    onend: event => {
      const { target } = event;
      // target.setAttribute('data-x', 0);
      // target.setAttribute('data-y', 0);

      const srcl = tableDiv.scrollLeft;
      /*
      const x = parseFloat(target.getAttribute('data-x')) || 0;
      const y = parseFloat(target.getAttribute('data-y')) || 0;

      // translate the element
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
        const tfrZERO = `translate(${-initialSrcl -
          (srcl - initialSrcl)}px, ${-window.scrollY}px)`;
        // const tfrZERO = `translate(${0}px, ${0}px)`;
        target.style.webkitTransform = tfrZERO;
        target.style.transform = tfrZERO;

        const duration =
          parseFloat(getComputedStyle(target).transitionDuration) * 1000;

        timeout2 = setTimeout(() => {
          // add origin cell style
          target.parentNode.parentNode.parentNode.classList.remove(
            'draggingOrigin',
          );
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
