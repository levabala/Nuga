import interact from 'interactjs';

function generateConfig(moveCallback): interact.DraggableOptions {
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let inScroll = false;
  let lastScrollY = window.scrollY;

  function startHandler(e: interact.InteractEvent) {
    // make person cell fixed
    const cell: HTMLElement = e.target;
    const rect = cell.getBoundingClientRect();
    x = rect.left;
    y = rect.top;
    ({ width, height } = rect);

    cell.classList.add('moving');
    cell.style.top = y;
    cell.style.left = x;
    cell.style.width = `${width}px`;
    cell.style.height = `${height}px`;
    lastScrollY = window.scrollY;
  }

  function endHandler(e: interact.InteractEvent) {
    // make person cell unfixed
    const cell: HTMLElement = e.target;
    cell.classList.remove('moving');
    cell.style.top = '';
    cell.style.left = '';
    cell.style.width = '';
    cell.style.height = '';
  }

  function scrollStartHandler() {
    inScroll = true;
  }

  function moveHandler(e: interact.InteractEvent) {
    const cell: HTMLElement = e.target;
    const scrollDiff = window.scrollY - lastScrollY;
    console.log(scrollDiff);
    x += e.dx;
    y += e.dy - scrollDiff;

    // TODO: realize it via transform-translate
    cell.style.top = y;
    cell.style.left = x;
    lastScrollY = window.scrollY;

    moveCallback(x, y, width, height, scrollStartHandler);
  }

  return {
    onstart: startHandler,
    onend: endHandler,
    onmove: moveHandler,
  };
}

export default generateConfig;
