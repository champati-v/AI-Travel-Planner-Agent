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
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/utils/firebase'; 

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const { isDark, toggleDark } = useDarkMode();
  const { user } = useAuth();
  const theme = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  console.log('User:', user);

  const menuItems = [
    { text: 'New Trip', icon: <LocateIcon />, action: () => handleNewTrip() },
    { text: 'Last 3 Trips', icon: <HistoryIcon />, action: () => handleLastThreeTrips() },
    { text: 'Logout', icon: <LogOutIcon /> , action: () => handleLogout()},
  ];

  const handleLogout = async () => {
    try{
      await signOut(auth);
      console.log('User logged out successfully');
    }catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      })
    }
    console.log('User logged out');
  }

  const handleNewTrip = () => {
    {user ? window.location.href = '/plan' : toast({
      title: '⚠️ Please Login',
      description: 'You need to login to create a new trip.',
      variant: 'default',
    })
    }
  };

  const handleLastThreeTrips = () => {
    toast({
      title: '⚠️ Under Development',
      description: '🚧 This feature is under development. Stay tuned!',
      variant: 'default',
    });
  };

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
        {menuItems.map(({ text, icon, action }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={action}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-md border-b backdrop-blur-sm">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <LocateIcon className="text-2xl" />
          <span className="text-xl font-semibold ml-2">Trip Planner AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="px-4 py-2 rounded text-primary-foreground transition-all duration-200"
          >
            {isDark ? <SunIcon className="text-white" /> : <MoonIcon className="text-blue-950" />}
          </button>
          <MenuIcon className="cursor-pointer" onClick={toggleDrawer(true)} />
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </div>
      </div>
    </header>
  );
}
