/* eslint-disable no-new */

import "simple-notify/dist/simple-notify.css";
import Notify from "simple-notify";
import moment from "moment";

export function pushNotify(text, status = "success") {
  new Notify({
    text,
    status,
    showIcon: false,
    effect: "slide",
    position: "left bottom",
  });
}

export function formationDate(date) {
  return moment(date).locale("ru").format("D MMMM YYYY, HH:mm:ss");
}
