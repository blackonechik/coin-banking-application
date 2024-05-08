import "../../styles/base/_dropdowns.scss";
import { el } from "redom";

export default function createDropdown(name, elements) {
  const typeName = el("span.dropdown__title", name);
  const selectionItems = elements.map((element) =>
    el("li.dropdown__item", element),
  );
  const item = el(
    "div.dropdown",
    typeName,
    el("ul.dropdown__list", selectionItems),
  );

  const toggleDropdown = () => {
    item.classList.toggle("dropdown_active");
  };

  typeName.addEventListener("click", () => toggleDropdown(item));

  return {
    item,
    typeName,
    selectionItems,
    toggleDropdown,
  };
}
