(function () {
  "use strict";

  var files = {
    html: {
      name: "index.html",
      code: '<main class="demo">\n  <h1>Hello, Lumia!</h1>\n  <p>Your web project starts here.</p>\n  <button onclick="document.getElementById(\'message\').textContent=\'It works!\'">Tap me</button>\n  <p id="message"></p>\n</main>'
    },
    css: {
      name: "style.css",
      code: 'body {\n  margin: 0;\n  padding: 24px;\n  font-family: Arial, sans-serif;\n  background: #f2f7f8;\n  color: #17232d;\n}\n.demo { max-width: 420px; margin: 0 auto; }\nbutton { padding: 12px 18px; border: 0; border-radius: 8px; background: #087f70; color: white; }'
    },
    js: {
      name: "script.js",
      code: 'console.log("Hello from Lumia Web Editor!");'
    }
  };

  var activeFile = "html";
  var editor = document.getElementById("codeInput");
  var tabs = document.querySelectorAll(".file-tab");
  var status = document.getElementById("statusText");
  var footerStatus = document.getElementById("footerStatus");
  var lineCount = document.getElementById("lineCount");
  var fileLabel = document.getElementById("fileLabel");
  var preview = document.getElementById("previewFrame");

  function saveCurrentFile() {
    files[activeFile].code = editor.value;
  }

  function updateLineCount() {
    var lines = editor.value.split("\n").length;
    lineCount.textContent = lines + (lines === 1 ? " line" : " lines");
  }

  function switchFile(fileKey) {
    saveCurrentFile();
    activeFile = fileKey;
    editor.value = files[fileKey].code;
    fileLabel.textContent = files[fileKey].name;
    tabs.forEach(function (tab) {
      var selected = tab.getAttribute("data-file") === fileKey;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
    });
    updateLineCount();
    status.textContent = "Editing " + files[fileKey].name;
  }

  function runPreview() {
    saveCurrentFile();
    var html = files.html.code;
    var css = files.css.code;
    var js = files.js.code;
    var documentText = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
      css.replace(/<\/style/gi, "<\\/style") +
      '</style></head><body>' + html +
      '<script>try {' + js.replace(/<\/script/gi, "<\\/script") +
      '} catch (e) { document.body.insertAdjacentHTML("beforeend", "<pre>" + String(e) + "</pre>"); }<\/script></body></html>';
    preview.srcdoc = documentText;
    status.textContent = "Preview updated";
    footerStatus.textContent = "Preview refreshed locally";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchFile(tab.getAttribute("data-file"));
    });
  });

  editor.addEventListener("input", updateLineCount);
  document.getElementById("runButton").addEventListener("click", runPreview);
  document.getElementById("refreshButton").addEventListener("click", runPreview);

  editor.value = files[activeFile].code;
  updateLineCount();
  runPreview();
}());
