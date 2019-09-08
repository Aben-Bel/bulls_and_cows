const removeClass = (node, name) => {
  node.classList.remove(name);
};

const addClass = (node, name) => {
  node.classList.add(name);
};

const showClass = (...nodes) => nodes.forEach( node => removeClass(node, 'hide'));


const hideClass = (...nodes) => nodes.forEach( node => addClass(node, 'hide'));

const saveSec = (num) => { }; // save number to local storage

const getSec = () => { }; // return player's secret number from local storage
