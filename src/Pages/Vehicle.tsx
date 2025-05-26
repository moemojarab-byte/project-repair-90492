import { Grid2 as Grid, Pagination, Box } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FC, useState } from "react";
import { toast } from "react-toastify";

import { getRepairReceptions } from "@/service/repair/repair.service";
import { getCustomers } from "@/service/customer/customer.service";
import {
  PlateNumberDisplay,
  EnhancedSelect,
  VehicleCard,
  Loading,
} from "@/components";

const Vehicle: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") ?? 1;
  const [filter, setFilter] = useState<plateSection>({});
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);
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
        isDischarged: filter?.isDischarged,
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
    if (!newValue?.value) {
      setFilter({
        plateSection1: filter?.plateSection1,
        plateSection2: filter?.plateSection2,
        plateSection3: filter?.plateSection3,
        plateSection4: filter?.plateSection4,
        carCompany: filter?.carCompany,
        customerId: filter?.customerId,
        carTipId: filter?.carTipId,
      });
    } else {
      setFilter({
        ...filter,
        isDischarged: !newValue.value ? null : newValue.value,
      });
      setSearchParams({ page: "1" });
    }
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

  return (
    <Box className="vehicle-page">
      {isPendingRepairReceptions && <Loading />}
      <Box className="filters-container">
        <Grid container spacing={2} display="flex" alignItems="end">
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <label className="font-12">شماره پلاک</label>
            <PlateNumberDisplay
              state={filter}
              setState={setFilter}
              setPage={setSearchParams}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <EnhancedSelect
              defaultValue={
                statusOptions?.find((option) => option.value === "false")?.label
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
      </Box>

      <Box className="vehicle-cards-container p-2">
        <Grid container spacing={2}>
          {vehicles?.data?.values?.map((vehicle: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {vehicles?.data?.totalPage && vehicles?.data?.totalPage > 1 && (
        <Box className="pagination-container flex justify-center mt-12">
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
        </Box>
      )}
    </Box>
  );
};

export default Vehicle;
