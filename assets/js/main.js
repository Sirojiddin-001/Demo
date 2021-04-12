import "./quill.min.js";
import "./quill_setting.js";
import {
  render,
  QSA,
  QS,
  ID
} from "./render.min.js";

const convert = ID("convert"),
  save_pdf = ID("save_pdf"),
  save_png = ID("save_png"),
  editor = ID("editor_block"),
  generate_dom = ID("generate_dom"),
  generate_img = ID("generate_img"),
  setting_btn = ID("save_setting_btn");

let pdf = new jsPDF("p", "mm", "a4", true);
let zip = new JSZip();

Number.prototype.padLeft = function (base, chr) {
  const len = (String(base || 10).length - String(this).length) + 1;
  return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

const random = () => {
  const getDate = new Date,
    dateFormat = [
      getDate.getFullYear(),
      (getDate.getMonth() + 1).padLeft(),
      getDate.getDate().padLeft(),
    ].join('') +
    '_' + [getDate.getHours().padLeft(),
      getDate.getMinutes().padLeft(),
      getDate.getSeconds().padLeft()
    ].join('');
  return dateFormat;
};

const fadeOut = (e, t) => {
  const n = QS(e);
  (n.style.opacity = 1),
  setTimeout(() => {
    (function e() {
      (n.style.opacity -= 0.1) < 0
        ?
        (n.style.display = "none") :
        requestAnimationFrame(e);
    })();
  }, t);
};

const fadeIn = (e, t, n) => {
  const o = QS(e);
  (o.style.opacity = 0),
  (o.style.display = t || "block"),
  setTimeout(() => {
    (function e() {
      var t = parseFloat(o.style.opacity);
      (t += 0.1) > 1 || ((o.style.opacity = t), requestAnimationFrame(e));
    })();
  }, n);
};

const renderPage = () => {
  if (getCookie("page")) {
    editor.dbabych_columnize({
      width: QS(`.${getCookie("page")}_size`).offsetWidth,
      height: QS(`.${getCookie("page")}_size`).offsetHeight,
      done_func: () => {
        console.log("Page added!");
        generate_img.innerHTML = null;
      },
      target: generate_dom,
    });
  } else {
    editor.dbabych_columnize({
      width: QS(`.${ID("page-select").value}_size`).offsetWidth,
      height: QS(`.${ID("page-select").value}_size`).offsetHeight,
      done_func: () => {
        console.log("Page added!");
        generate_img.innerHTML = null;
      },
      target: generate_dom,
    });
  }
};

const renderImg = async (element, i) => {
  setTimeout(() => {
    element.style.display = "inline-block";
    domtoimage
      .toPng(element)
      .then((url) => {
        render("div", {
          appendIn: [
            render("a", {
              attr: {
                "data-type": "image",
                class: "uk-inline",
                href: url,
                "data-caption": `Page ${i + 1}`,
              },
              appendIn: [
                render("img", {
                  attr: {
                    src: url,
                  },
                }),
              ],
            }),
          ],
          appendTo: "#generate_img",
        });
        element.style.display = "none";
      })
      .catch((e) => {
        UIkit.notification({
          message: "<span uk-icon='icon: check'></span> ERROR",
          pos: "bottom-right",
          status: "danger",
        });
        console.log(e);
      });
  }, 1000 * i);
};

convert.addEventListener("click", function () {
  renderPage();
  let column;
  if (getCookie("page")) {
    column = QSA(`.${getCookie("page")}`);
  } else {
    column = QSA(`.${ID("page-select").value}`);
  }
  column.forEach((e, t) => {
    renderImg(e, t);
  });

  fadeIn("#loader", "flex", 500);
  fadeOut("#loader", 1000 * column.length);

  UIkit.notification({
    message: "<span uk-icon='icon: check'></span> SUCCESS",
    pos: "bottom-right",
    status: "success",
  });
  pdf = new jsPDF("p", "mm", "a4", true);
  zip = new JSZip();
});

save_pdf.addEventListener("click", () => {
  let column;
  if (getCookie("page")) {
    column = QSA(`.${getCookie("page")}`);
  } else {
    column = QSA(`.${ID("page-select").value}`);
  }
  column.length > 0 && fadeIn("#loader", "flex", 500);
  setTimeout(() => {
    if (column.length > 0) {
      QSA("#generate_img img").forEach((element, i) => {
        pdf.addImage(element.src, "PNG", 0, 0, 210, 297, i, "FAST");
        pdf.addPage();
      });
      fadeOut("#loader", 500);
      UIkit.notification({
        message: "<span uk-icon='icon: check'></span> SUCCESS",
        pos: "bottom-right",
        status: "success",
      });
      pdf.deletePage(pdf.internal.getNumberOfPages());
      pdf.save(`PDF_${random()}.pdf`);
    }
  }, 1000);
});

save_png.addEventListener("click", () => {
  let column;
  if (getCookie("page")) {
    column = QSA(`.${getCookie("page")}`);
  } else {
    column = QSA(`.${ID("page-select").value}`);
  }
  UIkit.notification({
    message: "<span uk-icon='icon: check'></span> SUCCESS",
    pos: "bottom-right",
    status: "success",
  });
  if (column.length > 1) {
    QSA("#generate_img img").forEach((element, i) => {
      zip.file(`Page ${i + 1}.png`, `${element.src.slice(22)}`, {
        base64: true,
      });
    });
    zip.generateAsync({
      type: "blob"
    }).then(function (content) {
      saveAs(content, `ZIP_${random()}.zip`);
    });
  } else {
    column.forEach((element, i) => {
      element.style.display = "inline-block";
      domtoimage.toBlob(element).then(function (blob) {
        window.saveAs(blob, `IMG_${random()}.png`);
        element.style.display = "none";
      });
    });
  }
});

setting_btn.addEventListener("click", () => {
  setCookie("font_family", ID("font-select").value, 365000);
  setCookie("font_size", ID("font-size-select").value, 365000);
  setCookie("page", ID("page-select").value, 365000);
  ID("setting_close").click();
  convert.click();
});

document.addEventListener("DOMContentLoaded", () => {
  convert.click();
  if (getCookie("font_family")) {
    ID("font-select").value = getCookie("font_family");
  }
  if (getCookie("font_size")) {
    ID("font-size-select").value = getCookie("font_size");
  }
  if (getCookie("page")) {
    ID("page-select").value = getCookie("page");
  }
})

