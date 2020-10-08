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

const loadingIcon = (activate) => {
  const icon = document.querySelector('.loading');
  if (activate) {
    showClass(icon);
  } else {
    hideClass(icon);
  }
};

const validateSecretNum = (num) => {
  // check all char are digits
  if (isNaN(num)) {
    return false;
  }
  // four digits
  if (num.length !== 4) {
    return false;
  }
  // four unique digits
  const [a, b, c, d] = num.split('').sort();
  if (a === b || b === c || c === d) {
    return false;
  }

  return true;
}
