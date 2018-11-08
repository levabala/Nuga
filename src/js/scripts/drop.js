const dropConfig = {
  accept: '.personCell',
  overlap: 0.75,
  ondropactivate: () => {
    console.log('activate');
  },
  ondragenter: event => {
    // const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    console.log(dropzoneElement);

    dropzoneElement.classList.add('readyToGetDrop');

    console.log('enter');
  },
  ondragleave: event => {
    // const draggableElement = event.relatedTarget;
    const dropzoneElement = event.target;

    dropzoneElement.classList.remove('readyToGetDrop');

    console.log('leave');
  },
};

export default dropConfig;
