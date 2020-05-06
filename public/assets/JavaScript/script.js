$(document).ready(() => {
  let issueList = $("#issue-list");
  let submit = $("#sub");

  //Fetches all Issues tracked by the server
  getIssues = () => {
    return $.ajax({
      url: "/api/issue",
      method: "GET",
    });
  };
  //Uploads new Issue to be tracked
  saveIssue = (issue) => {
    return $.ajax({
      url: "/api/issue",
      data: issue,
      method: "POST",
    });
  };
  //Remove specific Issue from tracking
  deleteIssue = (id) => {
    return $.ajax({
      url: "/api/issue/" + id,
      method: "DELETE",
    });
  };
  //Update specific Issue being tracked
  updateIssue = (id) => {
    return $.ajax({
      url: "/api/issue/" + id,
      method: "PUT",
    });
  };

  // Upload new issue and re-render
  handleUpload = () => {
    if ($("#Title").val() < 1 || $("#Content").val() < 1) {
      alert("Please Fill out remaining form values before submitting!");
    } else {
      let percent = $("#Progress").val();
      switch (percent) {
        case "20%":
          percent = 20;
          break;
        case "40%":
          percent = 40;
          break;
        case "60%":
          percent = 60;
          break;
        case "80%":
          percent = 80;
          break;
        case "100%":
          percent = 100;
          break;
        default:
          percent = 40;
      }
      let newIssue = {
        title: $("#Title").val(),
        content: $("#Content").val(),
        progress: percent,
      };

      $("#Title").val("");
      $("#Content").val("");

      saveIssue(newIssue).then((data) => {
        fetchAndRender();
      });
    }
  };
  // Remove tracked issue and re-render
  handleDelete = (id) => {
    deleteIssue(id).then((data) => {
      fetchAndRender();
    });
  };
  // Update Issue and re-render
  handleUpdate = (id) => {
    updateIssue(id).then((data) => {
      fetchAndRender();
    });
  };

  // Render data related to tracked issues
  renderIssues = (data) => {
    if (data.length != 0) {
      issueList.empty();
      let issueListItems = [];

      for (let i = 0; i < data.length; i++) {
        let issue = data[i];

        //Card
        let card = $("<div class='card' >");
        let header = $("<div class='card-header' >"); //title
        header.text(issue.title);
        let body = $("<div class='card-body' >");
        let text = $("<p class='card-text' >"); //content
        text.text(issue.content);

        // Buttons
        let progressBTN = $("<button class='btn btn-success'>");
        let deleteBTN = $("<button class='btn btn-danger'>");
        progressBTN.text("Progress Project");
        deleteBTN.text("Delete");
        deleteBTN.click((e) => {
          e.preventDefault();
          handleDelete(issue.id);
        });
        progressBTN.click((e) => {
          e.preventDefault();
          handleUpdate(issue.id);
        });

        //Progress-bar
        if(issue.progress>100){
            issue.progress = 100;
        }
        let bar = $("<div class='progress' >");
        let slider = $(
          "<div class='progress-bar progress-bar-info' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:" +
            issue.progress +
            "%'>"
        );
        slider.text(issue.progress + "% complete");
        bar.append(slider);

        body.append(text, bar, progressBTN, deleteBTN);
        card.append(header, body);
        issueListItems.push(card);
      }
      issueList.append(issueListItems);
    } else {
      issueList.empty("");
    }
  };
  fetchAndRender = () => {
    getIssues().then((data) => {
      renderIssues(data);
    });
  };

  submit.click((e) => {
    e.preventDefault();
    handleUpload();
  });
  fetchAndRender();
});
