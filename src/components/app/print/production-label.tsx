/* eslint-disable @typescript-eslint/no-explicit-any */
import PlanRoti from "./production-label-roti";
import PlanBatch from "./production-label-batch";

const Plan = (props: any) => {
  const { label = "roti", ...rest } = props;
  const Component = label === "batch" ? PlanBatch : PlanRoti;
  return <Component {...rest} />;
};

export default Plan;
