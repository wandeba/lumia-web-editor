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

  function freshStarterFiles() {
    return {
      html: { name: starterFiles.html.name, code: starterFiles.html.code, type: "html" },
      css: { name: starterFiles.css.name, code: starterFiles.css.code, type: "css" },
      js: { name: starterFiles.js.name, code: starterFiles.js.code, type: "js" }
    };
  }

  var files = freshStarterFiles();
  var extraFiles = {};
  var activeFile = "html";
  var projectName = "My lovely website";
  var editor = document.getElementById("codeInput");
  var tabsContainer = document.getElementById("fileTabs");
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

  function getEntry(key) {
    return files[key] || extraFiles[key] || null;
  }

  function getAllEntries() {
    var all = [];
    ["html", "css", "js"].forEach(function (key) {
      all.push({ key: key, entry: files[key] });
    });
    Object.keys(extraFiles).forEach(function (key) {
      all.push({ key: key, entry: extraFiles[key] });
    });
    return all;
  }

  function saveCurrentFile() {
    var entry = getEntry(activeFile);
    if (entry) entry.code = editor.value;
  }

  function updateLineCount() {
    var lines = editor.value.split("\n").length;
    lineCount.textContent = lines + (lines === 1 ? " line" : " lines");
  }

  function renderTabs() {
    tabsContainer.textContent = "";
    getAllEntries().forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "file-tab" + (item.key === activeFile ? " active" : "");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", item.key === activeFile ? "true" : "false");
      button.setAttribute("data-file-key", item.key);
      button.textContent = item.entry.name;
      tabsContainer.appendChild(button);
    });
  }

  function switchFile(fileKey) {
    saveCurrentFile();
    var entry = getEntry(fileKey);
    if (!entry) return;
    activeFile = fileKey;
    editor.value = entry.code;
    fileLabel.textContent = entry.name;
    renderTabs();
    renderFileList();
    updateLineCount();
    status.textContent = "Editing " + entry.name;
    setView("editor");
  }

  function buildPreview() {
    var extraCss = "";
    var extraJs = "";
    var extraHtml = "";
    Object.keys(extraFiles).forEach(function (key) {
      var item = extraFiles[key];
      if (item.type === "css") extraCss += "\n/* " + item.name.replace(/\*\//g, "") + " */\n" + item.code + "\n";
      if (item.type === "js") extraJs += "\n/* " + item.name.replace(/\*\//g, "") + " */\n" + item.code + "\n";
      if (item.type === "html") extraHtml += "\n<!-- Extra page fragment: " + item.name.replace(/--/g, "") + " -->\n" + item.code + "\n";
    });
    var css = files.css.code + extraCss;
    var js = files.js.code + extraJs;
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' +
      css.replace(/<\/style/gi, "<\\/style") +
      '</style></head><body>' + files.html.code + extraHtml +
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
    if (value) projectName = value;
    else {
      projectName = "My lovely website";
      nameInput.value = projectName;
    }
    document.getElementById("projectCardName").textContent = projectName;
  }

  function renderFileList() {
    var list = document.getElementById("fileList");
    list.textContent = "";
    var entries = getAllEntries();
    document.getElementById("fileTotal").textContent = entries.length + (entries.length === 1 ? " file" : " files");
    entries.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "file-list-row";
      var open = document.createElement("button");
      open.type = "button";
      open.className = "file-open" + (item.key === activeFile ? " current" : "");
      open.setAttribute("data-file-action", "open");
      open.setAttribute("data-file-key", item.key);
      var ext = item.entry.type || item.entry.name.split(".").pop();
      var kind = document.createElement("span");
      kind.className = "file-kind";
      kind.textContent = String(ext).toUpperCase();
      open.appendChild(kind);
      open.appendChild(document.createTextNode(item.entry.name));
      row.appendChild(open);

      if (extraFiles[item.key]) {
        var rename = document.createElement("button");
        rename.type = "button";
        rename.className = "file-manage-button";
        rename.textContent = "✎";
        rename.title = "Rename " + item.entry.name;
        rename.setAttribute("data-file-action", "rename");
        rename.setAttribute("data-file-key", item.key);
        row.appendChild(rename);

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "file-manage-button delete";
        remove.textContent = "×";
        remove.title = "Delete " + item.entry.name;
        remove.setAttribute("data-file-action", "delete");
        remove.setAttribute("data-file-key", item.key);
        row.appendChild(remove);
      }
      list.appendChild(row);
    });
  }

  function openDrawer() {
    updateProjectName();
    renderFileList();
    document.getElementById("editorNav").classList.remove("active");
    document.getElementById("previewNav").classList.remove("active");
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
    if (view === "preview") runPreview();
    closeDrawer();
  }

  function getProjectData() {
    saveCurrentFile();
    updateProjectName();
    return {
      version: 2,
      name: projectName,
      files: files,
      extraFiles: extraFiles,
      activeFile: activeFile
    };
  }

  function saveProject() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(getProjectData()));
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
      files.html.type = "html";
      files.css.type = "css";
      files.js.type = "js";
      extraFiles = data.extraFiles || {};
      projectName = data.name || "My lovely website";
      nameInput.value = projectName;
      document.getElementById("projectCardName").textContent = projectName;
      activeFile = data.activeFile && getEntry(data.activeFile) ? data.activeFile : "html";
      editor.value = getEntry(activeFile).code;
      fileLabel.textContent = getEntry(activeFile).name;
      savedLabel.textContent = "Saved draft found on this device";
      status.textContent = "Draft restored";
    } catch (error) {
      files = freshStarterFiles();
      extraFiles = {};
      activeFile = "html";
      footerStatus.textContent = "Starting a fresh project";
    }
  }

  function addFile() {
    saveCurrentFile();
    var input = document.getElementById("newFileName");
    var type = document.getElementById("newFileType").value;
    var name = input.value.replace(/^\s+|\s+$/g, "");
    if (!name) {
      input.focus();
      input.placeholder = "Type a file name first";
      return;
    }
    var extension = "." + type;
    if (name.toLowerCase().slice(-extension.length) !== extension) name += extension;
    var duplicate = getAllEntries().some(function (item) {
      return item.entry.name.toLowerCase() === name.toLowerCase();
    });
    if (duplicate) {
      window.alert("A file with that name already exists. Choose another name.");
      input.focus();
      return;
    }
    var key = "extra_" + String(Date.now()) + "_" + String(Object.keys(extraFiles).length + 1);
    var starter = type === "html"
      ? '<section class="' + name.replace(/[^a-z0-9_-]/gi, "-").replace(/^-+|-+$/g, "") + '">\n  <h2>New page section</h2>\n  <p>Write your HTML here.</p>\n</section>'
      : (type === "css" ? '/* Styles from ' + name + ' */\n.new-section {\n  padding: 16px;\n  border-radius: 12px;\n}' : '// JavaScript from ' + name + '\nconsole.log("Hello from ' + name.replace(/["\\]/g, "") + '");');
    extraFiles[key] = { name: name, code: starter, type: type };
    input.value = "";
    activeFile = key;
    editor.value = starter;
    fileLabel.textContent = name;
    renderTabs();
    renderFileList();
    updateLineCount();
    status.textContent = "Created " + name;
    footerStatus.textContent = "New file added · save your project to keep it";
  }

  function handleFileAction(button) {
    var key = button.getAttribute("data-file-key");
    var action = button.getAttribute("data-file-action");
    var entry = getEntry(key);
    if (!entry) return;
    if (action === "open") {
      switchFile(key);
      closeDrawer();
      return;
    }
    if (!extraFiles[key]) return;
    if (action === "rename") {
      var newName = window.prompt("New name for this file:", entry.name);
      if (newName === null) return;
      newName = newName.replace(/^\s+|\s+$/g, "");
      if (!newName) return;
      var type = entry.type;
      var ext = "." + type;
      if (newName.toLowerCase().slice(-ext.length) !== ext) newName += ext;
      var duplicate = getAllEntries().some(function (item) {
        return item.key !== key && item.entry.name.toLowerCase() === newName.toLowerCase();
      });
      if (duplicate) {
        window.alert("A file with that name already exists.");
        return;
      }
      entry.name = newName;
      renderTabs();
      renderFileList();
      fileLabel.textContent = entry.name;
      footerStatus.textContent = "File renamed · save your project to keep it";
    }
    if (action === "delete") {
      if (!window.confirm("Delete " + entry.name + "? This cannot be undone unless you have saved another copy.")) return;
      delete extraFiles[key];
      if (activeFile === key) {
        activeFile = "html";
        editor.value = files.html.code;
        fileLabel.textContent = files.html.name;
      }
      renderTabs();
      renderFileList();
      updateLineCount();
      footerStatus.textContent = "File deleted · save your project to keep the change";
    }
  }

  function resetProject() {
    if (!window.confirm("Restore the starter example? This replaces your current project files.")) return;
    files = freshStarterFiles();
    extraFiles = {};
    activeFile = "html";
    editor.value = files.html.code;
    renderTabs();
    renderFileList();
    switchFile("html");
    runPreview();
    savedLabel.textContent = "Starter example restored";
    footerStatus.textContent = "Starter example restored";
  }

  function exportHtml() {
    saveCurrentFile();
    updateProjectName();
    var blob = new Blob([buildPreview()], { type: "text/html;charset=utf-8" });
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

  tabsContainer.addEventListener("click", function (event) {
    var button = event.target.closest("[data-file-key]");
    if (button) switchFile(button.getAttribute("data-file-key"));
  });
  document.getElementById("fileList").addEventListener("click", function (event) {
    var button = event.target.closest("[data-file-action]");
    if (button) handleFileAction(button);
  });
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
  document.getElementById("addFileButton").addEventListener("click", addFile);
  nameInput.addEventListener("input", updateProjectName);

  loadProject();
  renderTabs();
  renderFileList();
  if (!editor.value) editor.value = getEntry(activeFile).code;
  updateLineCount();
  runPreview();
}());
