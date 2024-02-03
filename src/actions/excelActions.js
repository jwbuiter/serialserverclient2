import axios from "axios";

export const downloadExcel = () => {
  window.location.href = "/downloadExcel";
};

export const uploadExcel = (file, overwrite) => {
  const data = new FormData();
  data.append("excelFile", file);
  axios
    .post(overwrite ? "/importExcel" : "/updateExcel", data)
    .then(() => window.alert("Successfully uploaded Excel file."))
    .catch(() => window.alert("Error uploading Excel file."));
};

export const transferExcel = async (host) => {
  let response;
  try {
    response = await axios({
      method: "get",
      responseType: "arraybuffer",
      url: "/downloadExcel",
    });
  } catch (e) {
    window.alert("Failed to download excel: " + e);
    throw e;
  }

  const data = new FormData();
  data.append("excelFile", new File([response.data], "downloaded.xls"));
  try {
    await axios({
      method: "post",
      url: "http://" + host + "/importExcel",
      data,
    });
    window.alert("Successfully uploaded Excel file.");
  } catch (e) {
    window.alert("Failed to upload excel: " + e);
    throw e;
  }
};

export const uploadExcelTemplate = () => {
  const uploadFunction = (event) => {
    const data = new FormData();
    data.append("templateFile", event.target.files[0]);
    axios
      .post("/importTemplate", data)
      .then(() => window.alert("Successfully imported Excel template."))
      .catch(() => window.alert("Error uploading Excel template."));
  };
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xls,.xlsx";
  input.onchange = uploadFunction;
  input.click();
};
