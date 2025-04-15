"use client";

import { usePathname, useRouter } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { Home, IndianRupee, List } from "lucide-react";

export default function BottomNavBars() {
  const pathname = usePathname();
  const router = useRouter();

  const getValueFromPath = (path) => {
    switch (path) {
      case "/":
        return 0;
      case "/customerlist":
        return 1;
      case "/pricelist":
        return 2;
      default:
        return -1;
    }
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/customerlist");
        break;
      case 2:
        router.push("/pricelist");
        break;
    }
  };

  const selectedValue = getValueFromPath(pathname);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={selectedValue} onChange={handleChange}>
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Customer" icon={<List />} />
        <BottomNavigationAction label="Product" icon={<IndianRupee width={20} height={20} />} />
      </BottomNavigation>
    </Paper>
  );
}
