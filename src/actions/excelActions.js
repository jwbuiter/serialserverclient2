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
