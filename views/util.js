const removeClass = (node, name) => {
  node.classList.remove(name);
};

const addClass = (node, name) => {
  node.classList.add(name);
};

const showClass = (...nodes) => nodes.forEach( node => removeClass(node, 'hide'));


const hideClass = (...nodes) => nodes.forEach( node => addClass(node, 'hide'));
