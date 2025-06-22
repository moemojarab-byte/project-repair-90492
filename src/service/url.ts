declare global {
  interface Window {
    globalConfig: {
      mode: string;
    };
  }
}
// const panelServiceBaseUrl = "http://192.168.0.113:8075/api/v1";
// const panelServiceBaseUrl = "https://repairservice.baaz.ir/api/v1";
const serverTestIp = "http://192.168.0.113";
const panelServiceBaseUrl =
  window.globalConfig?.mode === "production"
    ? "https://repairservice.baaz.ir/api/v1"
    : `${serverTestIp}:8091/api/v1`;
// =========================================================================
export const proxyServerUrl = {
  copServer: "https://copserver.copapp.ir",

  // authentication Controller
  login: `${panelServiceBaseUrl}/Users/Token`,

  // file infos
  removeFileFromFolderById: `${panelServiceBaseUrl}/FileInfos/RemoveFileFromFolderById`,
  getFilesWithPagination: `${panelServiceBaseUrl}/FileInfos/GetFilesWithPagination`,
  uploadFileToFolder: `${panelServiceBaseUrl}/FileInfos/UploadFileToFolder`,
  getFileById: `${panelServiceBaseUrl}/FileInfos/GetFileById`,
  uploadFile: `${panelServiceBaseUrl}/FileInfos/UploadFile`,

  // car Controller
  deleteAddressRepair: `${panelServiceBaseUrl}/Car/DeleteAddress/`,
  getCarById: `${panelServiceBaseUrl}/Car/GetCarById/`,
  getCarsRepair: `${panelServiceBaseUrl}/Car/GetCars`,
  updateCar: `${panelServiceBaseUrl}/Car/UpdateCar`,
  createCar: `${panelServiceBaseUrl}/Car/CreateCar`,
  getCars: `${panelServiceBaseUrl}/Car/GetCars`,

  // repair Controller
  getRepairReceptionForUpdateById: `${panelServiceBaseUrl}/Repair/GetRepairReceptionForUpdateById/`,
  generateRepairReceptionFactors: `${panelServiceBaseUrl}/Repair/GenerateRepairReceptionFactors`,
  dischargeRepairReception: `${panelServiceBaseUrl}/Repair/DischargeRepairReception`,
  repairReceptionSummary: `${panelServiceBaseUrl}/Repair/repair-reception-summary`,
  createRepairReception: `${panelServiceBaseUrl}/Repair/CreateRepairReception`,
  updateRepairReception: `${panelServiceBaseUrl}/Repair/UpdateRepairReception`,
  deleteRepairReception: `${panelServiceBaseUrl}/Repair/DeleteRepairReception`,
  getRepairReceptions: `${panelServiceBaseUrl}/Repair/GetRepairReceptions`,
  changeIsCancelled: `${panelServiceBaseUrl}/Repair/ChangeIsCancelled`,
  getCustomerCars: `${panelServiceBaseUrl}/Repair/GetCustomerCars/`,
  salesViewByCustomerAndByCarId: `${panelServiceBaseUrl}/Repair`,
  scanProduct: `${panelServiceBaseUrl}/Repair/ScanProduct`,

  // customer Controller
  getCustomers: `${panelServiceBaseUrl}/Customer/GetCustomersV2`,

  // user Controller
  getCurrentUserAccesses: `${panelServiceBaseUrl}/UserSecurity/GetCurrentUserAccesses`,

  // RepairServices Controller
  getAllRepairServices: `${panelServiceBaseUrl}/RepairServices/GetAllRepairServices`,
  getRepairServiceById: `${panelServiceBaseUrl}/RepairServices/GetRepairServiceById`,
  createRepairService: `${panelServiceBaseUrl}/RepairServices/CreateRepairService`,
  updateRepairService: `${panelServiceBaseUrl}/RepairServices/UpdateRepairService`,
  deleteRepairService: `${panelServiceBaseUrl}/RepairServices/DeleteRepairService`,

  // mechanic Controller
  getActiveMechanics: `${panelServiceBaseUrl}/Mechanic/GetActiveMechanics`,
  getAllMechanics: `${panelServiceBaseUrl}/Mechanic/GetAllMechanics`,
  getMechanicById: `${panelServiceBaseUrl}/Mechanic/GetMechanicById`,
  createMechanic: `${panelServiceBaseUrl}/Mechanic/CreateMechanic`,
  updateMechanic: `${panelServiceBaseUrl}/Mechanic/UpdateMechanic`,
  deleteMechanic: `${panelServiceBaseUrl}/Mechanic/DeleteMechanic`,

  // repairMechanicLeaves Controller
  getMechanicLeaveByMechanicId: `${panelServiceBaseUrl}/RepairMechanicLeaves/GetMechanicLeaveByMechanicId`,
  geMechanicLeavetByDateRange: `${panelServiceBaseUrl}/RepairMechanicLeaves/GeMechanicLeavetByDateRange`,
  createRepairMechanicLeave: `${panelServiceBaseUrl}/RepairMechanicLeaves/CreateRepairMechanicLeave`,
  updateRepairMechanicLeave: `${panelServiceBaseUrl}/RepairMechanicLeaves/UpdateRepairMechanicLeave`,
  deleteRepairMechanicLeave: `${panelServiceBaseUrl}/RepairMechanicLeaves/DeleteRepairMechanicLeave`,
  getMechanicLeaveById: `${panelServiceBaseUrl}/RepairMechanicLeaves/GetMechanicLeaveById`,
  getAllMechanicLeave: `${panelServiceBaseUrl}/RepairMechanicLeaves/GetAllMechanicLeave`,

  // repairService Controller
  getCustomerProblemById: `${panelServiceBaseUrl}/RepairServices/GetCustomerProblemById`,
  createCustomerProblem: `${panelServiceBaseUrl}/RepairServices/CreateCustomerProblem`,
  deleteCustomerProblem: `${panelServiceBaseUrl}/RepairServices/DeleteCustomerProblem`,
  updateCustomerProblem: `${panelServiceBaseUrl}/RepairServices/UpdateCustomerProblem`,
  getCustomerProblems: `${panelServiceBaseUrl}/RepairServices/GetCustomerProblems`,

  // RepairReceptionService Controller
  getAllRepairReceptionServices: `${panelServiceBaseUrl}/RepairReceptionService/GetRepairReceptionServicesGroupedByProblems`,
  createRepairReceptionService: `${panelServiceBaseUrl}/RepairReceptionService/CreateRepairReceptionServicesForProblems`,
  getRepairReceptionServiceById: `${panelServiceBaseUrl}/RepairReceptionService/GetRepairReceptionServiceById`,
  updateRepairReceptionService: `${panelServiceBaseUrl}/RepairReceptionService/UpdateRepairReceptionService`,
  deleteRepairReceptionService: `${panelServiceBaseUrl}/RepairReceptionService/DeleteRepairReceptionService`,

  // RepairProductRequest Controller
  getRepairProductRequestsByReceptionId: `${panelServiceBaseUrl}/RepairProductRequest/GetRepairProductRequestsByReceptionId`,
  getRepairProductRequestsByProblemId: `${panelServiceBaseUrl}/RepairProductRequest/GetRepairProductRequestsByProblemId`,
  getPendingRepairProductRequests: `${panelServiceBaseUrl}/RepairProductRequest/GetPendingRepairProductRequests`,
  createBatchRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/CreateBatchRepairProductRequest`,
  batchReviewRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/BatchReviewRepairProductRequest`,
  getRepairProductRequestSummary: `${panelServiceBaseUrl}/RepairProductRequest/GetRepairProductRequestSummary`,
  addApprovedProductsToReception: `${panelServiceBaseUrl}/RepairProductRequest/AddApprovedProductsToReception`,
  getRepairProductRequestById: `${panelServiceBaseUrl}/RepairProductRequest/GetRepairProductRequestById`,
  createRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/CreateRepairProductRequest`,
  updateRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/UpdateRepairProductRequest`,
  deleteRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/DeleteRepairProductRequest`,
  reviewRepairProductRequest: `${panelServiceBaseUrl}/RepairProductRequest/ReviewRepairProductRequest`,
  getOutOfStockRequests: `${panelServiceBaseUrl}/RepairProductRequest/GetOutOfStockRequests`,
};
