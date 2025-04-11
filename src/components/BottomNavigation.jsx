"use client";

import { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";
import { Home, List } from "lucide-react";

export default function BottomNavBars() {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Navigate based on index
    switch (newValue) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/customerlist");
        break;
    }
  };


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
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange} 
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Customer" icon={<List />} />
      </BottomNavigation>
    </Paper>
  );
}
