const Templates = function() {

  RB.iconItemTemplate;
  RB.inputsTemplate;
  RB.progressBarTemplate;
  RB.listItemIconTemplate;

  RB.compileTemplates = function () {
    RB.iconItemCompiler();
    RB.inputsCompiler();
    RB.progressBarCompiler();
    RB.listItemIconCompiler();
  };

  RB.listItemIconCompiler = function() {
    let html = `<i class="animated zoomIn <%= icon %>"></i>`;

    return RB.listItemIconTemplate = _.template(html);
  };

  RB.progressBarCompiler = function() {
    let html = `
      <div class="progress-bar-container" id="list-progress">
        <div class="not-done" data-notDone="<%= _id %>">
          <p class="not-done-text"><%= notDoneText %></p>
        </div>
        <div class="done" data-done="<%= _id %>">
          <p class="done-text"><%= doneText %></p>
        </div>
      </div>`;

      return RB.progressBarTemplate = _.template(html);
  };

  RB.iconItemCompiler = function() {
    let html = `
        <div class="icon-option" data-icon="fa <%= icon %>">
          <i class="animated fadeIn fa <%= icon %>"></i>
          <p class="caption"><%= name %></p>
        </div>`;

    return RB.iconItemTemplate = _.template(html);
  };

  RB.inputsCompiler = function() {
    let html = `
        <form class="active-form">
          <div class="input-container">
            <div class="icon-container">
              <span class="icon-placeholder"><i class="fa fa-minus-square"></i></span>
            </div>
            <input type="text" class="activeInput list-input" name="list" placeholder="List">
            <div class="validation-container">
              <span class="kurt-loader">
                <p class="message"></p>
              </span>
              <span class="create-note-btn">
                <i class="fa fa-check-circle"></i>
              </span>
            </div>
            <div class="icon-dropdown">
              <div class="icon-arrow"></div>
              <div class="icon-select"></div>
            </div>
          </div>
          <div class="input-container">
            <textarea type="text" class="activeInput note-input" name="body" placeholder="New note..."></textarea>
          </div>
        </form>
        <div class="active-progress"></div>`;

    return RB.inputsTemplate = _.template(html);
  };

  return RB.compileTemplates();
};

Templates();