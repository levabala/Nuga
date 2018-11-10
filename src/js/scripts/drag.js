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
}

function generateConfig() {
  let timeout1 = null;
  let timeout2 = null;
  return {
    // enable inertial throwing
    inertia: false,

    // keep the element within the area of it's parent
    /* restrict: {
      restriction: `#${id}`,
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
    }, */

    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    onstart: event => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);

      const { target } = event;

      // fixing width
      target.setAttribute('style', `width: ${getComputedStyle(target).width}`);

      // add box shadow
      target.classList.add('isDragging');
    },
    onend: event => {
      const { target } = event;
      // target.setAttribute('data-x', 0);
      // target.setAttribute('data-y', 0);

      const x = parseFloat(target.getAttribute('data-x')) || 0;
      const y = parseFloat(target.getAttribute('data-y')) || 0;

      // translate the element
      const tfr = `translate(${x}px, ${y}px)`;
      target.style.webkitTransform = tfr;
      target.style.transform = tfr;

      target.classList.add('movingBack');

      timeout1 = setTimeout(() => {
        const tfrZERO = `translate(0px, 0px)`;
        target.style.webkitTransform = tfrZERO;
        target.style.transform = tfrZERO;

        // update the posiion attributes
        target.setAttribute('data-x', 0);
        target.setAttribute('data-y', 0);

        const duration =
          parseFloat(getComputedStyle(target).transitionDuration) * 1000;

        timeout2 = setTimeout(() => {
          target.dispatchEvent(new Event('animationend'));
        }, duration);

        // TOOO: critical bug!!! jumping with time < 100
      }, 100);
    },
  };
}

export default generateConfig;
