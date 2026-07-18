async function formUpload(file) {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log(data);

  return {
    ok: response.ok,
    data,
  };
}

document.getElementById("fileInput").addEventListener("change", (event) => {
  const fileName =
    event.target.files[0]?.name || "No file selected";

  document.getElementById("fileName").textContent = fileName;
});

document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");
    const file = fileInput.files[0];

    if (!file) {
      status.textContent = "No file selected";
      return;
    }

    status.textContent = "Uploading...";

    try {
      const result = await formUpload(file);

      if (result.ok) {
        status.textContent = "Success!";
      } else {
        status.textContent =
          "Failure: " +
          (result.data.message || "Unknown error");
      }
    } catch (error) {
      status.textContent = "Failure uploading file";
      console.error("Upload error:", error);
    }
  });