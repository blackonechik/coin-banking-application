import { el } from "redom";

export default function createButton(text, cssClass) {
  return el(`button.${cssClass}__button`, text);
}
