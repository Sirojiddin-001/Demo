let toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ],

  [{
      indent: "-1",
    },
    {
      indent: "+1",
    },
  ],
  [{
    'color': ["#000003", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0000ff", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"]
  }],

  [{
    align: [],
  }, ],

  ["clean"],
];



const quillEditor = new Quill("#editor", {
  modules: {
    toolbar: toolbarOptions,
    keyboard: {
      bindings: {
        indent: {
          key: 9,
          format: ['blockquote', 'indent', 'list'],
          handler: function (range, context) {
            this.quill.format('indent', '+1', Quill.sources.USER);
          }
        },
      }
    }
  },
  theme: "snow",
});


document.getElementById("editor_block").addEventListener("paste", function (e) {
  e.preventDefault();
  let text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});