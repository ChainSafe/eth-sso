import type { ReactNode, ReactElement } from "react";
import { Box } from "@mui/material";

interface Props {
  children?: ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel({
  children,
  value,
  index,
  ...other
}: Props): ReactElement {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
