const dropConfig = {
  accept: '.personCell',
  overlap: 0.6,
  ondropactivate: () => {},
  ondragenter: event => {
    // const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    console.log(dropzoneElement);

    dropzoneElement.classList.add('readyToGetDrop');
  },
  ondragleave: event => {
    // const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    dropzoneElement.classList.remove('readyToGetDrop');
  },
};

export default dropConfig;
