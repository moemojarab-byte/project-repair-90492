import { Grid2 as Grid, Typography, Tabs, Tab, Box } from "@mui/material";
import { FC, useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";

import { getCustomers } from "@/service/customer/customer.service";
import useFileUpload from "@/hooks/useFileUpload";
import {
  getRepairReceptionForUpdateById,
  createRepairReception,
  updateRepairReception,
  getCustomerCars,
} from "@/service/repair/repair.service";
import {
  RepairReceptionProducts,
  RepairReceptionService,
  PlateManagementDialog,
  CustomerProblems,
  EnhancedSelect,
  FileUploader,
  Loading,
  Button,
} from "@/components";

interface IServiceAdmissionFormProps {
  repairReceptionId?: string;
}

const ServiceAdmissionForm: FC<IServiceAdmissionFormProps> = ({
  repairReceptionId,
}) => {
  const [customerOptions, setCustomerOptions] = useState<SelectOption[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<number[]>([]);
  const [showNewPlateDialog, setShowNewPlateDialog] = useState(false);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { upload, uploadMultiple, isUploading, uploadError } = useFileUpload({
    onSuccess: (response) => {
      if (response?.isSuccess && response?.data?.id) {
        setUploadedFileIds((prev) => [...prev, response.data.id]);
        toast.success("فایل با موفقیت آپلود شد");
      }
    },
    onError: () => {
      toast.error("خطا در آپلود فایل");
    },
  });
  const {
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<IServiceAdmissionForm>({
    defaultValues: {
      preferredRepairTime: undefined,
      notifyWarehouseManager: false,
      notifyWorkshopManager: true,
      isReturnedVehicle: false,
      notifyManagement: true,
      customerId: undefined,
      carId: undefined,
      files: [],
    },
  });
  const {
    mutateAsync: fetchRepairReception,
    isPending: isFetchingRepairReception,
  } = useMutation({
    mutationFn: getRepairReceptionForUpdateById,
    onSuccess: (data: any) => {
      if (data?.isSuccess && data?.data) {
        const repairData = data.data;
        setValue("customerId", repairData.customerId);
        setValue("carId", repairData.carId);
        if (repairData.customerId) {
          mutateAsyncCustomerCars(repairData.customerId);
        }
        if (repairData.customerName) {
          setCustomerOptions([
            {
              label: repairData.customerName,
              value: repairData.customerId,
            },
          ]);
        }
        setInitialDataLoaded(true);
      } else {
        toast.error(data?.message || "خطا در دریافت اطلاعات پذیرش");
      }
    },
  });
  const { mutateAsync: searchCustomers, isPending: isSearchingCustomers } =
    useMutation({
      mutationFn: getCustomers,
      onSuccess: (data) => {
        const customerOptions = data?.data?.map((i: any) => ({
          label: i?.fullName,
          value: i.customerId,
        }));
        setCustomerOptions(customerOptions || []);
      },
    });
  const {
    mutateAsync: mutateAsyncCustomerCars,
    isPending: isPendingCustomerCars,
  } = useMutation({
    mutationFn: getCustomerCars,
    onSuccess: (data: any) => {
      if (data?.isSuccess) {
        const cars = data?.data?.map((i: any) => ({
          label: `${i.plateSection1}${i.plateSection2}${i.plateSection3}-ایران${i.plateSection4}`,
          value: i.id,
        }));
        setCustomerVehicles(cars);
      } else {
        toast?.error(data?.message);
      }
    },
  });
  const {
    mutateAsync: mutateAsyncCreateRepairReception,
    isPending: isPendingCreateRepairReception,
    data: createRepairReceptionData,
  } = useMutation({
    mutationFn: createRepairReception,
    onSuccess: (data: any) => {
      if (data?.isSuccess) {
        toast.success(data?.message);
        reset();
      } else {
        toast?.error(data?.message);
      }
    },
  });
  const {
    mutateAsync: mutateAsyncUpdateRepairReception,
    isPending: isPendingUpdateRepairReception,
  } = useMutation({
    mutationFn: updateRepairReception,
    onSuccess: (data: any) => {
      if (data?.isSuccess) {
        toast.success(data?.message || "پذیرش با موفقیت بروزرسانی شد");
      } else {
        toast?.error(data?.message);
      }
    },
  });
  const handleCustomerChange = (value: any) => {
    console.log(value);
    if (value?.value) {
      mutateAsyncCustomerCars(value.value);
    }
  };
  const handleCustomerSearch = (searchText: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (searchText && searchText.length >= 2) {
        searchCustomers(searchText);
      }
    }, 300);
  };
  const handleAddNewPlate = () => {
    setShowNewPlateDialog(true);
  };
  const handleCloseNewPlateDialog = () => {
    setShowNewPlateDialog(false);
  };
  const handlePlateSuccess = () => {
    const customerId = watch("customerId");
    if (customerId) {
      mutateAsyncCustomerCars(customerId);
    }
  };
  const handleFilesChange = async (files: File[]) => {
    const currentFiles = watch("files") || [];
    const newFiles = files.filter(
      (file) =>
        !currentFiles.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        )
    );
    setValue("files", files, { shouldValidate: true });
    if (newFiles.length > 0) {
      try {
        if (newFiles.length === 1) {
          await upload(newFiles[0]);
        } else {
          await uploadMultiple(newFiles);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const onSubmit = () => {
    if (isEditMode && repairReceptionId) {
      mutateAsyncUpdateRepairReception({
        repairReception: {
          repairReceptionId: Number(repairReceptionId),
          customerId: watch("customerId"),
          carId: watch("carId"),
        },
      });
    } else {
      mutateAsyncCreateRepairReception({
        repairReception: {
          customerId: watch("customerId"),
          carId: watch("carId"),
        },
      });
    }
  };
  useEffect(() => {
    if (repairReceptionId && !isEditMode) {
      setIsEditMode(true);
      fetchRepairReception(+repairReceptionId);
    }
  }, [repairReceptionId, isEditMode, fetchRepairReception]);
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  const isLoading =
    isPendingCreateRepairReception ||
    isPendingUpdateRepairReception ||
    isFetchingRepairReception;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <Loading />}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <EnhancedSelect
            helperText={errors.customerId?.message as string}
            loading={isSearchingCustomers}
            error={!!errors.customerId}
            options={customerOptions}
            enableSpeechToText={true}
            iconPosition="end"
            searchable={true}
            name="customerId"
            disabled={false}
            label="مشتری"
            isRtl={true}
            control={control}
            storeValueOnly={true}
            onChange={handleCustomerChange}
            onInputChange={handleCustomerSearch}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EnhancedSelect
            helperText={errors.carId?.message as string}
            onInputChange={(value) => {
              console.log("Vehicle search input:", value);
            }}
            placeholder="جستجوی پلاک خودرو"
            error={!!errors.carId}
            loading={isPendingCustomerCars}
            options={customerVehicles}
            control={control}
            storeValueOnly={true}
            enableSpeechToText
            searchable={true}
            label="پلاک خودرو"
            name="carId"
            isRtl
          />
          <Box className="mb-2 flex justify-end mt-2 items-center">
            <Button
              disabled={watch("customerId") === undefined}
              onClick={handleAddNewPlate}
              startIcon={<Add />}
              variant="outlined"
              size="small"
            >
              افزودن پلاک جدید
            </Button>
          </Box>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 4 }}>
          <EnhancedInput
            helperText={errors.preferredRepairTime?.message as string}
            error={!!errors.preferredRepairTime}
            enableSpeechToText={false}
            name="preferredRepairTime"
            label="زمان ترجیحی تعمیر"
            icon={<span>روز</span>}
            type="datetime-local"
            iconPosition="end"
            isTextArea
            fullWidth
            rows={1}
          />
        </Grid> */}
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            disabled={
              (!watch("carId") &&
                watch("carId") !== 0 &&
                !watch("isReturnedVehicle")) ||
              isUploading ||
              (isEditMode && !initialDataLoaded)
            }
          >
            {isEditMode ? "بروزرسانی پذیرش" : "ثبت پذیرش"}
          </Button>
        </Grid>
        {isEditMode || createRepairReceptionData?.isSuccess ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="service tabs"
              >
                <Tab label="مشکلات" />
                <Tab label="تعمیرات" />
                <Tab label="قطعات" />
                <Tab label="مستندات" />
              </Tabs>
            </Box>

            {/* تب مشکلات */}
            {activeTab === 0 && (
              <CustomerProblems repairReceptionId={repairReceptionId} />
            )}

            {/* تب تعمیرات */}
            {activeTab === 1 && (
              <RepairReceptionService repairReceptionId={repairReceptionId} />
            )}

            {/* تب قطعات */}
            {activeTab === 2 && (
              <RepairReceptionProducts repairReceptionId={repairReceptionId} />
            )}

            {/* تب مستندات */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" className="mb-4">
                  مستندات
                </Typography>
                <Grid size={{ xs: 12 }}>
                  <Box className="mt-4">
                    <Typography variant="subtitle1" className="mb-2">
                      آپلود فایل
                    </Typography>
                    <Controller
                      name="files"
                      control={control}
                      render={({ field }) => (
                        <FileUploader
                          onFilesChange={handleFilesChange}
                          error={!!errors.files}
                          files={field.value}
                          multiple={true}
                          helperText={
                            uploadError
                              ? `خطا در آپلود: ${uploadError}`
                              : (errors.files?.message as string)
                          }
                        />
                      )}
                    />
                    {uploadedFileIds.length > 0 && (
                      <Box className="mt-2">
                        <Typography variant="caption" color="success.main">
                          {uploadedFileIds.length} فایل با موفقیت آپلود شده است
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Box>
            )}
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
      <PlateManagementDialog
        description="لطفا اطلاعات خودرو جدید را برای مشتری انتخاب شده وارد کنید."
        onClose={handleCloseNewPlateDialog}
        customerId={watch("customerId")}
        onSuccess={handlePlateSuccess}
        open={showNewPlateDialog}
        title="ثبت پلاک جدید"
        mode="add"
      />
    </form>
  );
};

export default ServiceAdmissionForm;
