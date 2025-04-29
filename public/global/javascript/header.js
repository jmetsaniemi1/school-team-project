const ITEM = document.querySelectorAll(".navItem");
const ITEM_NAME = document.querySelectorAll(".nameHidden");

ITEM.forEach((navItem, index) => {
  navItem.addEventListener("mouseover", () => {
    ITEM_NAME[index].classList.remove("nameHidden");
    ITEM_NAME[index].classList.add("nameVisible");
  });

  navItem.addEventListener("mouseout", () => {
    ITEM_NAME[index].classList.remove("nameVisible");
    ITEM_NAME[index].classList.add("nameHidden");
  });
});
