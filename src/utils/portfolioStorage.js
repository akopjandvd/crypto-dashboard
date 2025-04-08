const STORAGE_KEY = 'portfolio';

export const saveToPortfolio = (entry) => {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, entry]));
};

export const removeFromPortfolio = (index) => {
    const current = JSON.parse(localStorage.getItem("portfolio")) || [];
    current.splice(index, 1);
    localStorage.setItem("portfolio", JSON.stringify(current));
  };
  

export const getPortfolio = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};
