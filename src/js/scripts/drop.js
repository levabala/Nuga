const dropConfig = {
  accept: '.personCell',
  overlap: 0.6,
  ondropactivate: () => {},
  ondragenter: event => {
    const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;
    dropzoneElement.classList.add('readyToGetDrop');
    draggableElement.classList.add('readyToBeDropped');
  },
  ondragleave: event => {
    const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    dropzoneElement.classList.remove('readyToGetDrop');
    draggableElement.classList.remove('readyToBeDropped');
  },
};

export default dropConfig;
