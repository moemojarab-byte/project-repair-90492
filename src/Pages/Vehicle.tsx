import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExpandMore, FilterList } from "@mui/icons-material";
import { toast } from "react-toastify";
import { FC, useState } from "react";
import {
  AccordionSummary,
  AccordionDetails,
  Grid2 as Grid,
  useMediaQuery,
  Pagination,
  Accordion,
  Paper,
  Box,
} from "@mui/material";

import { getRepairReceptions } from "@/service/repair/repair.service";
import { getCustomers } from "@/service/customer/customer.service";
import dir from "@/Router/dir";
import {
  PlateNumberDisplay,
  EnhancedSelect,
  VehicleCard,
  Loading,
} from "@/components";

const Vehicle: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<plateSection>({ isDischarged: "false" });
  const navigate = useNavigate();
  const page = searchParams.get("page") ?? 1;
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
  const isCustomRange = useMediaQuery(
    "(min-width: 1200px) and (max-width: 1300px)"
  );
  const getGridSize = () => {
    if (isCustomRange) {
      return { xs: 12, sm: 6, md: 3, lg: 3 };
    }
    return { xs: 12, sm: 6, md: 3, lg: 2 };
  };
  const statusOptions = [
    { value: null, label: "همه" },
    { value: "false", label: "ترخیص نشده" },
    { value: "true", label: "ترخیص شده" },
  ];
  const { isPending: isPendingRepairReceptions, data: vehicles } = useQuery({
    queryKey: ["repairReceptions", page, filter],
    queryFn: () =>
      getRepairReceptions({
        page: page ? +page : 1,
        size: 18,
        isDischarged:
          filter?.isDischarged !== null ? filter?.isDischarged : undefined,
        customerId: filter?.customerId,
        plateSection1: filter?.plateSection1,
        plateSection2: filter?.plateSection2,
        plateSection3: filter?.plateSection3,
        plateSection4: filter?.plateSection4,
      }),
  });
  const { mutateAsync: searchCustomers, isPending } = useMutation({
    mutationFn: getCustomers,
    onSuccess: (data) => {
      if (data?.isSuccess) {
        const options = data?.data?.map((i: any) => ({
          label: i?.fullName,
          value: i.customerId,
          id: `customer-${i.customerId}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }));
        setCustomerOptions(options || []);
      } else {
        toast?.error(data?.message);
      }
    },
  });
  const handleStatusChange = (newValue: any) => {
    setFilter({
      ...filter,
      isDischarged: newValue?.value,
    });
    setSearchParams({ page: "1" });
  };
  const handleCustomerSearch = (newValue: any) => {
    if (newValue?.value) {
      setFilter((prev) => ({ ...prev, customerId: newValue.value }));
    } else {
      setFilter((prev) => ({ ...prev, customerId: undefined }));
    }
    setSearchParams({ page: "1" });
  };
  const handleInputChange = (newInputValue: string) => {
    if (newInputValue.length >= 2) {
      searchCustomers(newInputValue);
    }
  };
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString() });
  };

  const handleCardClick = (
    receptionId: string | number,
    event?: React.MouseEvent
  ) => {
    // Prevent navigation if the click is on a dialog, modal, or delete button
    if (event) {
      const target = event.target as HTMLElement;
      const clickedElement = target.closest(
        '.MuiDialog-root, .MuiModal-root, .delete-button, [role="dialog"]'
      );
      if (clickedElement) {
        return;
      }
    }

    navigate({
      pathname: `${dir.serviceAdmission}`,
      search: `repairReceptionId=${receptionId}`,
    });
  };

  return (
    <Box className="vehicle-page">
      {isPendingRepairReceptions && <Loading />}
      <Box>
        <Accordion
          defaultExpanded
          style={{ borderRadius: "10px", marginBottom: "10px" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="filters-content"
            id="filters-header"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <FilterList />
              <span className="font-16 ms-2">فیلتر ها</span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} display="flex" alignItems="end">
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
                <label className="font-12">شماره پلاک</label>
                <PlateNumberDisplay
                  state={filter}
                  setState={setFilter}
                  setPage={setSearchParams}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
                <EnhancedSelect
                  onChange={handleCustomerSearch}
                  loading={isPending}
                  onInputChange={(value) => {
                    handleInputChange(value);
                  }}
                  options={customerOptions}
                  enableSpeechToText={true}
                  label="جستجوی مشتری"
                  iconPosition="end"
                  searchable={true}
                  disabled={false}
                  name="customer"
                  isRtl={true}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3 }}>
                <EnhancedSelect
                  value={
                    statusOptions?.find(
                      (option) => option.value === filter?.isDischarged
                    ) || statusOptions[0]
                  }
                  onChange={handleStatusChange}
                  enableSpeechToText={true}
                  options={statusOptions}
                  loading={isPending}
                  name="isDischarged"
                  iconPosition="end"
                  searchable={true}
                  disabled={false}
                  label="وضعیت"
                  isRtl={true}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className="vehicle-cards-container p-2">
        <Grid container spacing={2}>
          {vehicles?.data?.values?.map((vehicle: any) => (
            <Grid size={getGridSize()} key={vehicle.id}>
              <Paper
                className="vehicle-card-container cursor-pointer"
                onClick={(e) => handleCardClick(vehicle.id, e)}
              >
                <VehicleCard vehicle={vehicle} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {vehicles?.data?.totalPage && vehicles?.data?.totalPage > 1 && (
        <Paper className="pagination-container flex justify-center mt-12">
          <Pagination
            count={vehicles?.data?.totalPage}
            onChange={handlePageChange}
            boundaryCount={1}
            siblingCount={1}
            showFirstButton
            color="primary"
            showLastButton
            size="large"
            page={+page}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Vehicle;
