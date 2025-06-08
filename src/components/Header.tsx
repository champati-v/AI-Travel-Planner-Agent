import * as React from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocateIcon, MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import { HistoryIcon } from 'lucide-react';
import { LogOutIcon } from 'lucide-react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { auth } from '@/utils/firebase';

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const { isDark, toggleDark } = useDarkMode();
  const user = auth.currentUser;
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: 'New Trip', icon: <LocateIcon /> },
    { text: 'Last 3 Trips', icon: <HistoryIcon /> },
    { text: 'Logout', icon: <LogOutIcon /> },
  ];


 const DrawerList = (
    <Box
      sx={{
        width: 250,
        bgcolor: theme.palette.mode === 'dark' ? '#010613' : '#fff',
        color: theme.palette.text.primary,
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='flex justify-between items-center px-8 py-4'>
        <div className="flex items-center">
           <LocateIcon className='text-2xl' />
           <span className='text-xl font-semibold ml-2'>Trip Planner AI</span>
        </div>
        <div className='flex items-center gap-3'>
            <button
                onClick={toggleDark}
                className={`px-4 py-2 rounded text-primary-foreground transition-all duration-200`}
            >
                {isDark ? <SunIcon className="text-white" /> : <MoonIcon className="text-blue-950" />}
            </button>
            <MenuIcon className='cursor-pointer' onClick={toggleDrawer(true)} />
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    </div>
  );
}
