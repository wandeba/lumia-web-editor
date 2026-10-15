(function () {
  "use strict";

  var starterFiles = {
    html: {
      name: "index.html",
      code: '<main class="demo">\n  <div class="sparkle">✿</div>\n  <h1>Hello, Lumia!</h1>\n  <p>Your little web project starts here.</p>\n  <button onclick="document.getElementById(\'message\').textContent=\'You made it work! ♡\'">Tap me</button>\n  <p id="message"></p>\n</main>'
    },
    css: {
      name: "style.css",
      code: 'body {\n  margin: 0;\n  padding: 24px;\n  font-family: Arial, sans-serif;\n  text-align: center;\n  background: #fff4fa;\n  color: #49364f;\n}\n.demo { max-width: 420px; margin: 24px auto; }\n.sparkle { color: #df77ae; font-size: 36px; }\nbutton { padding: 12px 18px; border: 0; border-radius: 12px; background: #e879b1; color: white; }'
    },
    js: {
      name: "script.js",
      code: 'console.log("Hello from Lumia Web Editor! ♡");'
    }
  };

  var files = {
    html: { name: starterFiles.html.name, code: starterFiles.html.code },
    css: { name: starterFiles.css.name, code: starterFiles.css.code },
    js: { name: starterFiles.js.name, code: starterFiles.js.code }
  };
  var activeFile = "html";
  var projectName = "My lovely website";
  var editor = document.getElementById("codeInput");
  var tabs = document.querySelectorAll(".file-tab");
  var status = document.getElementById("statusText");
  var footerStatus = document.getElementById("footerStatus");
  var lineCount = document.getElementById("lineCount");
  var fileLabel = document.getElementById("fileLabel");
  var preview = document.getElementById("previewFrame");
  var mainArea = document.getElementById("mainArea");
  var drawer = document.getElementById("projectDrawer");
  var shade = document.getElementById("drawerShade");
  var nameInput = document.getElementById("projectName");
  var savedLabel = document.getElementById("savedLabel");
  var storageKey = "lumiaWebEditorProjectV1";

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
    for (var i = 0; i < tabs.length; i++) {
      var selected = tabs[i].getAttribute("data-file") === fileKey;
      tabs[i].classList.toggle("active", selected);
      tabs[i].setAttribute("aria-selected", selected ? "true" : "false");
    }
    updateLineCount();
    status.textContent = "Editing " + files[fileKey].name;
  }

  function buildPreview() {
    var html = files.html.code;
    var css = files.css.code;
    var js = files.js.code;
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
      css.replace(/<\/style/gi, "<\\/style") +
      '</style></head><body>' + html +
      '<script>try {' + js.replace(/<\/script/gi, "<\\/script") +
      '} catch (e) { document.body.insertAdjacentHTML("beforeend", "<pre>" + String(e) + "</pre>"); }<\/script></body></html>';
  }

  function runPreview() {
    saveCurrentFile();
    preview.srcdoc = buildPreview();
    status.textContent = "Preview updated";
    footerStatus.textContent = "Preview refreshed locally ♡";
  }

  function updateProjectName() {
    var value = nameInput.value.replace(/^\s+|\s+$/g, "");
    if (value) {
      projectName = value;
    } else {
      projectName = "My lovely website";
      nameInput.value = projectName;
    }
    document.getElementById("projectCardName").textContent = projectName;
  }

  function openDrawer() {
    updateProjectName();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    shade.hidden = false;
    document.getElementById("projectsNav").classList.add("active");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    shade.hidden = true;
    document.getElementById("projectsNav").classList.remove("active");
  }

  function setView(view) {
    mainArea.classList.remove("view-editor", "view-preview");
    mainArea.classList.add(view === "preview" ? "view-preview" : "view-editor");
    document.getElementById("editorNav").classList.toggle("active", view === "editor");
    document.getElementById("previewNav").classList.toggle("active", view === "preview");
    if (view === "preview") {
      runPreview();
    }
    closeDrawer();
  }

  function getProjectData() {
    saveCurrentFile();
    updateProjectName();
    return {
      version: 1,
      name: projectName,
      files: files,
      activeFile: activeFile
    };
  }

  function saveProject() {
    try {
      var data = getProjectData();
      window.localStorage.setItem(storageKey, JSON.stringify(data));
      savedLabel.textContent = "Saved on this device just now";
      footerStatus.textContent = "Project saved on this device ♡";
      status.textContent = "Saved";
    } catch (error) {
      savedLabel.textContent = "Browser storage is unavailable";
      footerStatus.textContent = "Could not save; try Export HTML";
    }
  }

  function loadProject() {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || !data.files || !data.files.html || !data.files.css || !data.files.js) return;
      files = data.files;
      projectName = data.name || "My lovely website";
      nameInput.value = projectName;
      document.getElementById("projectCardName").textContent = projectName;
      activeFile = data.activeFile && files[data.activeFile] ? data.activeFile : "html";
      editor.value = files[activeFile].code;
      fileLabel.textContent = files[activeFile].name;
      savedLabel.textContent = "Saved draft found on this device";
      status.textContent = "Draft restored";
    } catch (error) {
      footerStatus.textContent = "Starting a fresh project";
    }
  }

  function resetProject() {
    var confirmed = window.confirm("Restore the starter example? This replaces the current editor contents.");
    if (!confirmed) return;
    files = {
      html: { name: starterFiles.html.name, code: starterFiles.html.code },
      css: { name: starterFiles.css.name, code: starterFiles.css.code },
      js: { name: starterFiles.js.name, code: starterFiles.js.code }
    };
    activeFile = "html";
    editor.value = files.html.code;
    switchFile("html");
    runPreview();
    savedLabel.textContent = "Starter example restored";
    footerStatus.textContent = "Starter example restored";
  }

  function exportHtml() {
    saveCurrentFile();
    updateProjectName();
    var fullHtml = buildPreview();
    var blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    var url = window.URL.createObjectURL(blob);
    var link = document.createElement("a");
    var safeName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "my-website";
    link.href = url;
    link.download = safeName + ".html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { window.URL.revokeObjectURL(url); }, 1000);
    footerStatus.textContent = "HTML export requested";
  }

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
      switchFile(this.getAttribute("data-file"));
    });
  }

  editor.addEventListener("input", function () {
    updateLineCount();
    footerStatus.textContent = "Unsaved edits · tap Projects to save";
  });
  document.getElementById("runButton").addEventListener("click", runPreview);
  document.getElementById("refreshButton").addEventListener("click", runPreview);
  document.getElementById("editorNav").addEventListener("click", function () { setView("editor"); });
  document.getElementById("previewNav").addEventListener("click", function () { setView("preview"); });
  document.getElementById("projectsNav").addEventListener("click", openDrawer);
  document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
  shade.addEventListener("click", closeDrawer);
  document.getElementById("saveProject").addEventListener("click", saveProject);
  document.getElementById("downloadProject").addEventListener("click", exportHtml);
  document.getElementById("resetProject").addEventListener("click", resetProject);
  nameInput.addEventListener("input", updateProjectName);

  loadProject();
  if (!editor.value) editor.value = files[activeFile].code;
  updateLineCount();
  runPreview();
}());
