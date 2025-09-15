document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('user-form');
  const resultDiv = document.getElementById('result');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    let answerHTML = '<h2>Your Answers:</h2><ul>';
    let imageHTML = '';
    let fileHandled = false;

    for (let [key, value] of formData.entries()) {
      // Skip empty file field for cleaner output
      if (form.elements[key] && form.elements[key].type === 'file') {
        if (value && value.name) {
          // Prepare for FileReader but show answer in list
          answerHTML += `<li><strong>${labelize(key)}:</strong> ${value.name}</li>`;
          imageHTML = `<p>Preview Of Image:</p>`;
          fileHandled = true;
        } else {
          answerHTML += `<li><strong>${labelize(key)}:</strong> Not provided</li>`;
        }
      } else if (typeof value === "string" && value.trim() === "") {
        answerHTML += `<li><strong>${labelize(key)}:</strong> Not provided</li>`;
      } else {
        answerHTML += `<li><strong>${labelize(key)}:</strong> ${escapeHtml(value)}</li>`;
      }
    }
    answerHTML += '</ul>';

    // Thank you message
    const thankYouHTML = '<h3>Thank You For Submitting The Form!</h3>';

    // Display static image IF no file input exists, else will be replaced below
    let staticImgHTML = '';
    if (!fileHandled) {
      // fallback image
      staticImgHTML = `<img src="imgs/cuff1.png" id="cuff">`;
    }

    resultDiv.innerHTML = answerHTML + imageHTML + staticImgHTML + thankYouHTML;

    // Handle previewing the uploaded image if available
    if (fileHandled) {
      const fileInput = form.querySelector('input[type="file"]');
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // Insert uploaded image in preview
          const imgTag = `<img src="${e.target.result}" alt="Uploaded" style="max-width:200px;display:block;margin:1em 0;">`;
          resultDiv.innerHTML = answerHTML + imageHTML + imgTag + thankYouHTML;
        };
        reader.readAsDataURL(file);
      }
    }

    // Optionally, hide the form after submit:
    form.style.display = 'none';
  });

  // Helper to beautify label
  function labelize(name) {
    return name
      .replace(/([A-Z])/g, ' $1')        // insert space before caps
      .replace(/^./, str => str.toUpperCase());
  }

  // Helper to escape HTML (for textarea especially)
  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function (m) {
      return ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[m];
    });
  }
});