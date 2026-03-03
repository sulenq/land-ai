"use client";

import { CContainer } from "@/components/ui/c-container";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/PageShell";
import { DUMMY_DASHBOARD_DATA } from "@/constants/dummyData";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { formatDuration, formatNumber } from "@/utils/formatter";
import {
  Grid,
  GridProps,
  Group,
  GroupProps,
  HStack,
  StackProps,
} from "@chakra-ui/react";
import {
  CheckCheckIcon,
  ClockFadingIcon,
  FilesIcon,
  GitCompareIcon,
  LucideIcon,
  MessageCircleIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";

interface Props__PeriodFilter extends Omit<GroupProps, "onChange"> {
  inputValue: {
    startDate: string;
    endDate: string;
  };
  onChange: (period: { startDate: string; endDate: string }) => void;
}
const PeriodFilter = (props: Props__PeriodFilter) => {
  // Props
  const { inputValue, onChange, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  return (
    <Group attached w={"250px"} {...restProps}>
      <DatePickerInput
        inputValue={[inputValue.startDate]}
        onChange={(newStartDate) => {
          onChange({
            startDate: newStartDate?.[0] || "",
            endDate: inputValue.endDate,
          });
        }}
        labelFormatVariant={"numeric"}
        w={"50%"}
        title={l.start_date}
      />
      <DatePickerInput
        inputValue={[inputValue.endDate]}
        onChange={(newEndDate) => {
          onChange({
            startDate: inputValue.startDate,
            endDate: newEndDate?.[0] || "",
          });
        }}
        labelFormatVariant={"numeric"}
        w={"50%"}
        title={l.end_date}
      />
    </Group>
  );
};

interface Props__OverviewItem extends StackProps {
  icon?: LucideIcon;
  title: string;
  value: string;
  description: string;
}
const OverviewItem = (props: Props__OverviewItem) => {
  // Props
  const { icon, title, value, description, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      gap={4}
      px={4}
      py={3}
      bg={"item"}
      // border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={themeConfig.radii.component}
      pos={"relative"}
      overflow={"clip"}
      {...restProps}
    >
      <CContainer gap={4}>
        <HStack>
          {icon && <AppIcon icon={icon} boxSize={4} />}

          <ClampText color={"fg.muted"}>{title}</ClampText>
        </HStack>

        <CContainer gap={1}>
          <P fontSize={"2xl"} fontWeight={"medium"}>
            {value}
          </P>

          <ClampText fontSize={"sm"} color={"fg.subtle"}>
            {description}
          </ClampText>
        </CContainer>
      </CContainer>
    </HStack>
  );
};

interface Props__Overview extends GridProps {
  totalUsers: number;
  totalDocument: number;
  totalQueryThisDay: number;
  totalDOcumentCompared: number;
  AnswerSuccessRate: number;
  AvgResponseTime: number;
}
const Overview = (props: Props__Overview) => {
  // Props
  const {
    totalUsers,
    totalDocument,
    totalQueryThisDay,
    totalDOcumentCompared,
    AnswerSuccessRate,
    AvgResponseTime,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  // States
  const minChildWidth = "240px";
  const data = [
    {
      icon: UsersIcon,
      label: l.total_users.title,
      value: formatNumber(totalUsers),
      description: l.total_users.description,
    },
    {
      icon: FilesIcon,
      label: l.total_document.title,
      value: formatNumber(totalDocument),
      description: l.total_document.description,
    },
    {
      icon: MessageCircleIcon,
      label: l.total_query_this_day.title,
      value: formatNumber(totalQueryThisDay),
      description: l.total_query_this_day.description,
    },
    {
      icon: GitCompareIcon,
      label: l.total_document_compared.title,
      value: formatNumber(totalDOcumentCompared),
      description: l.total_document_compared.description,
    },
    {
      icon: CheckCheckIcon,
      label: l.answer_success_rate.title,
      value: `${AnswerSuccessRate}%`,
      description: l.answer_success_rate.description,
    },
    {
      icon: ClockFadingIcon,
      label: l.avg_response_time.title,
      value: formatDuration(AvgResponseTime),
      description: l.avg_response_time.description,
    },
  ];

  return (
    <Grid
      templateColumns={`repeat(auto-fill, minmax(${minChildWidth}, 1fr))`}
      gap={4}
      {...restProps}
    >
      {data.map((item, index) => {
        return (
          <OverviewItem
            key={`${item.label}${index}`}
            icon={item.icon}
            title={item.label}
            value={item.value}
            description={item.description}
          />
        );
      })}
    </Grid>
  );
};

export default function Page() {
  // States
  const DEFAULT_FILTER = {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  };
  const [filter, setFilter] = useState<typeof DEFAULT_FILTER>(DEFAULT_FILTER);
  const { initialLoading, error, data, onRetry } = useDataState<any>({
    initialData: DUMMY_DASHBOARD_DATA,
    // url: ``,
    dependencies: [filter],
    dataResource: false,
  });
  const render = {
    loading: <Skeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        <Overview
          totalUsers={data?.overview?.totalUsers}
          totalDocument={data?.overview?.totalDocument}
          totalQueryThisDay={data?.overview?.totalQueryThisDay}
          totalDOcumentCompared={data?.overview?.totalDOcumentCompared}
          AnswerSuccessRate={data?.overview?.AnswerSuccessRate}
          AvgResponseTime={data?.overview?.AvgResponseTime}
        />
      </>
    ),
  };

  return (
    <PageContainer>
      <PageTitle w={"full"} justify={"space-between"}>
        <PeriodFilter
          inputValue={{
            startDate: filter.startDate,
            endDate: filter.endDate,
          }}
          onChange={(inputValue) => {
            setFilter((ps) => ({ ...ps, ...inputValue }));
          }}
        />
      </PageTitle>

      <PageContent px={4} pb={4}>
        {initialLoading && render.loading}
        {!initialLoading && (
          <>
            {error && render.error}
            {!error && (
              <>
                {data && render.loaded}
                {!data && render.empty}
              </>
            )}
          </>
        )}
      </PageContent>
    </PageContainer>
  );
}
