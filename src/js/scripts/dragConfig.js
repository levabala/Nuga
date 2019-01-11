import interact from 'interactjs';

function generateConfig(moveCallback): interact.DraggableOptions {
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let lastScrollY = window.scrollY;
  let tempNode = null;

  function startHandler(e: interact.InteractEvent) {
    // make person cell fixed
    const cell: HTMLElement = e.target;
    const rect = cell.getBoundingClientRect();

    tempNode = cell.cloneNode(true);

    document.body.appendChild(tempNode);
    x = rect.left;
    y = rect.top;
    ({ width, height } = rect);

    cell.classList.add('hidden');
    tempNode.classList.add('moving');
    tempNode.style.top = y;
    tempNode.style.left = x;
    tempNode.style.width = `${width}px`;
    tempNode.style.height = `${height}px`;
    lastScrollY = window.scrollY;
  }

  function endHandler(e: interact.InteractEvent) {
    // make person cell unfixed
    const cell: HTMLElement = e.target;
    cell.classList.remove('hidden');
    /*
    cell.classList.remove('moving');
    cell.style.top = '';
    cell.style.left = '';
    cell.style.width = '';
    cell.style.height = '';
    */
    document.body.removeChild(tempNode);
  }

  function moveHandler(e: interact.InteractEvent) {
    // const cell: HTMLElement = e.target;
    const scrollDiff = window.scrollY - lastScrollY;
    x += e.dx;
    y += e.dy - scrollDiff;

    // TODO: realize it via transform-translate
    tempNode.style.top = y;
    tempNode.style.left = x;
    lastScrollY = window.scrollY;

    // console.log(...[x, y, width, height].map(Math.round));

    moveCallback(x, y, width, height);
  }

  return {
    autoScroll: false,
    inertia: false,
    onstart: startHandler,
    onend: endHandler,
    onmove: moveHandler,
  };
}

export default generateConfig;
